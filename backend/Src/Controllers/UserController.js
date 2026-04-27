import { UserService } from "../Services/UserService.js";
import { catchAsync, sendResponse } from "../Utils/AppError.js";
import AppError from "../Utils/AppError.js";
import { msg } from "../Utils/ResponseHelper.js";

// Get all verified doctors with pagination
export const getAllDoctors = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const doctors = await UserService.getAllDoctors(
    parseInt(page),
    parseInt(limit),
  );

  sendResponse(
    res,
    200,
    msg("تم جلب الأطباء بنجاح", "Doctors fetched successfully"),
    {
      results: doctors.length,
      doctors,
    },
  );
});

// Get detailed doctor profile
export const getDoctorDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const doctor = await UserService.getDoctorDetails(id);

  if (!doctor) {
    return next(new AppError(msg("الطبيب غير موجود", "Doctor not found"), 404));
  }

  sendResponse(
    res,
    200,
    msg("تم جلب بيانات الطبيب بنجاح", "Doctor details fetched successfully"),
    { doctor },
  );
});

// Search doctors with keyword and specialization
export const searchDoctors = catchAsync(async (req, res, next) => {
  const { keyword, specialization, page = 1, limit = 10 } = req.body;

  const doctors = await UserService.searchDoctors({
    keyword,
    specialization,
    page: parseInt(page),
    limit: parseInt(limit),
  });

  sendResponse(res, 200, msg("نتائج البحث جاهزة", "Search results ready"), {
    results: doctors.length,
    doctors,
  });
});

// Follow/Unfollow a doctor
export const toggleFollow = catchAsync(async (req, res, next) => {
  const { id: doctorId } = req.params;
  const userId = req.user.id;

  // Validate self-follow attempt
  if (doctorId === userId) {
    return next(
      new AppError(
        msg("لا يمكنك متابعة نفسك", "You cannot follow yourself"),
        400,
      ),
    );
  }

  // Check if doctor exists
  const doctor = await UserService.getDoctorDetails(doctorId);
  if (!doctor) {
    return next(new AppError(msg("الطبيب غير موجود", "Doctor not found"), 404));
  }

  // Toggle follow
  const result = await UserService.toggleFollow(userId, doctorId);

  sendResponse(
    res,
    200,
    result.followed
      ? msg("تم الاتباع بنجاح", "Followed successfully")
      : msg("تم إلغاء الاتباع بنجاح", "Unfollowed successfully"),
    { followed: result.followed },
  );
});

// Get current user profile
export const getProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const user = await UserService.getUserProfile(userId);

  if (!user) {
    return next(new AppError(msg("المستخدم غير موجود", "User not found"), 404));
  }

  sendResponse(
    res,
    200,
    msg("تم جلب الملف الشخصي بنجاح", "Profile fetched successfully"),
    { user },
  );
});

// Update current user profile
export const updateProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const updateData = req.body;
  const files = req.files || {};

  try {
    const updatedUser = await UserService.updateProfile(
      userId,
      updateData,
      files,
    );

    sendResponse(
      res,
      200,
      msg("تم تحديث الملف الشخصي بنجاح", "Profile updated successfully"),
      { user: updatedUser },
    );
  } catch (error) {
    next(error);
  }
});

// Get user's following list
export const getFollowing = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  const following = await UserService.getFollowing(
    userId,
    parseInt(page),
    parseInt(limit),
  );

  sendResponse(
    res,
    200,
    msg("تم جلب قائمة المتابعة بنجاح", "Following list fetched successfully"),
    {
      results: following.length,
      users: following,
    },
  );
});

// Get user's followers list
export const getFollowers = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  const followers = await UserService.getFollowers(
    userId,
    parseInt(page),
    parseInt(limit),
  );

  sendResponse(
    res,
    200,
    msg("تم جلب قائمة المتابعين بنجاح", "Followers list fetched successfully"),
    {
      results: followers.length,
      users: followers,
    },
  );
});
