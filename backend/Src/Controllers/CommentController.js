import Comment from "../Models/CommentModel.js";
import Post from "../Models/PostModel.js";
import AppError, { catchAsync, sendResponse } from "../Utils/AppError.js";
import { msg } from "../Utils/ResponseHelper.js";
import {
  createCommentSchema,
  updateCommentSchema,
  paginationSchema,
  validateData,
} from "../Validations/CommunityValidation.js";

/**
 * 1. إنشاء تعليق جديد (أو رد على تعليق موجود)
 */
export const createComment = catchAsync(async (req, res, next) => {
  const lang = req.lang || "ar";
  const { postId } = req.params;
  const userId = req.user.id;

  // التحقق من البيانات
  const validation = createCommentSchema.safeParse(req.body);
  if (!validation.success) {
    const issue = validation.error.issues[0];
    const message =
      typeof issue.message === "object"
        ? issue.message[lang] || issue.message["ar"]
        : issue.message;
    return next(new AppError(message, 400));
  }

  const { content, parentCommentId } = validation.data;

  // التحقق من وجود المنشور
  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError(msg("المنشور غير موجود", "Post not found"), 404));
  }

  // إذا كان هناك تعليق أب (تعليق جديد هو رد)
  let parentComment = null;
  if (parentCommentId) {
    parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      return next(
        new AppError(
          msg("التعليق الأب غير موجود", "Parent comment not found"),
          404,
        ),
      );
    }
  }

  // إنشاء التعليق الجديد
  const newComment = await Comment.create({
    post: postId,
    author: userId,
    content,
    parentComment: parentCommentId || null,
  });

  // إذا كان رداً، أضفه إلى قائمة الردود للتعليق الأب
  if (parentComment) {
    parentComment.replies.push(newComment._id);
    await parentComment.save();
  }

  await newComment.populate("author", "fullName personalPhoto role");

  sendResponse(
    res,
    201,
    msg("تم إنشاء التعليق بنجاح", "Comment created successfully"),
    newComment,
  );
});

/**
 * 2. جلب جميع التعليقات على منشور معين
 */
export const getPostComments = catchAsync(async (req, res, next) => {
  const lang = req.lang || "ar";
  const { postId } = req.params;

  // التحقق من معاملات الـ Pagination
  const paginationValidation = paginationSchema.safeParse(req.query);
  if (!paginationValidation.success) {
    const issue = paginationValidation.error.issues[0];
    const message =
      typeof issue.message === "object"
        ? issue.message[lang] || issue.message["ar"]
        : issue.message;
    return next(new AppError(message, 400));
  }

  const { page, limit } = paginationValidation.data;
  const skip = (page - 1) * limit;

  // التحقق من وجود المنشور
  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError(msg("المنشور غير موجود", "Post not found"), 404));
  }

  // جلب التعليقات الرئيسية (بدون تعليق أب)
  const mainComments = await Comment.find({
    post: postId,
    parentComment: null,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "fullName personalPhoto role");

  // جلب الردود المتداخلة لكل تعليق رئيسي
  const commentsWithReplies = await Promise.all(
    mainComments.map(async (comment) => {
      const replies = await Comment.find({
        parentComment: comment._id,
        isDeleted: false,
      })
        .populate("author", "fullName personalPhoto role")
        .sort({ createdAt: 1 });

      return {
        ...comment.toObject(),
        replies,
      };
    }),
  );

  const totalComments = await Comment.countDocuments({
    post: postId,
    parentComment: null,
    isDeleted: false,
  });
  const totalPages = Math.ceil(totalComments / limit);

  sendResponse(
    res,
    200,
    msg("تم جلب التعليقات بنجاح", "Comments fetched successfully"),
    {
      comments: commentsWithReplies,
      pagination: {
        currentPage: page,
        totalPages,
        totalComments,
        limit,
      },
    },
  );
});

/**
 * 3. جلب تعليق واحد بتفاصيله الكاملة مع رداته
 */
export const getCommentDetails = catchAsync(async (req, res, next) => {
  const lang = req.lang || "ar";
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId).populate(
    "author",
    "fullName personalPhoto role",
  );

  if (!comment) {
    return next(
      new AppError(msg("التعليق غير موجود", "Comment not found"), 404),
    );
  }

  // جلب الردود إن كان هذا تعليق رئيسي
  let replies = [];
  if (!comment.parentComment) {
    replies = await Comment.find({
      parentComment: commentId,
      isDeleted: false,
    })
      .populate("author", "fullName personalPhoto role")
      .sort({ createdAt: 1 });
  }

  const commentData = comment.toObject();
  commentData.replies = replies;

  sendResponse(
    res,
    200,
    CommentMessages.COMMENT_DETAILS_FETCHED_SUCCESS,
    commentData,
  );
});

/**
 * 4. تحديث تعليق (لصاحبه فقط)
 */
export const updateComment = catchAsync(async (req, res, next) => {
  const lang = req.lang || "ar";

  // التحقق من البيانات
  const validation = updateCommentSchema.safeParse(req.body);
  if (!validation.success) {
    const issue = validation.error.issues[0];
    const message =
      typeof issue.message === "object"
        ? issue.message[lang] || issue.message["ar"]
        : issue.message;
    return next(new AppError(message, 400));
  }

  const { content } = validation.data;
  const comment = req.comment; // من الـ middleware

  comment.content = content;
  await comment.save();
  await comment.populate("author", "fullName personalPhoto role");

  sendResponse(
    res,
    200,
    msg("تم تحديث التعليق بنجاح", "Comment updated successfully"),
    comment,
  );
});

