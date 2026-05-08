import rateLimit from "express-rate-limit";
import { msg } from "../I18n/index.js";

// ─── Rate Limit Constants ──────────────────────────────────────────
const RATE_LIMIT = Object.freeze({
  AUTH: {
    MAX_REQUESTS: 5,
    WINDOW_MINUTES: 15,
    MESSAGE_AR: "محاولات كثيرة، يرجى المحاولة لاحقاً",
    MESSAGE_EN: "Too many attempts, please try again later",
  },
  API: {
    MAX_REQUESTS: 100,
    WINDOW_HOURS: 1,
    MESSAGE_AR: "طلبات كثيرة، يرجى التحقق لاحقاً",
    MESSAGE_EN: "Too many requests, please try again later",
  },
  PASSWORD_RESET: {
    MAX_REQUESTS: 3,
    WINDOW_HOURS: 1,
    MESSAGE_AR: "محاولات إعادة تعيين كثيرة، يرجى المحاولة لاحقاً",
    MESSAGE_EN: "Too many password reset attempts, please try again later",
  },
});

const createLimiter = (max, windowMs, messageKey) => rateLimit({
  max,
  windowMs,
  message: msg(
    RATE_LIMIT[messageKey].MESSAGE_AR,
    RATE_LIMIT[messageKey].MESSAGE_EN
  ),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    status: "error",
    message: msg(
      RATE_LIMIT[messageKey].MESSAGE_AR,
      RATE_LIMIT[messageKey].MESSAGE_EN
    ),
  }),
});

// ─── Exported Limiters ─────────────────────────────────────────────
export const authLimiter = createLimiter(
  RATE_LIMIT.AUTH.MAX_REQUESTS,
  RATE_LIMIT.AUTH.WINDOW_MINUTES * 60 * 1000,
  "AUTH"
);

export const apiLimiter = createLimiter(
  RATE_LIMIT.API.MAX_REQUESTS,
  RATE_LIMIT.API.WINDOW_HOURS * 60 * 60 * 1000,
  "API"
);

export const passwordResetLimiter = createLimiter(
  RATE_LIMIT.PASSWORD_RESET.MAX_REQUESTS,
  RATE_LIMIT.PASSWORD_RESET.WINDOW_HOURS * 60 * 60 * 1000,
  "PASSWORD_RESET"
);