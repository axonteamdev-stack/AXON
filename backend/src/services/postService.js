import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const buildPagination = (page, limit) => ({
    skip: (page - 1) * limit,
    limit: Math.min(limit, MAX_LIMIT),
});

export const getAll = async (page = 1, limit = DEFAULT_LIMIT) => {
    const { skip, limit: clampedLimit } = buildPagination(page, limit);

    const [posts, total] = await Promise.all([
        Post.find({ status: "published" })
            .populate("author", "fullName personalPhoto")
            .sort("-createdAt")
            .skip(skip)
            .limit(clampedLimit)
            .lean(),
        Post.countDocuments({ status: "published" }),
    ]);

    // Add like counts
    const postsWithCounts = await Promise.all(
        posts.map(async (post) => {
            const [likeCount, commentCount] = await Promise.all([
                Like.countDocuments({ post: post._id }),
                Comment.countDocuments({ post: post._id }),
            ]);
            return { ...post, likeCount, commentCount };
        }),
    );

    return {
        data: postsWithCounts,
        pagination: {
            current: page,
            limit: clampedLimit,
            total,
            pages: Math.ceil(total / clampedLimit),
        },
    };
};

export const getByDoctor = async (
    doctorId,
    page = 1,
    limit = DEFAULT_LIMIT,
) => {
    const { skip, limit: clampedLimit } = buildPagination(page, limit);

    const [posts, total] = await Promise.all([
        Post.find({ author: doctorId, status: "published" })
            .sort("-createdAt")
            .skip(skip)
            .limit(clampedLimit)
            .lean(),
        Post.countDocuments({ author: doctorId, status: "published" }),
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

export const getById = async (postId, userId = null) => {
    const post = await Post.findById(postId)
        .populate("author", "fullName personalPhoto role")
        .lean();

    if (!post) {
        throw new AppError(msg("المنشور غير موجود", "Post not found"), 404);
    }

    const [likeCount, commentCount, isLiked] = await Promise.all([
        Like.countDocuments({ post: postId }),
        Comment.countDocuments({ post: postId }),
        userId ? Like.exists({ post: postId, user: userId }) : false,
    ]);

    return { ...post, likeCount, commentCount, isLiked: !!isLiked };
};

export const create = async (userId, postData) => {
    const post = await Post.create({
        author: userId,
        ...postData,
    });

    await post.populate("author", "fullName personalPhoto role");
    return post;
};

export const update = async (postId, userId, updateData) => {
    const post = await Post.findOne({ _id: postId, author: userId });
    if (!post) {
        throw new AppError(
            msg(
                "المنشور غير موجود أو ليس لديك صلاحية",
                "Post not found or unauthorized",
            ),
            404,
        );
    }

    const allowedFields = [
        "title",
        "content",
        "image",
        "category",
        "tags",
        "status",
    ];
    allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) post[field] = updateData[field];
    });

    await post.save();
    return post;
};

export const remove = async (postId, userId) => {
    const post = await Post.findOne({ _id: postId, author: userId });
    if (!post) {
        throw new AppError(
            msg(
                "المنشور غير موجود أو ليس لديك صلاحية",
                "Post not found or unauthorized",
            ),
            404,
        );
    }

    post.isDeleted = true;
    await post.save();

    return true;
};

export const toggleLike = async (postId, userId) => {
    const existing = await Like.findOne({ post: postId, user: userId });

    if (existing) {
        await Like.deleteOne({ _id: existing._id });
        return { liked: false };
    }

    await Like.create({ post: postId, user: userId });
    return { liked: true };
};

export const addComment = async (postId, userId, content) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new AppError(msg("المنشور غير موجود", "Post not found"), 404);
    }

    const comment = await Comment.create({
        post: postId,
        author: userId,
        content,
    });

    await comment.populate("author", "fullName personalPhoto");
    return comment;
};

export const getComments = async (postId, page = 1, limit = DEFAULT_LIMIT) => {
    const { skip, limit: clampedLimit } = buildPagination(page, limit);

    const [comments, total] = await Promise.all([
        Comment.find({ post: postId })
            .populate("author", "fullName personalPhoto")
            .sort("-createdAt")
            .skip(skip)
            .limit(clampedLimit)
            .lean(),
        Comment.countDocuments({ post: postId }),
    ]);

    return {
        data: comments,
        pagination: {
            current: page,
            limit: clampedLimit,
            total,
            pages: Math.ceil(total / clampedLimit),
        },
    };
};
