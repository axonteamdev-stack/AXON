import { Router } from "express";
import * as paymentController from "../controllers/paymentController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { z } from "zod";

const router = Router();

router.post(
  "/setup-intent",
  protect,
  restrictTo("patient"),
  validateBody(
    z.object({
      appointmentId: z.string().min(1),
    }),
  ),
  paymentController.createSetupIntent,
);

router.post(
  "/attach",
  protect,
  restrictTo("patient"),
  validateBody(
    z.object({
      appointmentId: z.string().min(1),
      setupIntentId: z.string().min(1),
    }),
  ),
  paymentController.attachPaymentMethod,
);

router.get(
  "/:appointmentId",
  protect,
  paymentController.getPayment,
);

export default router;
