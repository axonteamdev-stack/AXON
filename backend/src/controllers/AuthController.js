import User from "../models/UserModel.js";
import AppError, { catchAsync } from "../utils/AppError.js";
import { generateTokens } from "../utils/TokenService.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/Email.js";
import crypto from "crypto";
import fs from "fs";

const safeParse = (data) => {
  if (!data) return [];
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch (e) {
    return [];
  }
};

// 1. PATIENT SIGNUP - Add personal photo to response
export const signupPatient = catchAsync(async (req, res, next) => {
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
    radiologyDescription,
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already registered", 400));
  }

  const radiologyImagePath =
    req.files?.radiologyImage?.[0]?.path?.replace(/\\/g, "/") || null;
  const personalPhotoPath =
    req.files?.personalPhoto?.[0]?.path?.replace(/\\/g, "/") || null;

  const newUser = await User.create({
    fullName,
    email,
    password,
    phoneNumber,
    gender,
    role: "patient",
    isVerified: true,
    profileImage: personalPhotoPath, // Add this
    medicalProfile: {
      bloodType,
      height,
      weight,
      conditions: safeParse(conditions),
      allergies: safeParse(allergies),
      radiologyImage: radiologyImagePath,
      radiologyDescription,
    },
  });

  const { accessToken, refreshToken } = generateTokens(res, newUser._id);
  const isMobile = req.headers["platform"] === "mobile";

  res.status(201).json({
    status: "success",
    ...(isMobile && { token: accessToken, refreshToken }),
    data: newUser,
  });
});

// 2. DOCTOR SIGNUP - Add personal photo to response
export const signupDoctor = catchAsync(async (req, res, next) => {
  const {
    fullName,
    email,
    password,
    phoneNumber,
    gender,
    specialization,
    yearsExperience,
    medicalLicenseNumber,
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already registered", 400));
  }

  const licenseImagePath =
    req.files?.licenseImage?.[0]?.path?.replace(/\\/g, "/") || null;
  const personalPhotoPath =
    req.files?.personalPhoto?.[0]?.path?.replace(/\\/g, "/") || null;

  if (!licenseImagePath) {
    if (personalPhotoPath && fs.existsSync(personalPhotoPath)) {
      fs.unlinkSync(personalPhotoPath);
    }
    return next(new AppError("Medical license image is required", 400));
  }

  const newUser = await User.create({
    fullName,
    email,
    password,
    phoneNumber,
    gender,
    role: "doctor",
    isVerified: false,
    profileImage: personalPhotoPath, // Add this
    doctorProfile: {
      specialization,
      yearsExperience,
      medicalLicenseNumber,
      licenseImage: licenseImagePath,
    },
  });

  res.status(201).json({
    status: "success",
    message: "Registration request sent for admin review",
  });
});

// 3. LOGIN
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // Check if user exists & password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError("Incorrect email or password", 401));
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
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new AppError("No refresh token provided", 401));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const { accessToken } = generateTokens(res, user._id);

    res.status(200).json({
      status: "success",
      token: accessToken,
    });
  } catch (err) {
    return next(new AppError("Invalid or expired refresh token", 401));
  }
});

// 5. FORGOT PASSWORD
export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("No user found with that email", 404));
  }

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Code (Valid for 10 minutes)",
      message: `Your reset code is: ${resetToken}`,
    });

    res.status(200).json({
      status: "success",
      message: "Reset code sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("Failed to send email, try again later", 500));
  }
});

// 6. RESET PASSWORD
export const resetPassword = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return next(new AppError("Please provide token and new password", 400));
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or expired reset token", 400));
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
});
