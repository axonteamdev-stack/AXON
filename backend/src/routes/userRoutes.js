import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";
import {
  toggleFollow,
  searchDoctors,
  getAllDoctors,
  getDoctorDetails,
  getProfile,
  getFollowing,
  getFollowers,
} from "../controllers/userController.js";

const router = Router();

// Public routes
router.get("/doctors", getAllDoctors);
router.get("/doctors/:id", validateObjectId("id"), getDoctorDetails);
router.get("/doctors/search", searchDoctors);

// Protected routes
router.use(protect);
router.patch("/me/following/:id", validateObjectId("id"), toggleFollow);
router.get("/me", getProfile);
router.get("/me/following", getFollowing);
router.get("/me/followers", getFollowers);

export default router;
