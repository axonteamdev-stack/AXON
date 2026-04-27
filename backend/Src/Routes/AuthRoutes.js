import express from "express";
import * as auth from "../Controllers/AuthController.js";
import uploadMiddleware from "../Middlewares/UploadMiddleware.js";
import validateMiddleware from "../Middlewares/ValidateMiddleware.js";
import * as authMid from "../Middlewares/AuthMiddleware.js";
import * as userController from "../Controllers/UserController.js";

const router = express.Router();

router.post(
  "/signup-patient",
  uploadMiddleware.patient,
  validateMiddleware.patientRegister,
  auth.signupPatient
);

router.post(
  "/signup-doctor",
  uploadMiddleware.doctor,
  validateMiddleware.doctorRegister,
  auth.signupDoctor
);

router.post("/login", validateMiddleware.login, auth.login);
router.post("/logout", auth.logout);
router.post("/refresh-token", auth.refreshAccessToken);
router.post("/forgot-password", auth.forgotPassword);
router.patch("/reset-password", auth.resetPassword);

router.patch(
  "/updateMe",
  authMid.protect,
  uploadMiddleware.patient,
  validateMiddleware.updateMe,
  auth.updateMe
);

router.use(authMid.protect);
router.patch("/follow/:id", userController.toggleFollow);
router.post("/search-doctors", userController.searchDoctors);
router.get("/all-doctors", userController.getAllDoctors);
router.get("/doctor/:id", userController.getDoctorDetails);

export default router;
