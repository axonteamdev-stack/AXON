import User from "../Models/UserModel.js";
import { catchAsync, sendResponse } from "../Utils/AppError.js";
import AppError from "../Utils/AppError.js";

// 1. جلب قائمة كل الأطباء
export const getAllDoctors = catchAsync(async (req, res, next) => {
  // 1. جلب الأطباء من القاعدة
  const doctors = await User.find({ role: "doctor", isVerified: true }).select(
    "fullName email phoneNumber personalPhoto gender role doctorProfile",
  );

  // 2. تجميع البيانات (Flattening)
  const flatDoctors = doctors.map((doc) => {
    return {
      _id: doc._id,
      fullName: doc.fullName,
      email: doc.email,
      phoneNumber: doc.phoneNumber,
      personalPhoto: doc.personalPhoto,
      gender: doc.gender,
      role: doc.role,
      // دمج بيانات البروفايل في نفس المستوى
      specialization: doc.doctorProfile?.specialization || "N/A",
      yearsExperience: doc.doctorProfile?.yearsExperience || 0,
      about: doc.doctorProfile?.about || "",
      price: doc.doctorProfile?.price || 0,
    };
  });

  // 3. الرد النهائي
  sendResponse(res, 200, "DOCTORS_FETCHED_SUCCESS", {
    results: flatDoctors.length,
    doctors: flatDoctors,
  });
});

// 2. جلب بيانات طبيب واحد بالتفصيل
export const getDoctorDetails = catchAsync(async (req, res, next) => {
  const doctor = await User.findOne({
    _id: req.params.id,
    role: "doctor",
  }).select("fullName email phoneNumber personalPhoto gender doctorProfile");

  if (!doctor) {
    return next(new AppError("DOCTOR_NOT_FOUND_GENERAL", 404));
  }

  const doctorData = {
    _id: doctor._id,
    fullName: doctor.fullName,
    email: doctor.email,
    phoneNumber: doctor.phoneNumber,
    personalPhoto: doctor.personalPhoto,
    gender: doctor.gender,
    specialization: doctor.doctorProfile?.specialization || "N/A",
    yearsExperience: doctor.doctorProfile?.yearsExperience || 0,
    about: doctor.doctorProfile?.about || "",
    price: doctor.doctorProfile?.price || 0,
  };

  sendResponse(res, 200, "DOCTOR_DETAILS_FETCHED", { doctor: doctorData });
});

// 3. البحث عن الأطباء
export const searchDoctors = catchAsync(async (req, res, next) => {
  const { keyword, specialization } = req.body;
  let query = { role: "doctor" };

  if (keyword) {
    query.fullName = { $regex: keyword, $options: "i" };
  }

  if (specialization) {
    query["doctorProfile.specialization"] = {
      $regex: specialization,
      $options: "i",
    };
  }

  const doctors = await User.find(query).select(
    "fullName personalPhoto doctorProfile.specialization doctorProfile.price",
  );

  sendResponse(res, 200, "SEARCH_RESULTS_READY", {
    results: doctors.length,
    doctors,
  });
});

// 4. المتابعة وإلغاء المتابعة
export const toggleFollow = catchAsync(async (req, res, next) => {
  const doctorId = req.params.id;
  const userId = req.user.id;

  if (doctorId === userId) {
    return next(new AppError("CANNOT_FOLLOW_YOURSELF", 400));
  }

  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== "doctor") {
    return next(new AppError("DOCTOR_NOT_FOUND_GENERAL", 404));
  }

  const isFollowing = doctor.followers.includes(userId);

  if (isFollowing) {
    await User.findByIdAndUpdate(userId, { $pull: { following: doctorId } });
    await User.findByIdAndUpdate(doctorId, { $pull: { followers: userId } });

    sendResponse(res, 200, "UNFOLLOWED_SUCCESS");
  } else {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { following: doctorId },
    });
    await User.findByIdAndUpdate(doctorId, {
      $addToSet: { followers: userId },
    });

    sendResponse(res, 200, "FOLLOWED_SUCCESS");
  }
});
