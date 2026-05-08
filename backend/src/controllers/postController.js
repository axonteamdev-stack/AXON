import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import { validate } from "../middlewares/validate.js";
import { msg } from "../utils/i18n.js";
import { createPostSchema, updatePostSchema } from "../validators/postValidator.js";
import { paginationSchema } from "../validators/sharedValidator.js";
import * as PostService from "../services/postService.js";

export const createPost = catchAsync(async (req, res) => {
  const { content, tags, visibility } = validate(createPostSchema, req.body);
  const post = await PostService.createPost(req.user.id, { content, tags: tags || [], visibility }, req.files || []);
  sendResponse(res, 201, msg("تم إنشاء المنشور بنجاح", "Post created successfully"), post);
});

export const getExploreFeeds = catchAsync(async (req, res) => {
  const { page, limit } = validate(paginationSchema, req.query);
  const sortBy = req.query.sortBy || "recent";
  const result = await PostService.getExploreFeeds(page, limit, sortBy, req.user?.id || null);
  sendResponse(res, 200, msg("تم جلب المنشورات بنجاح", "Posts fetched successfully"), result);
});

export const getFollowingFeeds = catchAsync(async (req, res) => {
  const { page, limit } = validate(paginationSchema, req.query);
  const result = await PostService.getFollowingFeeds(req.user.id, page, limit);
  sendResponse(res, 200, msg("تم جلب تغذية المتابعين بنجاح", "Following feed fetched successfully"), result);
});

export const getPostDetails = catchAsync(async (req, res) => {
  const post = await PostService.getPostDetails(req.params.id, req.user?.id);
  sendResponse(res, 200, msg("تم جلب تفاصيل المنشور بنجاح", "Post details fetched successfully"), post);
});

export const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { content, tags, visibility } = validate(updatePostSchema, req.body);
  const post = await PostService.updatePost(id, req.user.id, { content, tags, visibility }, req.files || []);
  sendResponse(res, 200, msg("تم تحديث المنشور بنجاح", "Post updated successfully"), post);
});

export const deletePost = catchAsync(async (req, res) => {
  await PostService.deletePost(req.params.id, req.user.id);
  sendResponse(res, 200, msg("تم حذف المنشور بنجاح", "Post deleted successfully"));
});

export const toggleLike = catchAsync(async (req, res) => {
  const result = await PostService.toggleLike(req.params.id, req.user.id);
  sendResponse(res, 200, msg(
    result.liked ? "تم الإعجاب بالمنشور" : "تم إلغاء الإعجاب بالمنشور",
    result.liked ? "Post liked successfully" : "Post unliked successfully"
  ), { liked: result.liked });
});

export const getMyPosts = catchAsync(async (req, res) => {
  const { page, limit } = validate(paginationSchema, req.query);
  const result = await PostService.getMyPosts(req.user.id, page, limit);
  sendResponse(res, 200, msg("تم جلب منشوراتك بنجاح", "My posts fetched successfully"), result);
});

export const searchByTags = catchAsync(async (req, res) => {
  const { tag } = req.query;
  if (!tag?.trim()) throw new AppError(msg("الوسم مطلوب", "Tag is required"), 400);

  const { page, limit } = validate(paginationSchema, req.query);
  const result = await PostService.searchByTags(tag.trim(), page, limit);
  sendResponse(res, 200, msg("تم جلب نتائج البحث بنجاح", "Search results fetched successfully"), result);
});
