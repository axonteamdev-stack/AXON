import { PostService } from "../Services/PostService.js";
import FileService from "../Services/FileService.js";
import AppError, { catchAsync, sendResponse } from "../Utils/AppError.js";
import { msg } from "../Utils/ResponseHelper.js";
import {
  createPostSchema,
  updatePostSchema,
  paginationSchema,
} from "../Validations/CommunityValidation.js";

/**
 * Create new post
 */
export const createPost = catchAsync(async (req, res, next) => {
  // Validate data
  const validation = createPostSchema.safeParse(req.body);
  if (!validation.success) {
    const issue = validation.error.issues[0];
    return next(new AppError(issue.message, 400));
  }

  const { content, tags, visibility } = validation.data;

  try {
    const post = await PostService.createPost(
      req.user.id,
      {
        content,
        tags: tags || [],
        visibility,
      },
      req.files || [],
    );

    sendResponse(
      res,
      201,
      msg("تم إنشاء المنشور بنجاح", "Post created successfully"),
      post,
    );
  } catch (error) {
    next(error);
  }
});

/**
 * Get explore feed
 */
export const getExploreFeeds = catchAsync(async (req, res, next) => {
  const paginationValidation = paginationSchema.safeParse(req.query);
  if (!paginationValidation.success) {
    const issue = paginationValidation.error.issues[0];
    return next(new AppError(issue.message, 400));
  }

  const { page, limit } = paginationValidation.data;
  const sortBy = req.query.sortBy || "recent";

  const result = await PostService.getExploreFeeds(
    page,
    limit,
    sortBy,
    req.user ? req.user.id : null,
  );

  sendResponse(
    res,
    200,
    msg("تم جلب المنشورات بنجاح", "Posts fetched successfully"),
    result,
  );
});

/**
 * Get following feed
 */
export const getFollowingFeeds = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const paginationValidation = paginationSchema.safeParse(req.query);
  if (!paginationValidation.success) {
    const issue = paginationValidation.error.issues[0];
    return next(new AppError(issue.message, 400));
  }

  const { page, limit } = paginationValidation.data;

  const result = await PostService.getFollowingFeeds(userId, page, limit);

  sendResponse(
    res,
    200,
    msg("تم جلب تغذية المتابعين بنجاح", "Following feed fetched successfully"),
    result,
  );
});

/**
 * Get post details with comments
 */
export const getPostDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await PostService.getPostDetails(id, req.user?.id);

    sendResponse(
      res,
      200,
      msg("تم جلب تفاصيل المنشور بنجاح", "Post details fetched successfully"),
      post,
    );
  } catch (error) {
    if (error.statusCode === 404) {
      return next(
        new AppError(msg("المنشور غير موجود", "Post not found"), 404),
      );
    }
    next(error);
  }
});

/**
 * Update post
 */
export const updatePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const validation = updatePostSchema.safeParse(req.body);
  if (!validation.success) {
    const issue = validation.error.issues[0];
    return next(new AppError(issue.message, 400));
  }

  const { content, tags, visibility } = validation.data;

  try {
    const post = await PostService.updatePost(
      id,
      req.user.id,
      {
        content,
        tags,
        visibility,
      },
      req.files || [],
    );

    sendResponse(
      res,
      200,
      msg("تم تحديث المنشور بنجاح", "Post updated successfully"),
      post,
    );
  } catch (error) {
    next(error);
  }
});

/**
 * Delete post (soft delete)
 */
export const deletePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    await PostService.deletePost(id, req.user.id);

    sendResponse(
      res,
      200,
      msg("تم حذف المنشور بنجاح", "Post deleted successfully"),
    );
  } catch (error) {
    next(error);
  }
});

/**
 * Toggle like/unlike
 */
export const toggleLike = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await PostService.toggleLike(id, req.user.id);

    sendResponse(
      res,
      200,
      result.liked
        ? msg("تم الإعجاب بالمنشور", "Post liked successfully")
        : msg("تم إلغاء الإعجاب بالمنشور", "Post unliked successfully"),
      { liked: result.liked },
    );
  } catch (error) {
    next(error);
  }
});

/**
 * Get my posts
 */
export const getMyPosts = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const paginationValidation = paginationSchema.safeParse(req.query);
  if (!paginationValidation.success) {
    const issue = paginationValidation.error.issues[0];
    return next(new AppError(issue.message, 400));
  }

  const { page, limit } = paginationValidation.data;

  const result = await PostService.getMyPosts(userId, page, limit);

  sendResponse(
    res,
    200,
    msg("تم جلب منشوراتي بنجاح", "My posts fetched successfully"),
    result,
  );
});

/**
 * Search posts by tags
 */
export const searchByTags = catchAsync(async (req, res, next) => {
  const { tag } = req.query;

  if (!tag || tag.trim().length === 0) {
    return next(new AppError(msg("الوسم مطلوب", "Tag is required"), 400));
  }

  const paginationValidation = paginationSchema.safeParse(req.query);
  if (!paginationValidation.success) {
    const issue = paginationValidation.error.issues[0];
    return next(new AppError(issue.message, 400));
  }

  const { page, limit } = paginationValidation.data;

  const result = await PostService.searchByTags(tag.toLowerCase(), page, limit);

  sendResponse(
    res,
    200,
    msg("تم جلب نتائج البحث بنجاح", "Search results fetched successfully"),
    result,
  );
});
