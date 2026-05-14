import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";

const RESET_TOKEN_EXPIRY = 10 * 60 * 1000; // 10 minutes

export const registerPatient = async (data) => {
  const existing = await User.findByEmail(data.email);
  if (existing) {
    throw new AppError(
      msg("البريد الإلكتروني مسجل بالفعل", "Email already registered"),
      400,
    );
  }

  return User.create({
    fullName: data.fullName,
    email: data.email.toLowerCase(),
    phoneNumber: data.phoneNumber,
    gender: data.gender,
    password: data.password,
    role: "patient",
    isVerified: true,
    preferredLanguage: data.preferredLanguage || "ar",
    personalPhoto: data.personalPhoto || null,
  });
};

export const registerDoctor = async (data) => {
  const existing = await User.findByEmail(data.email);
  if (existing) {
    throw new AppError(
      msg("البريد الإلكتروني مسجل بالفعل", "Email already registered"),
      400,
    );
  }

  return User.create({
    fullName: data.fullName,
    email: data.email.toLowerCase(),
    phoneNumber: data.phoneNumber,
    gender: data.gender,
    password: data.password,
    role: "doctor",
    isVerified: false,
    personalPhoto: data.personalPhoto || null,
    doctorProfile: {
      specialization: data.specialization,
      yearsExperience: data.yearsExperience
        ? Number(data.yearsExperience)
        : null,
      medicalLicenseNumber: data.medicalLicenseNumber,
      licenseImage: data.licenseImage || null,
      about: data.about || null,
      price: data.price ? Number(data.price) : null,
    },
  });
};

export const authenticate = async (email, password) => {
  if (!email || !password) {
    throw new AppError(msg("يرجى إدخال البيانات", "Enter credentials"), 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError(msg("بيانات غير صحيحة", "Invalid credentials"), 401);
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  return user;
};

export const refreshAccessToken = async (token) => {
  if (!token) {
    throw new AppError(msg("لا يوجد توكن", "No token"), 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_SECRET);
  } catch {
    throw new AppError(msg("انتهت الجلسة", "Session expired"), 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError(msg("المستخدم غير موجود", "User not found"), 404);
  }

  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};

export const sendResetCode = async (email) => {
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) {
    throw new AppError(msg("المستخدم غير موجود", "User not found"), 404);
  }

  const resetToken = crypto.randomInt(100_000, 1_000_000).toString();
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpires = Date.now() + RESET_TOKEN_EXPIRY;
  await user.save({ validateBeforeSave: false });

  console.log(`Reset code for ${user.email}: ${resetToken}`);

  return true;
};

export const resetPassword = async (token, password) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError(msg("كود غير صالح", "Invalid code"), 400);
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return true;
};
