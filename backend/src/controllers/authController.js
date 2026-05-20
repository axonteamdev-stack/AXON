import fs from "fs";
import path from "path";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendLocalizedResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import { transformUserResponse } from "../utils/transformers.js";
import {
  generateTokens,
  rotateTokens,
  clearTokens,
  verifyRefreshToken,
} from "../services/tokenService.js";
import { moveFromTemp, cleanupTemp } from "../middlewares/upload.js";
import * as AuthService from "../services/authService.js";
import User from "../models/User.js";

// Helper: delete files that were already moved from .temp to final folder
const rollbackMovedFiles = (data) => {
  const filesToDelete = [
    data.personalPhoto,
    data.licenseImage,
    ...(data.radiologyTests?.map((t) => t.image) || []),
    ...(data.labTests?.map((t) => t.image) || []),
  ].filter(Boolean);

  for (const filePath of filesToDelete) {
    try {
      const fullPath = path.join(process.cwd(), filePath.replace(/^\//, ""));
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch {
      // Ignore cleanup errors — best effort
    }
  }
};

export const signupPatient = catchAsync(async (req, res) => {
  // ← FIXED: Validate email uniqueness BEFORE moving files
  const existing = await User.findByEmail(req.body.email);
  if (existing) {
    cleanupTemp(req.files);
    throw new AppError(
      msg("البريد الإلكتروني مسجل بالفعل", "Email already registered"),
      400,
    );
  }

  const data = { ...req.body };

  try {
    const photoFile = req.files?.personalPhoto?.[0];
    if (photoFile) {
      const { url } = moveFromTemp(photoFile.filename, "personalPhoto");
      data.personalPhoto = url;
    }

    if (req.files?.radiologyImage?.length) {
      data.radiologyTests = req.files.radiologyImage.map((file) => ({
        image: moveFromTemp(file.filename, "radiologyImage").url,
        description: "",
        date: new Date(),
      }));
    }

    if (req.files?.labImage?.length) {
      data.labTests = req.files.labImage.map((file) => ({
        image: moveFromTemp(file.filename, "labImage").url,
        description: "",
        date: new Date(),
      }));
    }

    const { user, patient } = await AuthService.registerPatient(data);
    const tokens = generateTokens(res, user._id);
    const responseLang = req.body.preferredLanguage || req.lang;

    sendLocalizedResponse(
      res,
      201,
      msg("تم التسجيل بنجاح", "Registration successful"),
      {
        user: transformUserResponse(user, patient),
        hasCompletedOnboarding: !!patient,
        tokens,
      },
      responseLang,
    );
  } catch (err) {
    rollbackMovedFiles(data); // ← FIXED: Clean up moved files on any error
    cleanupTemp(req.files);
    throw err;
  }
});

export const signupDoctor = catchAsync(async (req, res) => {
  // ← FIXED: Same pattern
  const existing = await User.findByEmail(req.body.email);
  if (existing) {
    cleanupTemp(req.files);
    throw new AppError(
      msg("البريد الإلكتروني مسجل بالفعل", "Email already registered"),
      400,
    );
  }

  const data = { ...req.body };

  const licenseFile = req.files?.licenseImage?.[0];
  const photoFile = req.files?.personalPhoto?.[0];

  try {
    if (licenseFile) {
      const { url } = moveFromTemp(licenseFile.filename, "licenseImage");
      data.licenseImage = url;
    }
    if (photoFile) {
      const { url } = moveFromTemp(photoFile.filename, "personalPhoto");
      data.personalPhoto = url;
    }

    const user = await AuthService.registerDoctor(data);
    const responseLang = req.body.preferredLanguage || req.lang;
    const tokens = generateTokens(res, user._id);

    sendLocalizedResponse(
      res,
      201,
      msg("تم التسجيل بنجاح", "Registration successful"),
      {
        user: transformUserResponse(user),
        tokens,
      },
      responseLang,
    );
  } catch (err) {
    rollbackMovedFiles(data);
    cleanupTemp(req.files);
    throw err;
  }
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await AuthService.authenticate(email, password);
  const tokens = generateTokens(res, user._id);

  const responseLang = user.preferredLanguage || req.lang;

  sendLocalizedResponse(
    res,
    200,
    msg("تم تسجيل الدخول بنجاح", "Login successful"),
    {
      user: transformUserResponse(user),
      tokens,
    },
    responseLang,
  );
});

export const logout = (req, res) => {
  clearTokens(res);
  sendLocalizedResponse(
    res,
    200,
    msg("تم الخروج بنجاح", "Logged out"),
    null,
    req.lang,
  );
};

export const refreshAccessToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  const decoded = verifyRefreshToken(token);
  const tokens = rotateTokens(res, decoded.id);

  sendLocalizedResponse(
    res,
    200,
    msg("تم تجديد التوكن", "Token refreshed"),
    {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
    req.lang,
  );
});

export const forgotPassword = catchAsync(async (req, res) => {
  await AuthService.sendResetCode(req.body.email);
  sendLocalizedResponse(
    res,
    200,
    msg("تم إرسال الكود", "Code sent"),
    null,
    req.lang,
  );
});

export const resetPassword = catchAsync(async (req, res) => {
  await AuthService.resetPassword(req.body.token, req.body.password);
  sendLocalizedResponse(
    res,
    200,
    msg("تم التغيير بنجاح", "Password reset successful"),
    null,
    req.lang,
  );
});
