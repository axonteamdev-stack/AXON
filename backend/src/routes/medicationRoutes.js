import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { createOwnershipMiddleware } from "../middlewares/checkOwnership.js";
import Medication from "../models/medicationModel.js";
import {
  getMyMedications,
  addMedication,
  updateMedication,
  deleteMedication,
  getSingleMedication,
  markAsTaken,
  skipDose,
} from "../controllers/medicationController.js";
import { validateBody } from "../middlewares/validate.js";
import {
  addMedicationSchema,
  updateMedicationSchema,
  doseActionSchema,
} from "../validators/medicationValidator.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";

const router = Router();
const checkMedicationOwnership = createOwnershipMiddleware(Medication, "patientId", "medication");

router.use(protect);
router.get("/", getMyMedications);
router.post("/", validateBody(addMedicationSchema), addMedication);

router.use("/:id", checkMedicationOwnership);
router.get("/:id", validateObjectId("id"), getSingleMedication);
router.patch("/:id", validateObjectId("id"), validateBody(updateMedicationSchema), updateMedication);
router.delete("/:id", validateObjectId("id"), deleteMedication);
router.patch("/:id/status", validateBody(doseActionSchema), markAsTaken);

export default router;
