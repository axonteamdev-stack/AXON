import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import AppError from "../utils/appError.js";
import { msg } from "../utils/i18n.js";
import * as ArticleService from "../services/articleService.js";

export const createArticle = catchAsync(async (req, res) => {
  const article = await ArticleService.create(req.user.id, req.body, req.files);
  sendResponse(res, 201, msg("تم نشر المقال بنجاح", "Article published successfully"), article);
});

export const getAllArticles = catchAsync(async (req, res) => {
  const articles = await ArticleService.getAll();
  sendResponse(res, 200, msg("تم جلب جميع المقالات", "All articles fetched"), articles);
});

export const getFollowingArticles = catchAsync(async (req, res) => {
  const articles = await ArticleService.getFollowing(req.user.id);
  sendResponse(res, 200, msg("تم جلب مقالات المتابعين", "Following articles fetched"), articles);
});

export const getMyArticles = catchAsync(async (req, res) => {
  const articles = await ArticleService.getByDoctor(req.user.id);
  sendResponse(res, 200, msg("تم جلب مقالاتك", "Your articles fetched"), articles);
});

export const getArticleDetails = catchAsync(async (req, res) => {
  const article = await ArticleService.getById(req.params.id);
  if (!article)
    throw new AppError(msg("المقال غير موجود", "Article not found"), 404);
  sendResponse(res, 200, msg("تم جلب تفاصيل المقال", "Article details fetched"), { article });
});

export const toggleLike = catchAsync(async (req, res) => {
  const result = await ArticleService.toggleLike(req.params.id, req.user.id);
  sendResponse(res, 200, msg(
    result.liked ? "تم الإعجاب" : "تم إلغاء الإعجاب",
    result.liked ? "Liked" : "Unliked"
  ), { likeCount: result.likeCount, isLiked: result.liked });
});

export const deleteArticle = catchAsync(async (req, res) => {
  await ArticleService.remove(req.params.id);
  sendResponse(res, 200, msg("تم حذف المقال بنجاح", "Article deleted successfully"));
});

export const updateArticle = catchAsync(async (req, res) => {
  const article = await ArticleService.update(req.params.id, req.body, req.files);
  sendResponse(res, 200, msg("تم تحديث المقال بنجاح", "Article updated successfully"), article);
});
