import User from "../models/UserModel.js";
import AppError, { catchAsync } from "../utils/AppError.js";
import { generateTokens } from "../utils/TokenService.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/Email.js";
import crypto from "crypto";
import fs from "fs";

/**
 * دالة مساعدة ذكية: 
 * إذا كانت البيانات نصاً عادياً (مثل الذي تكتبه في بوستمان) تحوله لمصفوفة.
 * إذا كانت JSON تحولها لمصفوفة.
 */
const safeParse = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    // في حالة كتابة نص عادي باللغة العربية في Postman
    return [data];
  }
};

// 1. PATIENT SIGNUP - Add personal photo to response
export const signupPatient = catchAsync(async (req, res, next) => {
  // استخراج البيانات من Body
  const {
    fullName,
    email,
    password,
    phoneNumber,
    gender,
    bloodType,
    height,
    weight,
    conditions,
    allergies,
    radiologyDescription, // التأكد من استلامه هنا
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("البريد الإلكتروني مسجل بالفعل", 400));
  }

  // معالجة مسارات الصور
  const radiologyImagePath = req.files?.radiologyImage?.[0]?.path?.replace(/\\/g, "/") || null;
  const personalPhotoPath = req.files?.personalPhoto?.[0]?.path?.replace(/\\/g, "/") || null;

  // إنشاء المستخدم مع التأكد من تمرير كل حقل لمكانه في الـ Schema
  const newUser = await User.create({
    fullName,
    email,
    password,
    phoneNumber,
    gender,
    role: "patient",
<<<<<<< HEAD
    isVerified: true,
    profileImage: personalPhotoPath, // Add this
=======
    isVerified: true, 
    personalPhoto: personalPhotoPath,
>>>>>>> c14f17e55e7cea92b340af07faa2542f98c003fc
    medicalProfile: {
      bloodType,
      height,
      weight,
      conditions: safeParse(conditions),
      allergies: safeParse(allergies),
      radiologyImage: radiologyImagePath,
      radiologyDescription: radiologyDescription // حفظ الوصف هنا
    },
  });

  // توليد التوكنات
  const { accessToken, refreshToken } = generateTokens(res, newUser._id);
  const isMobile = req.headers["platform"] === "mobile";

  res.status(201).json({
    status: "success",
    ...(isMobile && { token: accessToken, refreshToken }),
    data: newUser, // سيظهر الحقل هنا الآن لأن الموديل يستخدم transform
  });
});

// 2. DOCTOR SIGNUP - Add personal photo to response
export const signupDoctor = catchAsync(async (req, res, next) => {
  const {
    fullName, email, password, phoneNumber, gender,
    specialization, yearsExperience, medicalLicenseNumber, about, price,
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError("البريد الإلكتروني مسجل بالفعل", 400));

  const licenseImagePath = req.files?.licenseImage?.[0]?.path?.replace(/\\/g, "/") || null;
  const personalPhotoPath = req.files?.personalPhoto?.[0]?.path?.replace(/\\/g, "/") || null;

  if (!licenseImagePath) {
    return next(new AppError("صورة ترخيص المزاولة مطلوبة للطبيب", 400));
  }

  const newUser = await User.create({
    fullName, email, password, phoneNumber, gender,
    role: "doctor",
    isVerified: false,
<<<<<<< HEAD
    profileImage: personalPhotoPath, // Add this
=======
    personalPhoto: personalPhotoPath,
>>>>>>> c14f17e55e7cea92b340af07faa2542f98c003fc
    doctorProfile: {
      specialization,
      yearsExperience,
      medicalLicenseNumber,
      licenseImage: licenseImagePath,
      about,
      price,
    },
  });

  res.status(201).json({
    status: "success",
    message: "تم إرسال طلب التسجيل لمراجعة الإدارة",
    data: { id: newUser._id, email: newUser.email, role: newUser.role }
  });
});

// 3. LOGIN
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError("يرجى إدخال البريد وكلمة المرور", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError("بيانات الدخول غير صحيحة", 401));
  }

  if (user.role === "doctor" && !user.isVerified) {
    return next(new AppError("حسابك في انتظار موافقة الإدارة", 403));
  }

  const { accessToken, refreshToken } = generateTokens(res, user._id);
  const isMobile = req.headers["platform"] === "mobile";

  res.status(200).json({
    status: "success",
    ...(isMobile && { token: accessToken, refreshToken }),
    data: user,
  });
});

// 4. REFRESH TOKEN
export const refreshAccessToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken) return next(new AppError("لا يوجد Refresh Token", 401));

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError("المستخدم غير موجود", 404));

    const { accessToken } = generateTokens(res, user._id);
    res.status(200).json({ status: "success", token: accessToken });
  } catch (err) {
    return next(new AppError("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً", 401));
  }
});

// 5. FORGOT PASSWORD
export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("لا يوجد مستخدم بهذا البريد", 404));

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; 
  
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "رمز إعادة تعيين كلمة المرور",
      message: `كود التحقق الخاص بك هو: ${resetToken}`,
    });
    res.status(200).json({ status: "success", message: "تم إرسال الكود للبريد الإلكتروني" });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("فشل في إرسال البريد الإلكتروني", 500));
  }
});

// 6. RESET PASSWORD
export const resetPassword = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("الكود غير صحيح أو انتهت صلاحيته", 400));

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({ status: "success", message: "تم تغيير كلمة المرور بنجاح" });
});
