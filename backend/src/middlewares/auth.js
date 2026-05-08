import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { msg } from "../utils/i18n.js";

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) return authHeader.split(" ")[1];
  if (req.cookies?.accessToken) return req.cookies.accessToken;
  return null;
};

export const protect = catchAsync(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    throw new AppError(
      msg("أنت غير مسجل دخول، يرجى تسجيل الدخول للوصول", "You are not logged in, please log in to access"),
      401
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError(
      msg("التوكن غير صالح أو انتهت صلاحيته", "The token is invalid or expired"),
      401
    );
  }

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw new AppError(
      msg("المستخدم صاحب هذا التوكن لم يعد موجوداً", "The token owner no longer exists"),
      401
    );
  }

  if (currentUser.isLocked?.()) {
    throw new AppError(
      msg("الحساب مقفل مؤقتاً بسبب محاولات تسجيل دخول فاشلة", "Account temporarily locked due to failed login attempts"),
      403
    );
  }

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new AppError(
      msg("ليس لديك صلاحية الوصول لهذه الميزة", "You do not have permission to access this feature"),
      403
    );
  }
  next();
};
