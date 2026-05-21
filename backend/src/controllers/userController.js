import fs from "fs";
import path from "path";
import { catchAsync } from "../utils/catchAsync.js";
import { sendLocalizedResponse } from "../utils/response.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";
import { moveFromTemp, cleanupTemp } from "../middlewares/upload.js";
import * as UserService from "../services/userService.js";
import User from "../models/User.js";

export const getAllDoctors = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await UserService.getAllDoctors(Number(page), Number(limit));
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب الأطباء بنجاح", "Doctors fetched"),
    result,
    req.lang,
  );
});

export const getDoctorDetails = catchAsync(async (req, res) => {
  const doctor = await UserService.getDoctorDetails(req.params.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب بيانات الطبيب", "Doctor details fetched"),
    { doctor },
    req.lang,
  );
});

export const searchDoctors = catchAsync(async (req, res) => {
  const { keyword, specialization, page = 1, limit = 10 } = req.query;
  const result = await UserService.searchDoctors(
    keyword,
    specialization,
    Number(page),
    Number(limit),
  );
  sendLocalizedResponse(
    res,
    200,
    msg("نتائج البحث جاهزة", "Search results ready"),
    result,
    req.lang,
  );
});

export const getProfile = catchAsync(async (req, res) => {
  const user = await UserService.getFullUserProfile(req.user.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب الملف الشخصي", "Profile fetched"),
    { user },
    req.lang,
  );
});

export const updateProfile = catchAsync(async (req, res) => {
  const data = { ...req.body };
  const photoFile = req.files?.personalPhoto?.[0];

  try {
    if (photoFile) {
      const currentUser = await User.findById(req.user.id)
        .select("personalPhoto")
        .lean();
      if (currentUser?.personalPhoto) {
        const oldPath = path.join(
          process.cwd(),
          currentUser.personalPhoto.replace(/^\//, ""),
        );
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const { url } = moveFromTemp(photoFile.filename, "personalPhoto");
      data.personalPhoto = url;
    }

    const updatedUser = await UserService.updateProfile(req.user.id, data);
    sendLocalizedResponse(
      res,
      200,
      msg("تم تحديث الملف الشخصي", "Profile updated"),
      { user: updatedUser },
      req.lang,
    );
  } catch (err) {
    cleanupTemp(req.files);
    throw err;
  }
});

export const getPatientDetails = catchAsync(async (req, res) => {
  const patient = await UserService.getPatientDetails(req.params.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب بيانات المريض", "Patient details fetched"),
    { patient },
    req.lang,
  );
});
