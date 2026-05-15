import { Router } from "express";
import * as ddiController from "../controllers/ddiController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { parseForm } from "../middlewares/parseForm.js";
import { z } from "zod";

const router = Router();

router.use(protect);
router.use(restrictTo("doctor"));

const checkSchema = z.object({
  newMedicationName: z.string().min(2),
});

const contraindicationSchema = z.object({
  medicineName: z.string().min(2),
});

router.post(
  "/check",
  parseForm,
  validateBody(checkSchema),
  ddiController.checkInteractions,
);
router.post(
  "/contraindications",
  parseForm,
  validateBody(contraindicationSchema),
  ddiController.checkContraindications,
);

export default router;
