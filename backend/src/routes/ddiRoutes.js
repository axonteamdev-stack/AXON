import { Router } from "express";
import * as ddiController from "../controllers/ddiController.js";
import { protect } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";
import { parseUniversal } from "../middlewares/parseUniversal.js";
import { z } from "zod";

const router = Router();

router.use(protect);

// ─── PATIENT ENDPOINTS ───

// Patient checks new med against their own existing meds
router.post(
  "/check",
  parseUniversal(),
  validateBody(z.object({ newMedicationName: z.string().min(2) })),
  ddiController.checkMyInteractions,
);

// Patient checks contraindications for themselves
router.post(
  "/contraindications",
  parseUniversal(),
  validateBody(z.object({ medicineName: z.string().min(2) })),
  ddiController.checkMyContraindications,
);

// ─── DOCTOR ENDPOINTS ───

// Doctor checks new med against appointment's patient meds
router.post(
  "/check/appointments/:appointmentId",
  validateObjectId("appointmentId"),
  parseUniversal(),
  validateBody(z.object({ newMedicationName: z.string().min(2) })),
  ddiController.checkPatientInteractions,
);

// Doctor checks contraindications for appointment's patient
router.post(
  "/contraindications/appointments/:appointmentId",
  validateObjectId("appointmentId"),
  parseUniversal(),
  validateBody(z.object({ medicineName: z.string().min(2) })),
  ddiController.checkPatientContraindications,
);

// ─── SHARED ENDPOINTS ───

// Direct drug-to-drug check (any authenticated user)
router.post(
  "/check-direct",
  parseUniversal(),
  validateBody(z.object({ drugs: z.array(z.string().min(1)).min(2) })),
  ddiController.checkDirectInteractions,
);

export default router;
