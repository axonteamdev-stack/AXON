import jwt from "jsonwebtoken";
import User from "../Models/UserModel.js";
import { catchAsync } from "../Utils/AppError.js";
import { msg, sendResponse } from "../Utils/ResponseHelper.js";

export const protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) Check token in headers (Flutter mobile)
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2) Check token in cookies (React web)
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return sendResponse(
      res,
      401,
      msg(
        "أنت غير مسجل دخول، يرجى تسجيل الدخول للوصول",
        "You are not logged in, please log in to access",
      ),
    );
  }

  // 3) Verify token validity
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4) Ensure user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return sendResponse(
        res,
        401,
        msg(
          "المستخدم صاحب هذا التوكن لم يعد موجوداً",
          "The token owner no longer exists",
        ),
      );
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return sendResponse(
      res,
      401,
      msg(
        "التوكن غير صالح أو انتهت صلاحيته",
        "The token is invalid or expired",
      ),
    );
  }
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendResponse(
        res,
        403,
        msg(
          "ليس لديك صلاحية الوصول لهذه الميزة",
          "You do not have permission to access this feature",
        ),
      );
    }
    next();
  };
};
