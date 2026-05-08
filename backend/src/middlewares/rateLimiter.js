import rateLimit from "express-rate-limit";
import { msg } from "../utils/i18n.js";

const createLimiter = (max, windowMinutes, messageAr, messageEn) => rateLimit({
  max: Number(max),
  windowMs: Number(windowMinutes) * 60 * 1000,
  message: msg(messageAr, messageEn),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    status: "error",
    message: msg(messageAr, messageEn),
  }),
});

export const authLimiter = createLimiter(
  process.env.AUTH_RATE_LIMIT_MAX || 5,
  process.env.AUTH_RATE_LIMIT_WINDOW || 15,
  "محاولات كثيرة، يرجى المحاولة لاحقاً",
  "Too many attempts, please try again later"
);

export const apiLimiter = createLimiter(
  process.env.API_RATE_LIMIT_MAX || 100,
  process.env.API_RATE_LIMIT_WINDOW || 60,
  "طلبات كثيرة، يرجى التحقق لاحقاً",
  "Too many requests, please try again later"
);

export const passwordResetLimiter = createLimiter(
  process.env.PASSWORD_RESET_RATE_LIMIT_MAX || 3,
  process.env.PASSWORD_RESET_RATE_LIMIT_WINDOW || 60,
  "محاولات إعادة تعيين كثيرة، يرجى المحاولة لاحقاً",
  "Too many password reset attempts, please try again later"
);
