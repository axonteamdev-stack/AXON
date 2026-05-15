import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/authController.js";
import { validateBody } from "../middlewares/validate.js";
import { parseForm } from "../middlewares/parseForm.js";
import uploadMiddleware from "../middlewares/upload.js";
import {
  signupPatientSchema,
  signupDoctorSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/authValidator.js";

const router = Router();

// Stricter limit for login (5 attempts per 15 min)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: "fail",
      message: "Too many login attempts. Please try again later.",
    });
  },
});

// General auth limit for signup/password reset (10 attempts per 15 min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: "fail",
      message: "Too many requests. Please try again later.",
    });
  },
});

router.post(
  "/signup/patient",
  authLimiter,
  parseForm,
  validateBody(signupPatientSchema),
  authController.signupPatient,
);

router.post(
  "/signup/doctor",
  authLimiter,
  uploadMiddleware.doctor,
  validateBody(signupDoctorSchema),
  authController.signupDoctor,
);

router.post(
  "/login",
  loginLimiter,
  parseForm,
  validateBody(loginSchema),
  authController.login,
);

router.post("/logout", authController.logout);

router.post("/refresh", authController.refreshAccessToken);

router.post(
  "/forgot-password",
  authLimiter,
  parseForm,
  validateBody(forgotPasswordSchema),
  authController.forgotPassword,
);

router.post(
  "/reset-password",
  authLimiter,
  parseForm,
  validateBody(resetPasswordSchema),
  authController.resetPassword,
);

export default router;
