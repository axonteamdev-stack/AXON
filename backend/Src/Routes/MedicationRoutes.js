import express from "express";
import * as medController from "../Controllers/MedicationController.js";
import { protect, restrictTo } from "../Middlewares/AuthMiddleware.js";
import { checkMedicationOwnership } from "../Middlewares/OwnershipMiddleware.js";
import validateMiddleware from "../Middlewares/ValidateMiddleware.js";
import uploadMiddleware from "../Middlewares/UploadMiddleware.js";

const router = express.Router();

// 1. Protect all routes
router.use(protect);

// 2. Restrict to patients only
router.use(restrictTo("patient"));

// --- Base Routes ---

router.get("/", medController.getMyMedications);

router.post("/", validateMiddleware.addMedication, medController.addMedication);

// ✅ CRITICAL FIX: Add ownership verification before updates
router.patch("/:id", checkMedicationOwnership, medController.updateMedication);

// ✅ CRITICAL FIX: Add ownership verification before deletion
router.delete("/:id", checkMedicationOwnership, medController.deleteMedication);

router.get("/:id", checkMedicationOwnership, medController.getSingleMedication);

// ✅ CRITICAL FIX: Add ownership verification before dose marking
router.patch("/:id/taken", checkMedicationOwnership, medController.markAsTaken);

router.patch("/:id/skip", checkMedicationOwnership, medController.skipDose);

export default router;
