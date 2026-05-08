import mongoose from "mongoose";
import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";
import User from "../models/userModel.js";
import { processPostImages, deleteFile } from "./fileService.js";
import AppError from "../utils/appError.js";
import { msg } from "../utils/i18n.js";
import { buildAuthorLookup, buildCommentLookup } from "../utils/aggregation.js";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const MAX_POST_IMAGES = 10;

const getSortOption = (sortBy) => {
  if (sortBy === "trending") return { likeCount: -1, createdAt: -1 };
  if (sortBy === "popular") return { "likes.count": -1 };
  return { createdAt: -1 };
};

const buildVisibilityFilter = async (userId) => {
  const base = [{ visibility: "public" }];
  if (!userId) return base;

  const user = await User.findById(userId).select("following").lean();
  const following = user?.following || [];

  return [
    ...base,
    { $and: [{ visibility: "followers" }, { author: { $in: following } }] },
    { author: new mongoose.Types.ObjectId(userId), visibility: "private" },
  ];
};

export const getExploreFeeds = async (page = 1, limit = DEFAULT_LIMIT, sortBy = "recent", userId = null) => {
  const clampedLimit = Math.min(limit, MAX_LIMIT);
  const visibilityFilter = await buildVisibilityFilter(userId);

  const [posts, total] = await Promise.all([
    Post.aggregate([
      { $match: { $or: visibilityFilter } },
      ...buildCommentLookup(),
      ...buildAuthorLookup(),
      { $project: { isDeleted: 0 } },
      { $sort: getSortOption(sortBy) },
      { $skip: (page - 1) * clampedLimit },
      { $limit: clampedLimit },
    ]),
    Post.countDocuments({ $or: visibilityFilter }),
  ]);

  return {
    data: posts,
    pagination: {
      current: page,
      limit: clampedLimit,
      total,
      pages: Math.ceil(total / clampedLimit),
    },
  };
};

export const getFollowingFeeds = async (userId, page = 1, limit = DEFAULT_LIMIT) => {
  const clampedLimit = Math.min(limit, MAX_LIMIT);
  const user = await User.findById(userId).select("following").lean();
  if (!user)
    throw new AppError(msg("المستخدم غير موجود", "User not found"), 404);

  const [posts, total] = await Promise.all([
    Post.aggregate([
      {
        $match: {
          author: { $in: user.following },
          $or: [
            { visibility: "public" },
            { visibility: "followers" },
            { author: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      ...buildCommentLookup(),
      ...buildAuthorLookup(),
      { $project: { isDeleted: 0 } },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * clampedLimit },
      { $limit: clampedLimit },
    ]),
    Post.countDocuments({ author: { $in: user.following } }),
  ]);

  return {
    data: posts,
    pagination: {
      current: page,
      limit: clampedLimit,
      total,
      pages: Math.ceil(total / clampedLimit),
    },
  };
};

export const getPostDetails = async (postId, userId = null) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new AppError(msg("معرف المنشور غير صالح", "Invalid post ID"), 400);
  }

  const post = await Post.findById(postId)
    .populate("author", "fullName personalPhoto role")
    .lean();

  if (!post)
    throw new AppError(msg("المنشور غير موجود", "Post not found"), 404);
  if (!post.author) {
    throw new AppError(msg("بيانات الكاتب تالفة", "Post author data is corrupted"), 500);
  }

  if (post.visibility === "private") {
    const isOwner = userId && post.author._id.toString() === userId;
    if (!isOwner) {
      throw new AppError(msg("لا يمكنك عرض هذا المنشور", "You cannot view this post"), 403);
    }
  }

  const commentCount = await Comment.countDocuments({ post: postId, isDeleted: false });
  return { ...post, commentCount };
};

export const createPost = async (userId, postData, files) => {
  const savedFiles = [];
  try {
    const images = files?.length ? await processPostImages(files) : [];
    savedFiles.push(...images);

    const post = await Post.create({
      author: userId,
      content: postData.content,
      tags: postData.tags || [],
      visibility: postData.visibility || "public",
      images,
    });

    await post.populate("author", "fullName personalPhoto role");
    return post;
  } catch (err) {
    await Promise.all(savedFiles.map(deleteFile));
    throw err;
  }
};

export const deletePost = async (postId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await Post.findById(postId).session(session);
    if (!post)
      throw new AppError(msg("المنشور غير موجود", "Post not found"), 404);
    if (post.author.toString() !== userId) {
      throw new AppError(msg("ليس لديك صلاحية حذف هذا المنشور", "You do not have permission"), 403);
    }

    await Promise.all(post.images.map((img) => deleteFile(img)));
    await Post.findByIdAndDelete(postId, { session });
    await Comment.deleteMany({ post: postId }, { session });
    await User.updateMany({ likes: postId }, { $pull: { likes: postId } }, { session });

    await session.commitTransaction();
    return true;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const updatePost = async (postId, userId, updateData, files = []) => {
  const savedFiles = [];
  try {
    const post = await Post.findById(postId);
    if (!post)
      throw new AppError(msg("المنشور غير موجود", "Post not found"), 404);
    if (post.author.toString() !== userId) {
      throw new AppError(msg("ليس لديك صلاحية تعديل هذا المنشور", "No permission"), 403);
    }

    if (updateData.content) post.content = updateData.content;
    if (updateData.tags) post.tags = updateData.tags;
    if (updateData.visibility) post.visibility = updateData.visibility;

    if (files?.length) {
      const newImages = await processPostImages(files);
      post.images = [...(post.images || []), ...newImages].slice(0, MAX_POST_IMAGES);
      savedFiles.push(...newImages);
    }

    await post.save();
    await post.populate("author", "fullName personalPhoto role");
    return post;
  } catch (err) {
    await Promise.all(savedFiles.map(deleteFile));
    throw err;
  }
};

export const toggleLike = async (postId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new AppError(msg("معرف المنشور غير صالح", "Invalid post ID"), 400);
  }

  const addResult = await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } });

  if (addResult.modifiedCount === 0) {
    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
    return { liked: false };
  }

  return { liked: true };
};

export const getMyPosts = async (userId, page = 1, limit = DEFAULT_LIMIT) => {
  const clampedLimit = Math.min(limit, MAX_LIMIT);

  const [posts, total] = await Promise.all([
    Post.aggregate([
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
          isDeleted: false,
        },
      },
      ...buildCommentLookup(),
      ...buildAuthorLookup(),
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * clampedLimit },
      { $limit: clampedLimit },
    ]),
    Post.countDocuments({ author: userId, isDeleted: false }),
  ]);

  return {
    data: posts,
    pagination: {
      current: page,
      limit: clampedLimit,
      total,
      pages: Math.ceil(total / clampedLimit),
    },
  };
};

export const searchByTags = async (tag, page = 1, limit = DEFAULT_LIMIT) => {
  const clampedLimit = Math.min(limit, MAX_LIMIT);

  const [posts, total] = await Promise.all([
    Post.aggregate([
      {
        $match: {
          tags: tag,
          visibility: "public",
          isDeleted: false,
        },
      },
      ...buildCommentLookup(),
      ...buildAuthorLookup(),
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * clampedLimit },
      { $limit: clampedLimit },
    ]),
    Post.countDocuments({ tags: tag, visibility: "public", isDeleted: false }),
  ]);

  return {
    data: posts,
    pagination: {
      current: page,
      limit: clampedLimit,
      total,
      pages: Math.ceil(total / clampedLimit),
    },
  };
};
