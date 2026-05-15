import { Router } from "express";
import * as medicationController from "../controllers/medicationController.js";
import { protect } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";
import { parseForm } from "../middlewares/parseForm.js";
import {
  createMedicationSchema,
  updateMedicationSchema,
  markDoseSchema,
} from "../validators/medicationValidator.js";

const router = Router();

router.use(protect);

router.post(
  "/",
  parseForm,
  validateBody(createMedicationSchema),
  medicationController.create,
);
router.get("/", medicationController.getMyMedications);
router.get("/pending-doses", medicationController.getPendingDoses);
router.get("/:id", validateObjectId("id"), medicationController.getById);
router.patch(
  "/:id",
  validateObjectId("id"),
  parseForm,
  validateBody(updateMedicationSchema),
  medicationController.update,
);
router.delete("/:id", validateObjectId("id"), medicationController.remove);
router.post(
  "/:id/doses",
  validateObjectId("id"),
  parseForm,
  validateBody(markDoseSchema),
  medicationController.markDose,
);

export default router;
