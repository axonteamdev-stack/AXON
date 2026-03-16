import User from "../Models/UserModel.js";
import { catchAsync } from "../Utils/AppError.js";
import AppError from "../Utils/AppError.js";
<<<<<<< HEAD
import { badRequestError, notFound } from "../Error/index.js";
=======
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
import { StatusCodes } from "http-status-codes";

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
  res.status(StatusCodes.CREATED).json({ status: "success", data: newUser });
});

// 2. تفعيل طبيب موجود (تغيير حالته لـ true)
export const activateDoctor = catchAsync(async (req, res, next) => {
  const doctor = await User.findOneAndUpdate(
    { _id: req.params.id, role: "doctor" },
    { isVerified: true },
    { new: true, runValidators: true },
  );

  if (!doctor) {
<<<<<<< HEAD
    return next(new notFound("لم يتم العثور على طبيب بهذا المعرف"));
=======
    return next(
      new AppError("لم يتم العثور على طبيب بهذا المعرف", StatusCodes.NOT_FOUND),
    );
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
  }

  res
    .status(StatusCodes.OK)
    .json({ status: "success", message: "تم تفعيل حساب الطبيب بنجاح" });
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

<<<<<<< HEAD
  if (!user) return next(new notFound("المستخدم غير موجود"));
=======
  if (!user)
    return next(new AppError("المستخدم غير موجود", StatusCodes.NOT_FOUND));
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb

  res.status(StatusCodes.OK).json({
    status: "success",
    message: "تم التحديث بنجاح",
    data: user,
  });
});

// 4. حذف مستخدم نهائياً
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

<<<<<<< HEAD
  if (!user) return next(new notFound("المستخدم غير موجود أو تم حذفه بالفعل"));
=======
  if (!user)
    return next(
      new AppError(
        "المستخدم غير موجود أو تم حذفه بالفعل",
        StatusCodes.NOT_FOUND,
      ),
    );
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb

  // غيرنا الحالة من 240 إلى 200 لكي نتمكن من إرسال JSON
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "تم حذف المستخدم وجميع بياناته بنجاح",
  });
});
