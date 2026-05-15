import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";
import uploadMiddleware from "../middlewares/upload.js";

const router = Router();

// Public routes
router.get(
  "/doctors/:id",
  validateObjectId("id"),
  userController.getDoctorDetails,
);
router.get("/doctors/search", userController.searchDoctors);
router.get("/doctors", userController.getAllDoctors);

// Protected routes
router.use(protect);

router.get("/me", userController.getProfile);
router.patch("/me", uploadMiddleware.patient, userController.updateProfile);

// ❌ Follow routes REMOVED — no follow system for any users

export default router;
