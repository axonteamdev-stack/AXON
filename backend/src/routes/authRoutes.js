import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { validateBody } from "../middlewares/validate.js";
import uploadMiddleware from "../middlewares/upload.js";
import {
    signupPatientSchema,
    signupDoctorSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from "../validators/authValidator.js";

const router = Router();

router.post(
    "/signup/patient",
    validateBody(signupPatientSchema),
    authController.signupPatient,
);
router.post(
    "/signup/doctor",
    uploadMiddleware.doctor,
    validateBody(signupDoctorSchema),
    authController.signupDoctor,
);
router.post("/login", validateBody(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshAccessToken);
router.post(
    "/forgot-password",
    validateBody(forgotPasswordSchema),
    authController.forgotPassword,
);
router.post(
    "/reset-password",
    validateBody(resetPasswordSchema),
    authController.resetPassword,
);

export default router;
