import Article from "../models/articleModel.js";
import { processArticleImage, deleteFile } from "./fileService.js";
import AppError from "../utils/appError.js";
import { msg } from "../utils/i18n.js";
import mongoose from "mongoose";

export const create = async (doctorId, data, files) => {
  const image = files?.postImage?.[0]
    ? await processArticleImage(files.postImage[0])
    : null;
  return Article.create({ doctor: doctorId, ...data, image });
};

export const getAll = () =>
  Article.findActive()
    .populate("doctor", "fullName personalPhoto")
    .sort("-createdAt");

export const getFollowing = async (userId) => {
  const user = await (await import("../models/userModel.js")).default.findById(userId)
    .select("following")
    .lean();
  if (!user?.following?.length) return [];
  return Article.findActive({ doctor: { $in: user.following } })
    .populate("doctor", "fullName personalPhoto")
    .sort("-createdAt");
};

export const getByDoctor = (doctorId) =>
  Article.findActive({ doctor: doctorId }).sort("-createdAt");

export const getById = (id) =>
  Article.findById(id).select("doctor title content image likes");

export const toggleLike = async (articleId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    throw new AppError(msg("معرف المقال غير صالح", "Invalid article ID"), 400);
  }

  const addResult = await Article.updateOne(
    { _id: articleId },
    { $addToSet: { likes: userId } }
  );

  if (addResult.modifiedCount === 0) {
    await Article.updateOne({ _id: articleId }, { $pull: { likes: userId } });
    return { liked: false };
  }

  return { liked: true };
};

export const remove = async (id) => {
  const article = await Article.findById(id);
  if (article.image) await deleteFile(article.image);
  await Article.findByIdAndDelete(id);
};
