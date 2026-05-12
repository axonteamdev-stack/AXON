import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/auth.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";
import uploadMiddleware from "../middlewares/upload.js";

const router = Router();

// Public routes
router.get("/doctors", userController.getAllDoctors);
router.get("/doctors/search", userController.searchDoctors);
router.get(
    "/doctors/:id",
    validateObjectId("id"),
    userController.getDoctorDetails,
);

// Protected routes
router.use(protect);

router.get("/me", userController.getProfile);
router.patch("/me", uploadMiddleware.patient, userController.updateProfile);
router.post("/follow/:id", validateObjectId("id"), userController.toggleFollow);
router.get("/following", userController.getFollowing);
router.get("/followers", userController.getFollowers);

export default router;
