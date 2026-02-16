import User from "../models/UserModel.js";
import AppError, { catchAsync } from "../utils/AppError.js";
import { generateTokens } from "../utils/TokenService.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/Email.js";
import crypto from "crypto";

const safeParse = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    return [data];
  }
};

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
    profileImage: personalPhotoPath,
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
    about,
    price,
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already registered", 400));
  }

  const licenseImagePath =
    req.files?.licenseImage?.[0]?.path?.replace(/\\/g, "/") || null;
  const personalPhotoPath =
    req.files?.personalPhoto?.[0]?.path?.replace(/\\/g, "/") || null;

  if (!licenseImagePath) {
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
    profileImage: personalPhotoPath,
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
    message: "Registration request sent for admin review",
    data: { id: newUser._id, email: newUser.email, role: newUser.role },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  if (user.role === "doctor" && !user.isVerified) {
    return next(
      new AppError("Your account is pending admin verification", 403),
    );
  }

  const { accessToken, refreshToken } = generateTokens(res, user._id);
  const isMobile = req.headers["platform"] === "mobile";

  res.status(200).json({
    status: "success",
    ...(isMobile && { token: accessToken, refreshToken }),
    data: user,
  });
});

export const refreshAccessToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
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
    res.status(200).json({ status: "success", token: accessToken });
  } catch (err) {
    return next(new AppError("Invalid or expired refresh token", 401));
  }
});

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
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

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

export const resetPassword = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return next(new AppError("Please provide token and password", 400));
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
