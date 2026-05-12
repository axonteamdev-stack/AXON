import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import { moveFromTemp, cleanupTemp } from "../middlewares/upload.js";
import * as PostService from "../services/postService.js";

export const getAll = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await PostService.getAll(Number(page), Number(limit));
    sendResponse(res, 200, msg("تم جلب المنشورات", "Posts fetched"), result);
});

export const getByDoctor = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await PostService.getByDoctor(
        req.params.doctorId,
        Number(page),
        Number(limit),
    );
    sendResponse(
        res,
        200,
        msg("تم جلب منشورات الطبيب", "Doctor posts fetched"),
        result,
    );
});

export const getById = catchAsync(async (req, res) => {
    const post = await PostService.getById(req.params.id, req.user?.id);
    sendResponse(res, 200, msg("تم جلب المنشور", "Post fetched"), { post });
});

export const create = catchAsync(async (req, res) => {
    const data = { ...req.body };
    const imageFile = req.files?.postImage?.[0];

    try {
        if (imageFile) {
            const { url } = moveFromTemp(imageFile.filename, "postImage");
            data.image = url;
        }

        const post = await PostService.create(req.user.id, data);
        sendResponse(res, 201, msg("تم إنشاء المنشور", "Post created"), {
            post,
        });
    } catch (err) {
        cleanupTemp(req.files);
        throw err;
    }
});

export const update = catchAsync(async (req, res) => {
    const post = await PostService.update(req.params.id, req.user.id, req.body);
    sendResponse(res, 200, msg("تم تحديث المنشور", "Post updated"), { post });
});

export const remove = catchAsync(async (req, res) => {
    await PostService.remove(req.params.id, req.user.id);
    sendResponse(res, 200, msg("تم حذف المنشور", "Post deleted"));
});

export const toggleLike = catchAsync(async (req, res) => {
    const result = await PostService.toggleLike(req.params.id, req.user.id);
    sendResponse(
        res,
        200,
        result.liked
            ? msg("تم الإعجاب", "Liked")
            : msg("تم إلغاء الإعجاب", "Unliked"),
        result,
    );
});

export const addComment = catchAsync(async (req, res) => {
    const comment = await PostService.addComment(
        req.params.id,
        req.user.id,
        req.body.content,
    );
    sendResponse(res, 201, msg("تم إضافة التعليق", "Comment added"), {
        comment,
    });
});

export const getComments = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await PostService.getComments(
        req.params.id,
        Number(page),
        Number(limit),
    );
    sendResponse(res, 200, msg("تم جلب التعليقات", "Comments fetched"), result);
});
