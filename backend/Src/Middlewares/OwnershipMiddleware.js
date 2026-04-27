import AppError, { catchAsync } from "../Utils/AppError.js";
import Post from "../Models/PostModel.js";
import Comment from "../Models/CommentModel.js";
import User from "../Models/UserModel.js";
import { msg } from "../Utils/ResponseHelper.js";

/**
 * Middleware للتحقق من ملكية المنشور
 * يتأكد من أن المستخدم هو صاحب المنشور أو أدمن
 */
export const checkPostOwnership = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  // البحث عن المنشور مع إخفاء الحقول المخفية
  const post = await Post.findById(postId).select("+isDeleted");

  if (!post) {
    return next(new AppError(msg("المنشور غير موجود", "Post not found"), 404));
  }

  // التحقق من أن المستخدم هو صاحب المنشور أو أدمن
  if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new AppError(
        msg(
          "ليس لديك صلاحية تعديل أو حذف هذا المنشور",
          "You do not have permission to edit or delete this post",
        ),
        403,
      ),
    );
  }

  // حفظ المنشور في الطلب للاستخدام في الكونترولر
  req.post = post;
  next();
});

/**
 * Middleware للتحقق من ملكية التعليق
 * يتأكد من أن المستخدم هو صاحب التعليق أو أدمن
 */
export const checkCommentOwnership = catchAsync(async (req, res, next) => {
  const commentId = req.params.commentId;

  // البحث عن التعليق مع إخفاء الحقول المخفية
  const comment = await Comment.findById(commentId).select("+isDeleted");

  if (!comment) {
    return next(
      new AppError(msg("التعليق غير موجود", "Comment not found"), 404),
    );
  }

  // التحقق من أن المستخدم هو صاحب التعليق أو أدمن
  if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new AppError(
        msg(
          "ليس لديك صلاحية تعديل أو حذف هذا التعليق",
          "You do not have permission to edit or delete this comment",
        ),
        403,
      ),
    );
  }

  // حفظ التعليق في الطلب للاستخدام في الكونترولر
  req.comment = comment;
  next();
});

/**
 * Middleware للتحقق من أن المستخدم يتابع المستخدم الآخر
 * (مفيد للتحقق من صلاحية الوصول إلى المنشورات الخاصة)
 */
export const checkFollowStatus = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const targetUserId = req.params.userId || req.query.userId;

  if (userId === targetUserId) {
    return next();
  }

  const user = await User.findById(userId).select("following");
  if (!user) {
    return next(
      new AppError(
        msg(
          "المستخدم صاحب هذا التوكن لم يعد موجوداً",
          "The token owner no longer exists",
        ),
        401,
      ),
    );
  }

  const followingIds = (user.following || []).map((id) => id.toString());
  if (!followingIds.includes(String(targetUserId))) {
    return next(
      new AppError(
        msg(
          "يجب أن تتابع هذا المستخدم لعرض منشوراته الخاصة",
          "You must follow this user to view their private posts",
        ),
        403,
      ),
    );
  }

  next();
});
