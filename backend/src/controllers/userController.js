import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import AppError from "../utils/appError.js";
import { msg } from "../utils/i18n.js";
import {
  clampPage,
  clampLimit,
  buildPaginationMeta,
} from "../utils/pagination.js";
import * as UserService from "../services/userService.js";

export const getAllDoctors = catchAsync(async (req, res) => {
  const page = clampPage(req.query.page);
  const limit = clampLimit(req.query.limit);
  const { doctors, total } = await UserService.getAllDoctors(page, limit);
  sendResponse(res, 200, msg("تم جلب الأطباء بنجاح", "Doctors fetched"), {
    doctors,
    pagination: buildPaginationMeta(page, limit, total),
  });
});

export const getDoctorDetails = catchAsync(async (req, res) => {
  const doctor = await UserService.getDoctorDetails(req.params.id);
  if (!doctor)
    throw new AppError(msg("الطبيب غير موجود", "Doctor not found"), 404);
  sendResponse(res, 200, msg("تم جلب بيانات الطبيب", "Doctor details fetched"), { doctor });
});

export const searchDoctors = catchAsync(async (req, res) => {
  const page = clampPage(req.query.page);
  const limit = clampLimit(req.query.limit);
  const { doctors, total } = await UserService.searchDoctors(
    req.query.keyword,
    req.query.specialization,
    page,
    limit,
  );
  sendResponse(res, 200, msg("نتائج البحث جاهزة", "Search results ready"), {
    doctors,
    pagination: buildPaginationMeta(page, limit, total),
  });
});

export const toggleFollow = catchAsync(async (req, res) => {
  const result = await UserService.toggleFollow(req.user.id, req.params.id);
  sendResponse(
    res,
    200,
    msg(result.followed ? "تم المتابعة" : "تم إلغاء المتابعة", result.followed ? "Followed" : "Unfollowed"),
    { followed: result.followed },
  );
});

export const getProfile = catchAsync(async (req, res) => {
  const user = await UserService.getUserProfile(req.user.id);
  if (!user)
    throw new AppError(msg("المستخدم غير موجود", "User not found"), 404);
  sendResponse(res, 200, msg("تم جلب الملف الشخصي", "Profile fetched"), { user });
});

export const updateProfile = catchAsync(async (req, res) => {
  const updatedUser = await UserService.updateProfile(req.user.id, req.body, req.files);
  sendResponse(res, 200, msg("تم تحديث الملف الشخصي", "Profile updated"), { user: updatedUser });
});

export const getFollowing = catchAsync(async (req, res) => {
  const page = clampPage(req.query.page);
  const limit = clampLimit(req.query.limit);
  const { following, total } = await UserService.getFollowing(req.user.id, page, limit);
  sendResponse(res, 200, msg("تم جلب قائمة المتابعة", "Following list fetched"), {
    users: following,
    pagination: buildPaginationMeta(page, limit, total),
  });
});

export const getFollowers = catchAsync(async (req, res) => {
  const page = clampPage(req.query.page);
  const limit = clampLimit(req.query.limit);
  const { followers, total } = await UserService.getFollowers(req.user.id, page, limit);
  sendResponse(res, 200, msg("تم جلب قائمة المتابعين", "Followers list fetched"), {
    users: followers,
    pagination: buildPaginationMeta(page, limit, total),
  });
});
