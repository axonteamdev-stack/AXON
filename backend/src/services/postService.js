import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

// ── Helpers ────────────────────────────────
const checkPostExists = async (postId) => {
  const post = await Post.findById(postId);
  if (!post) throw new AppError("Post not found", 404);
  return post;
};

const checkOwnership = (post, userId) => {
  if (post.author.toString() !== userId.toString()) {
    throw new AppError("You can only manage your own posts", 403);
  }
};

// ── Read operations ────────────────────────
export const getAll = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(
        "author",
        "fullName personalPhoto role doctorProfile.specialization",
      )
      .lean(),
    Post.countDocuments(),
  ]);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getByDoctor = async (doctorId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find({ author: doctorId, type: "article" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "fullName personalPhoto doctorProfile.specialization")
      .lean(),
    Post.countDocuments({ author: doctorId, type: "article" }),
  ]);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getById = async (postId, userId = null) => {
  const post = await Post.findById(postId)
    .populate(
      "author",
      "fullName personalPhoto role doctorProfile.specialization",
    )
    .lean();

  if (!post) throw new AppError("Post not found", 404);

  // Increment views
  await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } });
  post.views += 1;

  // Check if current user liked it
  if (userId) {
    const like = await Like.findOne({ user: userId, post: postId }).lean();
    post.isLiked = !!like;
  }

  // Get like count
  post.likesCount = await Like.countDocuments({ post: postId });

  // Get comments count (only for community posts)
  if (post.type === "community") {
    post.commentsCount = await Comment.countDocuments({ post: postId });
  } else {
    post.commentsCount = 0;
  }

  return post;
};

// ── Create ─────────────────────────────────
export const create = async (userId, data) => {
  const post = await Post.create({
    ...data,
    author: userId,
  });

  return post.populate(
    "author",
    "fullName personalPhoto role doctorProfile.specialization",
  );
};

// ── Update ─────────────────────────────────
export const update = async (postId, userId, data) => {
  const post = await checkPostExists(postId);
  checkOwnership(post, userId);

  const updated = await Post.findByIdAndUpdate(
    postId,
    { $set: data },
    { new: true, runValidators: true },
  ).populate(
    "author",
    "fullName personalPhoto role doctorProfile.specialization",
  );

  return updated;
};

// ── Delete ─────────────────────────────────
export const remove = async (postId, userId) => {
  const post = await checkPostExists(postId);
  checkOwnership(post, userId);

  // Soft delete
  await Post.findByIdAndUpdate(postId, { isDeleted: true });

  // Clean up likes and comments
  await Like.deleteMany({ post: postId });
  await Comment.updateMany({ post: postId }, { isDeleted: true });
};

// ── Like / Reaction ────────────────────────
export const toggleLike = async (postId, userId) => {
  await checkPostExists(postId);

  const existing = await Like.findOne({ user: userId, post: postId });

  if (existing) {
    await Like.deleteOne({ _id: existing._id });
    return { liked: false };
  }

  await Like.create({ user: userId, post: postId });
  return { liked: true };
};

// ── Comments ───────────────────────────────
export const addComment = async (postId, userId, content) => {
  const post = await checkPostExists(postId);

  // ❌ Articles cannot have comments — reactions only
  if (post.type === "article") {
    throw new AppError("Comments are not allowed on articles", 403);
  }

  const comment = await Comment.create({
    post: postId,
    author: userId,
    content,
  });

  return comment.populate("author", "fullName personalPhoto");
};

export const getComments = async (postId, page = 1, limit = 10) => {
  const post = await checkPostExists(postId);

  // Articles have no comments
  if (post.type === "article") {
    return { comments: [], pagination: { page, limit, total: 0, pages: 0 } };
  }

  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "fullName personalPhoto")
      .lean(),
    Comment.countDocuments({ post: postId }),
  ]);

  return {
    comments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};
