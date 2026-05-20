import { catchAsync } from "../utils/catchAsync.js";
import { sendLocalizedResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import { moveFromTemp, cleanupTemp } from "../middlewares/upload.js";
import * as PostService from "../services/postService.js";
import fs from "fs";
import path from "path";

// Helper: rollback moved files
const rollbackMovedFiles = (data) => {
  const filesToDelete = [data.image].filter(Boolean);
  for (const filePath of filesToDelete) {
    try {
      const fullPath = path.join(process.cwd(), filePath.replace(/^\//, ""));
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    } catch {
      /* ignore */
    }
  }
};

export const getAllArticles = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
    const result = await PostService.getAll(
      Number(page),
      Number(limit),
      "article",
      "doctor",
    );

  sendLocalizedResponse(
    res,
    200,
    msg("جلب المقالات", "Articles fetched"),
    result,
    req.lang,
  );
});

export const getAllCommunityPosts = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await PostService.getAll(
    Number(page),
    Number(limit),
    "community",
    "patient",
  );
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب منشورات المرضى", "Community posts fetched"),
    result,
    req.lang,
  );
});

export const getByDoctor = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await PostService.getByDoctor(
    req.params.doctorId,
    Number(page),
    Number(limit),
  );
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب منشورات الطبيب", "Doctor posts fetched"),
    result,
    req.lang,
  );
});

export const getById = catchAsync(async (req, res) => {
  const post = await PostService.getById(req.params.id, req.user?.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب المنشور", "Post fetched"),
    { post },
    req.lang,
  );
});

export const createArticle = catchAsync(async (req, res) => {
  const data = { ...req.body, type: "article" };
  const imageFile = req.files?.articleImage?.[0];

  try {
    if (imageFile) {
      const { url } = moveFromTemp(imageFile.filename, "articleImage");
      data.image = url;
    }

    const post = await PostService.create(req.user.id, data);
    sendLocalizedResponse(
      res,
      201,
      msg("تم إنشاء المقال", "Article created"),
      { post },
      req.lang,
    );
  } catch (err) {
    rollbackMovedFiles(data);
    cleanupTemp(req.files);
    throw err;
  }
});

export const createCommunityPost = catchAsync(async (req, res) => {
  const data = { ...req.body, type: "community" };
  const imageFile = req.files?.postImage?.[0];

  try {
    if (imageFile) {
      const { url } = moveFromTemp(imageFile.filename, "postImage");
      data.image = url;
    }

    const post = await PostService.create(req.user.id, data);
    sendLocalizedResponse(
      res,
      201,
      msg("تم إنشاء المنشور", "Post created"),
      { post },
      req.lang,
    );
  } catch (err) {
    rollbackMovedFiles(data);
    cleanupTemp(req.files);
    throw err;
  }
});

export const update = catchAsync(async (req, res) => {
  const post = await PostService.update(req.params.id, req.user.id, req.body);
  sendLocalizedResponse(
    res,
    200,
    msg("تم تحديث المنشور", "Post updated"),
    { post },
    req.lang,
  );
});

export const remove = catchAsync(async (req, res) => {
  await PostService.remove(req.params.id, req.user.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم حذف المنشور", "Post deleted"),
    null,
    req.lang,
  );
});

export const toggleLike = catchAsync(async (req, res) => {
  const result = await PostService.toggleLike(req.params.id, req.user.id);
  sendLocalizedResponse(
    res,
    200,
    result.liked
      ? msg("تم الإعجاب", "Liked")
      : msg("تم إلغاء الإعجاب", "Unliked"),
    result,
    req.lang,
  );
});

export const addComment = catchAsync(async (req, res) => {
  const comment = await PostService.addComment(
    req.params.id,
    req.user.id,
    req.body.content,
  );
  sendLocalizedResponse(
    res,
    201,
    msg("تم إضافة التعليق", "Comment added"),
    { comment },
    req.lang,
  );
});

export const getComments = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await PostService.getComments(
    req.params.id,
    Number(page),
    Number(limit),
  );
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب التعليقات", "Comments fetched"),
    result,
    req.lang,
  );
});
