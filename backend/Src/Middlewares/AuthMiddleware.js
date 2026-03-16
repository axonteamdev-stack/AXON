import jwt from "jsonwebtoken";
import User from "../Models/UserModel.js";
import AppError, { catchAsync } from "../Utils/AppError.js";
import { unauthorizedError } from "../Error/index.js";
import { StatusCodes } from "http-status-codes";

export const protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) التحقق من وجود التوكن في الهيدرز (للموبايل Flutter)
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2) التحقق من وجود التوكن في الكوكيز (للمتصفح React)
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new unauthorizedError("أنت غير مسجل دخول، يرجى تسجيل الدخول للوصول"),
    );
  }

  // 3) التحقق من صحة التوكن
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4) التأكد من وجود المستخدم
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new unauthorizedError("المستخدم صاحب هذا التوكن لم يعد موجوداً"),
      );
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return next(new unauthorizedError("التوكن غير صالح أو انتهت صلاحيته"));
  }
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "ليس لديك صلاحية الوصول لهذه الميزة",
          StatusCodes.FORBIDDEN,
        ),
      );
    }
    next();
  };
};
