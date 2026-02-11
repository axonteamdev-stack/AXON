import express from "express";
import * as auth from "../controllers/AuthController.js";
import upload from "../Middlewares/UploadMiddleware.js";
import validate from "../Middlewares/ValidateMiddleware.js";

const router = express.Router();
// Order is vital: 1. Upload (parses form-data) -> 2. Validate -> 3. Controller
router.post(
  "/signup-patient",
  upload.patient, // Ensure this is not undefined in UploadMiddleware.js
  validate.patientRegister, // This is now a verified function
  auth.signupPatient
);

router.post(
  "/signup-doctor",
  upload.doctor,
  validate.doctorRegister,
  auth.signupDoctor
);

router.post("/login", validate.login, auth.login);
router.post("/refresh-token", auth.refreshAccessToken);
router.post("/forgot-password", auth.forgotPassword);
router.patch("/reset-password", auth.resetPassword); // Token goes in body, not URL

export default router;
