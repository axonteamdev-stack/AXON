import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";
import { moveFromTemp, cleanupTemp } from "../middlewares/upload.js";
import * as UserService from "../services/userService.js";

export const getAllDoctors = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await UserService.getAllDoctors(Number(page), Number(limit));
    sendResponse(
        res,
        200,
        msg("تم جلب الأطباء بنجاح", "Doctors fetched"),
        result,
    );
});

export const getDoctorDetails = catchAsync(async (req, res) => {
    const doctor = await UserService.getDoctorDetails(req.params.id);
    sendResponse(
        res,
        200,
        msg("تم جلب بيانات الطبيب", "Doctor details fetched"),
        { doctor },
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
    sendResponse(
        res,
        200,
        msg("نتائج البحث جاهزة", "Search results ready"),
        result,
    );
});

export const getProfile = catchAsync(async (req, res) => {
    const user = await UserService.getUserProfile(req.user.id);
    sendResponse(res, 200, msg("تم جلب الملف الشخصي", "Profile fetched"), {
        user,
    });
});

export const updateProfile = catchAsync(async (req, res) => {
    const data = { ...req.body };
    const photoFile = req.files?.personalPhoto?.[0];

    try {
        if (photoFile) {
            const { url } = moveFromTemp(photoFile.filename, "personalPhoto");
            data.personalPhoto = url;
        }

        const updatedUser = await UserService.updateProfile(req.user.id, data);
        sendResponse(
            res,
            200,
            msg("تم تحديث الملف الشخصي", "Profile updated"),
            {
                user: updatedUser,
            },
        );
    } catch (err) {
        cleanupTemp(req.files);
        throw err;
    }
});

export const toggleFollow = catchAsync(async (req, res) => {
    const result = await UserService.toggleFollow(req.user.id, req.params.id);
    sendResponse(
        res,
        200,
        result.followed
            ? msg("تم المتابعة", "Followed")
            : msg("تم إلغاء المتابعة", "Unfollowed"),
        result,
    );
});

export const getFollowing = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await UserService.getFollowing(
        req.user.id,
        Number(page),
        Number(limit),
    );
    sendResponse(
        res,
        200,
        msg("تم جلب قائمة المتابعة", "Following list fetched"),
        result,
    );
});

export const getFollowers = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await UserService.getFollowers(
        req.user.id,
        Number(page),
        Number(limit),
    );
    sendResponse(
        res,
        200,
        msg("تم جلب قائمة المتابعين", "Followers list fetched"),
        result,
    );
});
