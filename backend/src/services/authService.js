import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import { msg } from "../utils/i18n.js";
import { sendPasswordResetEmail } from "./emailService.js";
import { saveFile, cleanupFiles, deleteFile } from "./fileService.js";

const RESET_TOKEN_EXPIRY_MS = 10 * 60 * 1000;

const validatePasswordStrength = (password) => {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain a number";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain a special character";
  return null;
};

const validateUniqueEmail = async (email) => {
  const existing = await User.findOne({ email: email.toLowerCase() }).lean();
  if (existing) {
    throw new AppError(msg("البريد الإلكتروني مسجل بالفعل", "Email already registered"), 400);
  }
};

export const registerPatient = async (data, files) => {
  await validateUniqueEmail(data.email);
  const savedFiles = [];
  try {
    const personalPhoto = files?.personalPhoto?.[0]
      ? await saveFile(files.personalPhoto[0], "personalPhoto", "patient")
      : null;
    if (personalPhoto) savedFiles.push(personalPhoto);

    const passwordError = validatePasswordStrength(data.password);
    if (passwordError) throw new AppError(msg(passwordError, passwordError), 400);

    return User.create({
      ...data,
      email: data.email.toLowerCase(),
      role: "patient",
      isVerified: true,
      personalPhoto,
      medicalProfile: {
        bloodType: data.bloodType,
        height: data.height,
        weight: data.weight,
        conditions: JSON.parse(data.conditions || "[]"),
        allergies: JSON.parse(data.allergies || "[]"),
      },
    });
  } catch (err) {
    await cleanupFiles(savedFiles);
    throw err;
  }
};

export const registerDoctor = async (data, files) => {
  await validateUniqueEmail(data.email);
  if (!files?.licenseImage?.[0]) {
    throw new AppError(msg("صورة ترخيص المزاولة مطلوبة", "License image required"), 400);
  }

  const savedFiles = [];
  try {
    const licenseImage = await saveFile(files.licenseImage[0], "certificates", "doctor");
    savedFiles.push(licenseImage);

    const personalPhoto = files?.personalPhoto?.[0]
      ? await saveFile(files.personalPhoto[0], "personalPhoto", "doctor")
      : null;
    if (personalPhoto) savedFiles.push(personalPhoto);

    const passwordError = validatePasswordStrength(data.password);
    if (passwordError) throw new AppError(msg(passwordError, passwordError), 400);

    return User.create({
      ...data,
      email: data.email.toLowerCase(),
      role: "doctor",
      isVerified: false,
      personalPhoto,
      doctorProfile: {
        specialization: data.specialization,
        yearsExperience: data.yearsExperience,
        medicalLicenseNumber: data.medicalLicenseNumber,
        about: data.about,
        price: data.price,
        licenseImage,
      },
    });
  } catch (err) {
    await cleanupFiles(savedFiles);
    throw err;
  }
};

export const authenticate = async (email, password) => {
  if (!email || !password) {
    throw new AppError(msg("يرجى إدخال البيانات", "Enter credentials"), 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError(msg("بيانات غير صحيحة", "Invalid credentials"), 401);
  }

  if (user.role === "doctor" && !user.isVerified) {
    throw new AppError(msg("حسابك قيد المراجعة", "Pending approval"), 403);
  }

  user.loginAttempts = 0;
  user.lockUntil = null;
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  return user;
};

export const refreshToken = async (token) => {
  if (!token) throw new AppError(msg("لا يوجد توكن", "No token"), 401);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_SECRET);
  } catch {
    throw new AppError(msg("انتهت الجلسة", "Session expired"), 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError(msg("المستخدم غير موجود", "User not found"), 404);

  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};

export const sendResetCode = async (email) => {
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) throw new AppError(msg("المستخدم غير موجود", "User not found"), 404);

  const resetToken = crypto.randomInt(100_000, 1_000_000).toString();
  user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.passwordResetExpires = Date.now() + RESET_TOKEN_EXPIRY_MS;
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail(user.email, resetToken);
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError(msg("فشل في إرسال البريد", "Email failed"), 500);
  }
};

export const resetPassword = async (token, password) => {
  const passwordError = validatePasswordStrength(password);
  if (passwordError) throw new AppError(msg(passwordError, passwordError), 400);

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new AppError(msg("كود غير صالح", "Invalid code"), 400);

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
};

export const updateProfile = async (userId, data, files) => {
  const body = data || {};
  if (body.password || body.role || body.email) {
    throw new AppError(msg("تعديل غير مسموح", "Update not allowed"), 400);
  }

  const updateData = {};
  ["fullName", "phoneNumber", "gender"].forEach((field) => {
    if (body[field]) updateData[field] = body[field];
  });

  const user = await User.findById(userId);

  if (user.role === "doctor") {
    ["specialization", "yearsExperience", "about", "price"].forEach((field) => {
      if (body[field] !== undefined) updateData[`doctorProfile.${field}`] = body[field];
    });
  }

  if (user.role === "patient") {
    ["bloodType", "height", "weight"].forEach((field) => {
      if (body[field] !== undefined) updateData[`medicalProfile.${field}`] = body[field];
    });
  }

  if (files?.personalPhoto?.[0]) {
    if (user.personalPhoto) await deleteFile(user.personalPhoto);
    const newPhoto = await saveFile(files.personalPhoto[0], "personalPhoto", user.role);
    updateData.personalPhoto = newPhoto;
  }

  if (!Object.keys(updateData).length) {
    throw new AppError(msg("لا توجد بيانات للتحديث", "No data to update"), 400);
  }

  return User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true });
};