/**
 * 5. حذف تعليق (حذف ناعم - soft delete)
 * تحذير: إذا كان هناك ردود على التعليق، يجب أيضاً حذفها
 */
export const deleteComment = catchAsync(async (req, res, next) => {
  const lang = req.lang || "ar";
  const comment = req.comment; // من الـ middleware

  // حذف ناعم
  comment.isDeleted = true;
  await comment.save();

  // حذف جميع الردود على هذا التعليق
  if (comment.replies.length > 0) {
    await Comment.updateMany(
      { parentComment: comment._id },
      { isDeleted: true },
    );
  }

  // إذا كان هذا التعليق رداً، قم بحذفه من قائمة الردود للتعليق الأب
  if (comment.parentComment) {
    await Comment.findByIdAndUpdate(
      comment.parentComment,
      { $pull: { replies: comment._id } },
      { new: true },
    );
  }

  sendResponse(
    res,
    200,
    msg("تم حذف التعليق بنجاح", "Comment deleted successfully"),
  );
});

/**
 * 6. تبديل الإعجاب بتعليق (Like/Unlike)
 */
export const toggleCommentLike = catchAsync(async (req, res, next) => {
  const lang = req.lang || "ar";
  const { commentId } = req.params;
  const userId = req.user.id;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new AppError(CommentMessages.COMMENT_NOT_FOUND, 404));
  }

  // التحقق من وجود الإعجاب
  const likeIndex = comment.likes.indexOf(userId);

  if (likeIndex > -1) {
    // الإعجاب موجود، قم بحذفه (Unlike)
    comment.likes.splice(likeIndex, 1);
    await comment.save();

    await comment.populate("author", "fullName personalPhoto role");

    return sendResponse(
      res,
      200,
      CommentMessages.COMMENT_UNLIKE_SUCCESS,
      comment,
    );
  } else {
    // لا يوجد إعجاب، أضفه (Like)
    comment.likes.push(userId);
    await comment.save();

    await comment.populate("author", "fullName personalPhoto role");

    return sendResponse(
      res,
      200,
      CommentMessages.COMMENT_LIKE_SUCCESS,
      comment,
    );
  }
});

/**
 * 7. جلب معلومات الإحصائيات للتعليق
 */
export const getCommentStats = catchAsync(async (req, res, next) => {
  const lang = req.lang || "ar";
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new AppError(CommentMessages.COMMENT_NOT_FOUND, 404));
  }

  const stats = {
    likeCount: comment.likes.length,
    replyCount: comment.replies.length,
    createdAt: comment.createdAt,
    editedAt: comment.editedAt,
    isEdited: !!comment.editedAt,
  };

  sendResponse(res, 200, CommentMessages.COMMENT_STATS_FETCHED_SUCCESS, stats);
});

/**
 * 8. جلب جميع ردود تعليق معين (Nested Replies)
 */
export const getCommentReplies = catchAsync(async (req, res, next) => {
  const lang = req.lang || "ar";
  const { commentId } = req.params;

  // التحقق من معاملات الـ Pagination
  const paginationValidation = paginationSchema.safeParse(req.query);
  if (!paginationValidation.success) {
    const issue = paginationValidation.error.issues[0];
    const message =
      typeof issue.message === "object"
        ? issue.message[lang] || issue.message["ar"]
        : issue.message;
    return next(new AppError(message, 400));
  }

  const { page, limit } = paginationValidation.data;
  const skip = (page - 1) * limit;

  // التحقق من وجود التعليق الأب
  const parentComment = await Comment.findById(commentId);
  if (!parentComment) {
    return next(new AppError(CommentMessages.PARENT_COMMENT_NOT_FOUND, 404));
  }

  // جلب الردود
  const replies = await Comment.find({
    parentComment: commentId,
    isDeleted: false,
  })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "fullName personalPhoto role");

  const totalReplies = await Comment.countDocuments({
    parentComment: commentId,
    isDeleted: false,
  });
  const totalPages = Math.ceil(totalReplies / limit);

  sendResponse(res, 200, CommentMessages.REPLIES_FETCHED_SUCCESS, {
    replies,
    pagination: {
      currentPage: page,
      totalPages,
      totalReplies,
      limit,
    },
  });
});

/**
 * 9. جلب تعليقات المستخدم الحالي (My Comments)
 */
export const getMyComments = catchAsync(async (req, res, next) => {
  const lang = req.lang || "ar";
  const userId = req.user.id;

  // التحقق من معاملات الـ Pagination
  const paginationValidation = paginationSchema.safeParse(req.query);
  if (!paginationValidation.success) {
    const issue = paginationValidation.error.issues[0];
    const message =
      typeof issue.message === "object"
        ? issue.message[lang] || issue.message["ar"]
        : issue.message;
    return next(new AppError(message, 400));
  }

  const { page, limit } = paginationValidation.data;
  const skip = (page - 1) * limit;

  const comments = await Comment.find({ author: userId, isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "fullName personalPhoto role")
    .populate("post", "content");

  const totalComments = await Comment.countDocuments({
    author: userId,
    isDeleted: false,
  });
  const totalPages = Math.ceil(totalComments / limit);

  sendResponse(res, 200, CommentMessages.MY_COMMENTS_FETCHED_SUCCESS, {
    comments,
    pagination: {
      currentPage: page,
      totalPages,
      totalComments,
      limit,
    },
  });
});
