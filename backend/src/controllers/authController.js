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

export const signupPatient = catchAsync(async (req, res) => {
  const user = await AuthService.registerPatient(req.body);
  const tokens = generateTokens(res, user._id);

  const responseLang = req.body.preferredLanguage || req.lang;

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
});

export const signupDoctor = catchAsync(async (req, res) => {
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

// ── FULL TOKEN ROTATION: Both access + refresh tokens renewed ──
export const refreshAccessToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;

  // Verify the old refresh token
  const decoded = verifyRefreshToken(token);

  // ── ROTATE BOTH TOKENS ──────────────────────────────────────
  // Clears old cookies, generates fresh accessToken + refreshToken
  const tokens = rotateTokens(res, decoded.id);

  // Return both new tokens (for mobile/Flutter that reads body)
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
