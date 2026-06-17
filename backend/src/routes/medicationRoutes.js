import { Router } from "express";
import * as medicationController from "../controllers/medicationController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";
import { parseUniversal } from "../middlewares/parseUniversal.js";
import {
  createMedicationSchema,
  updateMedicationSchema,
  markDoseSchema,
} from "../validators/medicationValidator.js";

const router = Router();

router.use(protect);

router.post(
  "/",
  restrictTo("doctor"),
  parseUniversal(),
  validateBody(createMedicationSchema),
  medicationController.create,
);

router.post(
  "/self",
  restrictTo("patient"),
  parseUniversal(),
  validateBody(createMedicationSchema),
  medicationController.createSelfMedication,
);

router.get("/", medicationController.getMyMedications);

router.get("/pending-doses", medicationController.getPendingDoses);

router.get(
  "/patient/:patientId",
  restrictTo("doctor"),
  validateObjectId("patientId"),
  medicationController.getPatientMedications,
);

router.get("/:id", validateObjectId("id"), medicationController.getById);

router.patch(
  "/:id",
  validateObjectId("id"),
  parseUniversal(),
  validateBody(updateMedicationSchema),
  medicationController.update,
);

router.delete("/:id", validateObjectId("id"), medicationController.remove);

router.post(
  "/:id/doses",
  validateObjectId("id"),
  parseUniversal(),
  validateBody(markDoseSchema),
  medicationController.markDose,
);

export default router;
