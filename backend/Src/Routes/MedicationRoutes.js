import express from "express";
import * as medController from "../Controllers/MedicationController.js";
import { protect, restrictTo } from "../Middlewares/AuthMiddleware.js";
import validateMiddleware from "../Middlewares/ValidateMiddleware.js";
import uploadMiddleware from "../Middlewares/UploadMiddleware.js";

const router = express.Router();

// 1. Protect all routes
router.use(protect);

// 2. Restrict to patients only
router.use(restrictTo("patient"));

// --- Base Routes ---

router.get("/", medController.getMyMedications);

router.post(
  "/",
  validateMiddleware.addMedication,
  medController.addMedication
);

router.patch(
  "/:id",
  medController.updateMedication
);

router.delete("/:id", medController.deleteMedication);

router.get("/:id", medController.getSingleMedication);

router.patch("/:id/taken", medController.markAsTaken);

router.patch("/:id/skip", medController.skipDose);


export default router;
