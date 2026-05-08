import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import { msg } from "../utils/i18n.js";

const ACCESS_MAX_AGE = 15 * 60 * 1000;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const cookieDefaults = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
};

export const generateTokens = (res, userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });

  const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRES_IN || "7d",
  });

  res.cookie("accessToken", accessToken, { ...cookieDefaults, maxAge: ACCESS_MAX_AGE });
  res.cookie("refreshToken", refreshToken, { ...cookieDefaults, maxAge: REFRESH_MAX_AGE });

  return { accessToken, refreshToken };
};

export const clearTokens = (res) => {
  res.clearCookie("accessToken", cookieDefaults);
  res.clearCookie("refreshToken", cookieDefaults);
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const message = err.name === "TokenExpiredError"
      ? msg("انتهت صلاحية التوكن", "Token has expired")
      : msg("التوكن غير صالح", "Invalid token");
    throw new AppError(message, 401);
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_SECRET);
  } catch {
    throw new AppError(msg("التوكن غير صالح", "Invalid token"), 401);
  }
};
