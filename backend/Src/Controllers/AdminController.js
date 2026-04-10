import User from "../Models/UserModel.js";
import { catchAsync, sendResponse } from "../Utils/AppError.js";
import mongoose from "mongoose";
import AppError from "../Utils/AppError.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  if (!obj) return newObj; // إذا كان الـ body فارغاً، ارجع كائن فارغ بدل الانهيار

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// 1. إضافة مستخدم جديد (بواسطة الأدمن)
export const addUser = catchAsync(async (req, res) => {
  const newUser = await User.create({
    ...req.body,
    isVerified: true, // أي مستخدم يضيفه الأدمن يكون مفعلاً تلقائياً
  });
  sendResponse(res, 201, "USER_ADDED_SUCCESS", newUser);
});

// 2. تفعيل طبيب موجود (تغيير حالته لـ true)
export const activateDoctor = catchAsync(async (req, res, next) => {
  const doctor = await User.findOneAndUpdate(
    { _id: req.params.id, role: "doctor" },
    { isVerified: true },
    { new: true, runValidators: true },
  );

  if (!doctor) {
    return next(new AppError("DOCTOR_NOT_FOUND", 404));
  }

  sendResponse(res, 200, "DOCTOR_ACTIVATED_SUCCESS");
});

// 3. تعديل بيانات مستخدم (واحد)
export const updateUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  // 1. كائن التحديث باستخدام Dot Notation
  const updateData = {};

  // 2. تحديث الحقول الأساسية
  if (req.body?.fullName) updateData.fullName = req.body.fullName;
  if (req.body?.phoneNumber) updateData.phoneNumber = req.body.phoneNumber;
  if (req.body?.gender) updateData.gender = req.body.gender;

  // 3. تحديث بيانات الطبيب (بدون مسح القديم)
  if (req.body?.specialization)
    updateData["doctorProfile.specialization"] = req.body.specialization;
  if (req.body?.yearsExperience)
    updateData["doctorProfile.yearsExperience"] = req.body.yearsExperience;
  if (req.body?.medicalLicenseNumber)
    updateData["doctorProfile.medicalLicenseNumber"] =
      req.body.medicalLicenseNumber;

  // 4. تحديث بيانات المريض
  if (req.body?.bloodType)
    updateData["medicalProfile.bloodType"] = req.body.bloodType;
  if (req.body?.weight) updateData["medicalProfile.weight"] = req.body.weight;

  // 5. معالجة الصور من req.files
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      if (file.fieldname === "personalPhoto")
        updateData.personalPhoto = file.path;
      if (file.fieldname === "licenseImage")
        updateData["doctorProfile.licenseImage"] = file.path;
      if (file.fieldname === "radiologyImage")
        updateData["medicalProfile.radiologyImage"] = file.path;
    });
  }

  // 6. التحديث باستخدام $set
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true },
  );

  if (!user) return next(new AppError("USER_NOT_FOUND", 404));

  sendResponse(res, 200, "USER_UPDATED_SUCCESS", user);
});

// 4. حذف مستخدم نهائياً
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return next(new AppError("USER_NOT_FOUND_OR_DELETED", 404));

  sendResponse(res, 200, "USER_DELETED_SUCCESS");
});
