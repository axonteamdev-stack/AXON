import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authController from "../controllers/authController.js";
import { validateBody } from "../middlewares/validate.js";
import { parseUniversal } from "../middlewares/parseUniversal.js";
import {
  signupPatientSchema,
  signupDoctorSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/authValidator.js";

const router = Router();

const isTest = process.env.NODE_ENV === "test";

const loginLimiter = isTest
  ? (req, res, next) => next()
  : rateLimit({
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

const authLimiter = isTest
  ? (req, res, next) => next()
  : rateLimit({
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
  parseUniversal(["personalPhoto", "radiologyImage", "labImage"]),
  validateBody(signupPatientSchema),
  authController.signupPatient,
);

router.post(
  "/signup/doctor",
  authLimiter,
  parseUniversal(["licenseImage", "personalPhoto"]),
  validateBody(signupDoctorSchema),
  authController.signupDoctor,
);

router.post(
  "/login",
  loginLimiter,
  parseUniversal(),
  validateBody(loginSchema),
  authController.login,
);

router.post("/logout", authController.logout);

router.post("/refresh", authLimiter, authController.refreshAccessToken);

router.post(
  "/forgot-password",
  authLimiter,
  parseUniversal(),
  validateBody(forgotPasswordSchema),
  authController.forgotPassword,
);

router.post(
  "/reset-password",
  authLimiter,
  parseUniversal(),
  validateBody(resetPasswordSchema),
  authController.resetPassword,
);

export default router;
