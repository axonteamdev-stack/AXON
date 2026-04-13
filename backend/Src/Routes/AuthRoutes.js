import express from "express";
import * as auth from "../Controllers/AuthController.js";
import upload from "../Middlewares/UploadMiddleware.js";
import validate from "../Middlewares/ValidateMiddleware.js";
import * as authMid from "../Middlewares/AuthMiddleware.js";
import * as userController from "../Controllers/UserController.js";

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
router.post('/logout', auth.logout);
router.post("/refresh-token", auth.refreshAccessToken);
router.post("/forgot-password", auth.forgotPassword);
router.patch("/reset-password", auth.resetPassword); // Token goes in body, not URL


router.patch(
  "/updateMe",
  authMid.protect,      // تأكد إن دي موجودة في AuthController
  upload.patient,    // تأكد إن دي موجودة في UploadMiddleware
  validate.updateMe, // لو دي undefined هيطلع الـ TypeError
  auth.updateMe      // لو دي undefined هيطلع الـ TypeError
);




router.use(authMid.protect); 
router.patch("/follow/:id", userController.toggleFollow);




router.post("/search-doctors", userController.searchDoctors);

router.get("/all-doctors", userController.getAllDoctors);

router.get("/doctor/:id", userController.getDoctorDetails);


export default router;
