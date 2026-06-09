import { Router } from "express";
import * as prescriptionController from "../controllers/prescriptionController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";
import { parseUniversal } from "../middlewares/parseUniversal.js";
import { createMedicationSchema } from "../validators/medicationValidator.js";
import { z } from "zod";

const router = Router();

router.use(protect, restrictTo("doctor"));

router.post(
  "/appointment/:appointmentId",
  validateObjectId("appointmentId"),
  parseUniversal(),
  validateBody(createMedicationSchema),
  prescriptionController.prescribeFromAppointment,
);

router.post(
  "/qr",
  parseUniversal(),
  validateBody(
    createMedicationSchema.extend({
      token: z.string().min(1),
      pin: z.string().min(4).max(4),
    }),
  ),
  prescriptionController.prescribeFromQR,
);

export default router;
