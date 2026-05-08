import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import AppError from "../utils/appError.js";
import { validate } from "../middlewares/validate.js";
import { msg } from "../utils/i18n.js";
import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../validators/commentValidator.js";
import { paginationSchema } from "../validators/sharedValidator.js";

export const createComment = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const { content, parentCommentId } = validate(createCommentSchema, req.body);

  const post = await Post.findById(postId).lean();
  if (!post)
    throw new AppError(msg("المنشور غير موجود", "Post not found"), 404);

  if (parentCommentId) {
    const parent = await Comment.exists({ _id: parentCommentId, post: postId });
    if (!parent)
      throw new AppError(msg("التعليق الأب غير موجود", "Parent comment not found"), 404);
  }

  const comment = await Comment.create({
    post: postId,
    author: userId,
    content,
    parentComment: parentCommentId || null,
  });

  if (parentCommentId) {
    await Comment.findByIdAndUpdate(parentCommentId, { $push: { replies: comment._id } });
  }

  await comment.populate("author", "fullName personalPhoto role");
  sendResponse(res, 201, msg("تم إنشاء التعليق بنجاح", "Comment created successfully"), comment);
});

export const getPostComments = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const { page, limit } = validate(paginationSchema, req.query);

  const post = await Post.exists({ _id: postId });
  if (!post)
    throw new AppError(msg("المنشور غير موجود", "Post not found"), 404);

  const [mainComments, totalComments] = await Promise.all([
    Comment.find({ post: postId, parentComment: null, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "fullName personalPhoto role")
      .lean(),
    Comment.countDocuments({ post: postId, parentComment: null, isDeleted: false }),
  ]);

  const commentsWithReplies = await Promise.all(
    mainComments.map(async (comment) => {
      const replies = await Comment.find({
        parentComment: comment._id,
        isDeleted: false,
      })
        .populate("author", "fullName personalPhoto role")
        .sort({ createdAt: 1 })
        .lean();
      return { ...comment, replies };
    })
  );

  sendResponse(res, 200, msg("تم جلب التعليقات بنجاح", "Comments fetched successfully"), {
    comments: commentsWithReplies,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
      totalComments,
      limit,
    },
  });
});

export const getCommentDetails = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId)
    .populate("author", "fullName personalPhoto role")
    .lean();

  if (!comment)
    throw new AppError(msg("التعليق غير موجود", "Comment not found"), 404);

  const replies = !comment.parentComment
    ? await Comment.find({ parentComment: commentId, isDeleted: false })
        .populate("author", "fullName personalPhoto role")
        .sort({ createdAt: 1 })
        .lean()
    : [];

  sendResponse(res, 200, msg("تم جلب التعليق بنجاح", "Comment fetched successfully"), {
    ...comment,
    replies,
  });
});

export const updateComment = catchAsync(async (req, res) => {
  const { content } = validate(updateCommentSchema, req.body);
  const { comment } = req;

  comment.content = content;
  await comment.save();
  await comment.populate("author", "fullName personalPhoto role");

  sendResponse(res, 200, msg("تم تحديث التعليق بنجاح", "Comment updated successfully"), comment);
});

export const deleteComment = catchAsync(async (req, res) => {
  const { comment } = req;
  await Promise.all([
    Comment.findByIdAndUpdate(comment._id, { isDeleted: true }),
    comment.parentComment
      ? Comment.findByIdAndUpdate(comment.parentComment, { $pull: { replies: comment._id } })
      : Promise.resolve(),
    Comment.updateMany({ parentComment: comment._id }, { isDeleted: true }),
  ]);

  sendResponse(res, 200, msg("تم حذف التعليق بنجاح", "Comment deleted successfully"));
});

export const toggleCommentLike = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  const addResult = await Comment.updateOne(
    { _id: commentId },
    { $addToSet: { likes: userId } }
  );

  let isLiked;
  if (addResult.modifiedCount === 0) {
    await Comment.updateOne({ _id: commentId }, { $pull: { likes: userId } });
    isLiked = false;
  } else {
    isLiked = true;
  }

  const updated = await Comment.findById(commentId).populate(
    "author",
    "fullName personalPhoto role"
  );

  sendResponse(
    res,
    200,
    msg(
      isLiked ? "تم الإعجاب بنجاح" : "تم إلغاء الإعجاب بنجاح",
      isLiked ? "Liked successfully" : "Like removed successfully"
    ),
    updated
  );
});

export const getCommentStats = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId).lean();
  if (!comment)
    throw new AppError(msg("التعليق غير موجود", "Comment not found"), 404);

  sendResponse(res, 200, msg("تم جلب الإحصائيات بنجاح", "Stats fetched successfully"), {
    likeCount: comment.likes.length,
    replyCount: comment.replies.length,
    createdAt: comment.createdAt,
    editedAt: comment.editedAt,
    isEdited: !!comment.editedAt,
  });
});

export const getCommentReplies = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { page, limit } = validate(paginationSchema, req.query);

  const parentExists = await Comment.exists({ _id: commentId });
  if (!parentExists)
    throw new AppError(msg("التعليق الأب غير موجود", "Parent comment not found"), 404);

  const [replies, totalReplies] = await Promise.all([
    Comment.find({ parentComment: commentId, isDeleted: false })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "fullName personalPhoto role")
      .lean(),
    Comment.countDocuments({ parentComment: commentId, isDeleted: false }),
  ]);

  sendResponse(res, 200, msg("تم جلب الردود بنجاح", "Replies fetched successfully"), {
    replies,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalReplies / limit),
      totalReplies,
      limit,
    },
  });
});

export const getMyComments = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { page, limit } = validate(paginationSchema, req.query);

  const [comments, totalComments] = await Promise.all([
    Comment.find({ author: userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "fullName personalPhoto role")
      .populate("post", "content")
      .lean(),
    Comment.countDocuments({ author: userId, isDeleted: false }),
  ]);

  sendResponse(res, 200, msg("تم جلب تعليقاتك بنجاح", "Your comments fetched successfully"), {
    comments,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
      totalComments,
      limit,
    },
  });
});
