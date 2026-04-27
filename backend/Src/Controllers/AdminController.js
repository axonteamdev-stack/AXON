import User from "../Models/UserModel.js";
import { catchAsync, sendResponse } from "../Utils/AppError.js";
import AppError from "../Utils/AppError.js";
import { msg } from "../Utils/ResponseHelper.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  if (!obj) return newObj; // إذا كان الـ body فارغاً، ارجع كائن فارغ بدل الانهيار

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// 1. Add new user (by admin)
export const addUser = catchAsync(async (req, res) => {
  const newUser = await User.create({
    ...req.body,
    isVerified: true, // Any user added by admin is automatically verified
  });
  sendResponse(
    res,
    201,
    msg("تم إضافة المستخدم بنجاح", "User added successfully"),
    newUser,
  );
});

// 2. Activate doctor - change status to true
export const activateDoctor = catchAsync(async (req, res, next) => {
  const doctor = await User.findOneAndUpdate(
    { _id: req.params.id, role: "doctor" },
    { isVerified: true },
    { new: true, runValidators: true },
  );

  if (!doctor) {
    return next(new AppError(msg("الطبيب غير موجود", "Doctor not found"), 404));
  }

  sendResponse(
    res,
    200,
    msg("تم تفعيل حساب الطبيب بنجاح", "Doctor account activated successfully"),
  );
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

  // Update using $set
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true },
  );

  if (!user) {
    return next(new AppError(msg("المستخدم غير موجود", "User not found"), 404));
  }

  sendResponse(
    res,
    200,
    msg("تم تحديث بيانات المستخدم بنجاح", "User updated successfully"),
    user,
  );
});

// 4. Delete user permanently
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(
      new AppError(
        msg(
          "المستخدم غير موجود أو تم حذفه",
          "User not found or already deleted",
        ),
        404,
      ),
    );
  }

  sendResponse(
    res,
    200,
    msg("تم حذف المستخدم بنجاح", "User deleted successfully"),
  );
});
