import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";
import { parseUniversal } from "../middlewares/parseUniversal.js";

const router = Router();

router.get(
  "/doctors/:id",
  validateObjectId("id"),
  userController.getDoctorDetails,
);

router.get(
  "/patients/:id",
  validateObjectId("id"),
  userController.getPatientDetails,
);

router.get("/doctors/search", userController.searchDoctors);

router.get("/doctors", userController.getAllDoctors);

router.use(protect);

router.get("/me", userController.getProfile);

router.patch(
  "/me",
  parseUniversal(["personalPhoto"]),
  userController.updateProfile,
);

export default router;
