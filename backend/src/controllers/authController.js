import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import { generateTokens, clearTokens } from "../services/tokenService.js";
import * as AuthService from "../services/authService.js";

const isMobile = (req) => req.headers["platform"] === "mobile";

export const signupPatient = catchAsync(async (req, res) => {
  const user = await AuthService.registerPatient(req.body, req.files);
  const tokens = generateTokens(res, user._id);
  res.status(201).json({
    status: "success",
    ...(isMobile(req) && tokens),
    data: user,
  });
});

export const signupDoctor = catchAsync(async (req, res) => {
  const user = await AuthService.registerDoctor(req.body, req.files);
  sendResponse(res, 201, msg("تم التسجيل بنجاح", "Registration successful"), {
    id: user._id,
    email: user.email,
    role: user.role,
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await AuthService.authenticate(email, password);
  const tokens = generateTokens(res, user._id);
  res.status(200).json({
    status: "success",
    ...(isMobile(req) && tokens),
    data: user,
  });
});

export const logout = (req, res) => {
  clearTokens(res);
  sendResponse(res, 200, msg("تم الخروج بنجاح", "Logged out"));
};

export const refreshAccessToken = catchAsync(async (req, res) => {
  const accessToken = await AuthService.refreshToken(
    req.cookies.refreshToken || req.body.refreshToken
  );
  res.status(200).json({ status: "success", token: accessToken });
});

export const forgotPassword = catchAsync(async (req, res) => {
  await AuthService.sendResetCode(req.body.email);
  sendResponse(res, 200, msg("تم إرسال الكود", "Code sent"));
});

export const resetPassword = catchAsync(async (req, res) => {
  await AuthService.resetPassword(req.body.token, req.body.password);
  sendResponse(res, 200, msg("تم التغيير بنجاح", "Password reset successful"));
});

export const updateMe = catchAsync(async (req, res) => {
  const updatedUser = await AuthService.updateProfile(req.user.id, req.body, req.files);
  sendResponse(res, 200, msg("تم التحديث بنجاح", "Updated successfully"), updatedUser);
});
