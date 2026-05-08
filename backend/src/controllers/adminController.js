import User from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import AppError from "../utils/appError.js";
import { msg } from "../utils/i18n.js";

const ALLOWED_USER_FIELDS = ["fullName", "phoneNumber", "gender"];
const DOCTOR_FIELDS = ["specialization", "yearsExperience", "medicalLicenseNumber"];
const PATIENT_FIELDS = ["bloodType", "weight"];
const FILE_FIELD_MAP = {
  personalPhoto: "personalPhoto",
  licenseImage: "licenseImage",
  radiologyImage: "radiologyTests.$[].image",
  labImage: "labTests.$[].image",
};

const buildUpdateData = (body, files) => {
  const data = {};
  for (const field of ALLOWED_USER_FIELDS) {
    if (body?.[field]) data[field] = body[field];
  }
  for (const field of DOCTOR_FIELDS) {
    if (body?.[field]) data[`doctorProfile.${field}`] = body[field];
  }
  for (const field of PATIENT_FIELDS) {
    if (body?.[field]) data[`medicalProfile.${field}`] = body[field];
  }
  if (files?.length) {
    for (const file of files) {
      const mapped = FILE_FIELD_MAP[file.fieldname];
      if (mapped) data[mapped] = file.path;
    }
  }
  return data;
};

export const addUser = catchAsync(async (req, res) => {
  const newUser = await User.create({ ...req.body, isVerified: true });
  sendResponse(res, 201, msg("تم إضافة المستخدم بنجاح", "User added successfully"), newUser);
});

export const activateDoctor = catchAsync(async (req, res, next) => {
  const doctor = await User.findOneAndUpdate(
    { _id: req.params.id, role: "doctor" },
    { isVerified: true },
    { new: true, runValidators: true }
  );

  if (!doctor) {
    return next(new AppError(msg("الطبيب غير موجود", "Doctor not found"), 404));
  }

  sendResponse(res, 200, msg("تم تفعيل حساب الطبيب بنجاح", "Doctor account activated successfully"));
});

export const updateUser = catchAsync(async (req, res, next) => {
  const updateData = buildUpdateData(req.body, req.files);
  if (!Object.keys(updateData).length) {
    return next(new AppError(msg("لا توجد بيانات للتحديث", "No data provided for update"), 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!user) {
    return next(new AppError(msg("المستخدم غير موجود", "User not found"), 404));
  }

  sendResponse(res, 200, msg("تم تحديث بيانات المستخدم بنجاح", "User updated successfully"), user);
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError(msg("المستخدم غير موجود أو تم حذفه", "User not found or already deleted"), 404));
  }
  sendResponse(res, 200, msg("تم حذف المستخدم بنجاح", "User deleted successfully"));
});
