/**
 * PostService - Post business logic
 * Uses aggregation pipeline to prevent N+1 queries
 */

import mongoose from "mongoose";
import Post from "../Models/PostModel.js";
import Comment from "../Models/CommentModel.js";
import User from "../Models/UserModel.js";
import FileService from "./FileService.js";
import AppError from "../Utils/AppError.js";
import { SORT_FIELDS, VISIBILITY, PAGINATION } from "../Constants/index.js";
import { msg } from "../Utils/ResponseHelper.js";

export class PostService {
  /**
   * Fetching posts with comment counts using aggregation pipeline
   * Single query instead of N+1 queries
   */
  static async getExploreFeeds(page = 1, limit = 10, sortBy = "recent", userId = null) {
    const skip = (page - 1) * limit;

    // Determine sort option
    let sortOption = { createdAt: -1 };
    if (sortBy === SORT_FIELDS.TRENDING) {
      sortOption = { likeCount: -1, createdAt: -1 };
    } else if (sortBy === SORT_FIELDS.POPULAR) {
      sortOption = { "likes.count": -1 };
    }

    // Build visibility filter
    let visibilityFilter = [{ visibility: VISIBILITY.PUBLIC }];

    if (userId) {
      visibilityFilter = [
        { visibility: VISIBILITY.PUBLIC },
        {
          $and: [
            { visibility: VISIBILITY.FOLLOWERS },
            { author: { $in: (await this.getUserFollowing(userId)) || [] } },
          ],
        },
        { author: new mongoose.Types.ObjectId(userId), visibility: VISIBILITY.PRIVATE },
      ];
    }

    // AGGREGATION PIPELINE - Single efficient query
    const posts = await Post.aggregate([
      {
        $match: {
          $or: visibilityFilter,
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$post", "$$postId"] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "commentMetrics",
        },
      },
      {
        $addFields: {
          commentCount: {
            $arrayElemAt: ["$commentMetrics.count", 0],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorData",
        },
      },
      {
        $unwind: {
          path: "$authorData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          author: {
            _id: "$authorData._id",
            fullName: "$authorData.fullName",
            personalPhoto: "$authorData.personalPhoto",
            role: "$authorData.role",
          },
        },
      },
      {
        $project: {
          authorData: 0,
          commentMetrics: 0,
          isDeleted: 0,
        },
      },
      { $sort: sortOption },
      { $skip: skip },
      { $limit: limit },
    ]);

    // Total must use the same visibility predicate as the aggregation $match
    const totalPosts = await Post.countDocuments({
      $or: visibilityFilter,
    });

    return {
      data: posts,
      pagination: {
        current: page,
        limit,
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit),
      },
    };
  }

  /**
   * Get following feed for authenticated user
   */
  static async getFollowingFeeds(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const user = await User.findById(userId).select("following");

    if (!user) {
      throw new AppError(
        msg("المستخدم غير موجود", "User not found"),
        404,
      );
    }

    // Using aggregation pipeline for efficiency
    const posts = await Post.aggregate([
      {
        $match: {
          author: { $in: user.following },
          $or: [
            { visibility: VISIBILITY.PUBLIC },
            { visibility: VISIBILITY.FOLLOWERS },
            { author: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$post", "$$postId"] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "commentMetrics",
        },
      },
      {
        $addFields: {
          commentCount: {
            $arrayElemAt: ["$commentMetrics.count", 0],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorData",
        },
      },
      {
        $unwind: {
          path: "$authorData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          author: {
            _id: "$authorData._id",
            fullName: "$authorData.fullName",
            personalPhoto: "$authorData.personalPhoto",
            role: "$authorData.role",
          },
        },
      },
      {
        $project: {
          authorData: 0,
          commentMetrics: 0,
          isDeleted: 0,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalPosts = await Post.countDocuments({
      author: { $in: user.following },
    });

    return {
      data: posts,
      pagination: {
        current: page,
        limit,
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit),
      },
    };
  }

  /**
   * Get single post details
   */
  static async getPostDetails(postId, userId = null) {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new AppError(
        msg("معرف المنشور غير صالح", "Invalid post ID"),
        400,
      );
    }

    const post = await Post.findById(postId)
      .populate("author", "fullName personalPhoto role")
      .lean();

    if (!post) {
      throw new AppError(
        msg("المنشور غير موجود", "Post not found"),
        404,
      );
    }

    // Guard against null author
    if (!post.author) {
      throw new AppError(
        msg("بيانات الكاتب تالفة", "Post author data is corrupted"),
        500,
      );
    }

    // Check visibility
    if (post.visibility === VISIBILITY.PRIVATE) {
      if (!userId || post.author._id.toString() !== userId) {
        throw new AppError(
          msg("لا يمكنك عرض هذا المنشور", "You cannot view this post"),
          403,
        );
      }
    }

    // Get comment count
    const commentCount = await Comment.countDocuments({
      post: postId,
      isDeleted: false,
    });

    return {
      ...post,
      commentCount,
    };
  }

  /**
   * Create new post
   */
  static async createPost(userId, postData, files) {
    const savedFiles = [];

    try {
      let images = [];
      if (files?.length) {
        images = FileService.processPostImages(files);
        savedFiles.push(...images);
      }

      const post = await Post.create({
        author: userId,
        content: postData.content,
        tags: postData.tags || [],
        visibility: postData.visibility || VISIBILITY.PUBLIC,
        images,
      });

      // Populate author
      await post.populate("author", "fullName personalPhoto role");

      return post;
    } catch (error) {
      FileService.cleanupFiles(savedFiles);
      throw error;
    }
  }

  /**
   * Delete post with transaction
   */
  static async deletePost(postId, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const post = await Post.findById(postId).session(session);

      if (!post) {
        await session.abortTransaction();
        throw new AppError(
          msg("المنشور غير موجود", "Post not found"),
          404,
        );
      }

      if (post.author.toString() !== userId) {
        await session.abortTransaction();
        throw new AppError(
          msg("ليس لديك صلاحية حذف هذا المنشور", "You do not have permission to delete this post"),
          403,
        );
      }

      // Delete post images
      post.images.forEach((image) => {
        FileService.deleteFile(image);
      });

      // Delete post
      await Post.findByIdAndDelete(postId, { session });

      // Delete associated comments
      await Comment.deleteMany({ post: postId }, { session });

      // Remove likes from users
      await User.updateMany(
        { likes: postId },
        { $pull: { likes: postId } },
        { session }
      );

      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Helper: Get user's following list
   */
  static async getUserFollowing(userId) {
    const user = await User.findById(userId).select("following").lean();
    return user?.following || [];
  }

  /**
   * Update post by ID (owner only)
   */
  static async updatePost(postId, userId, updateData, files = []) {
    const savedFiles = [];

    try {
      const post = await Post.findById(postId);

      if (!post) {
        throw new AppError(
          msg("المنشور غير موجود", "Post not found"),
          404,
        );
      }

      if (post.author.toString() !== userId) {
        throw new AppError(
          msg("ليس لديك صلاحية تعديل هذا المنشور", "You do not have permission to edit this post"),
          403,
        );
      }

      // Update fields
      if (updateData.content) post.content = updateData.content;
      if (updateData.tags) post.tags = updateData.tags;
      if (updateData.visibility) post.visibility = updateData.visibility;

      // Handle new images
      if (files?.length) {
        const newImages = FileService.processPostImages(files);
        post.images = [...(post.images || []), ...newImages].slice(0, 10);
        savedFiles.push(...newImages);
      }

      await post.save();
      await post.populate("author", "fullName personalPhoto role");

      return post;
    } catch (error) {
      FileService.cleanupFiles(savedFiles);
      throw error;
    }
  }

  /**
   * Toggle like/unlike post
   */
  static async toggleLike(postId, userId) {
    const post = await Post.findById(postId);

    if (!post) {
      throw new AppError(
        msg("المنشور غير موجود", "Post not found"),
        404,
      );
    }

    const likeIndex = post.likes.findIndex((id) => id.toString() === userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    return { liked: likeIndex === -1 };
  }

  /**
   * Get user's posts
   */
  static async getMyPosts(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const posts = await Post.aggregate([
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$post", "$$postId"] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "commentMetrics",
        },
      },
      {
        $addFields: {
          commentCount: {
            $arrayElemAt: ["$commentMetrics.count", 0],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorData",
        },
      },
      {
        $unwind: {
          path: "$authorData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          author: {
            _id: "$authorData._id",
            fullName: "$authorData.fullName",
            personalPhoto: "$authorData.personalPhoto",
            role: "$authorData.role",
          },
        },
      },
      {
        $project: {
          authorData: 0,
          commentMetrics: 0,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalPosts = await Post.countDocuments({
      author: userId,
      isDeleted: false,
    });

    return {
      data: posts,
      pagination: {
        current: page,
        limit,
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit),
      },
    };
  }

  /**
   * Search posts by tags
   */
  static async searchByTags(tag, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const posts = await Post.aggregate([
      {
        $match: {
          tags: tag,
          visibility: VISIBILITY.PUBLIC,
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$post", "$$postId"] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "commentMetrics",
        },
      },
      {
        $addFields: {
          commentCount: {
            $arrayElemAt: ["$commentMetrics.count", 0],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorData",
        },
      },
      {
        $unwind: {
          path: "$authorData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          author: {
            _id: "$authorData._id",
            fullName: "$authorData.fullName",
            personalPhoto: "$authorData.personalPhoto",
            role: "$authorData.role",
          },
        },
      },
      {
        $project: {
          authorData: 0,
          commentMetrics: 0,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalPosts = await Post.countDocuments({
      tags: tag,
      visibility: VISIBILITY.PUBLIC,
      isDeleted: false,
    });

    return {
      data: posts,
      pagination: {
        current: page,
        limit,
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit),
      },
    };
  }
}

export default PostService;
