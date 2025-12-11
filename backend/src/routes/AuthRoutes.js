import express from "express";
import authController from "../controllers/AuthController.js";
import uploadMiddleware from "../middlewares/UploadMiddleware.js";
import validateMiddleware from "../middlewares/ValidateMiddleware.js";
import authMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Route for patient registration
router.post(
  "/register/patient",
  uploadMiddleware.patient,
  validateMiddleware.patientRegister, // Joi validation for patient data
  authController.registerPatient
);

// Route for doctor registration (requires file upload and validation)
router.post(
  "/register/doctor",
  uploadMiddleware.doctor, // Multer handles certificate image upload first
  validateMiddleware.doctorRegister, // Joi validation for doctor data (after file is in req.file)
  authController.registerDoctor
);

// // صفحة تسجيل الدخول
// router.get('/login2', authController.loginpage);

// // معالجة تسجيل الدخول
// router.post('/login2', authController.loginHandler);

// Route for login (supports both patient and doctor)
router.post(
  "/login",
  validateMiddleware.login, // Joi validation for login credentials
  authController.loginUser
);

router.post(
  "/change-password",
  authMiddleware.protectAny,
  validateMiddleware.changePassword,
  authController.changePassword
);

// Route for logout
router.post("/logout", authController.logoutUser);

export default router;
