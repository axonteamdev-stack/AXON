import { Router } from "express";
import {
  signupPatient,
  signupDoctor,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  updateMe,
} from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";
import uploadMiddleware from "../middlewares/upload.js";
import { validateBody } from "../middlewares/validate.js";
import {
  patientRegisterSchema,
  doctorRegisterSchema,
  loginSchema,
  updateMeSchema,
} from "../validators/userValidator.js";

const router = Router();

// Public routes
router.post("/signup-patient", uploadMiddleware.patient, validateBody(patientRegisterSchema), signupPatient);
router.post("/signup-doctor", uploadMiddleware.doctor, validateBody(doctorRegisterSchema), signupDoctor);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);

// Protected routes
router.use(protect);
router.patch("/me", uploadMiddleware.general, validateBody(updateMeSchema), updateMe);

export default router;
