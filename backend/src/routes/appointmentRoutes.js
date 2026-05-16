import { Router } from "express";
import * as appointmentController from "../controllers/appointmentController.js";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";
import { parseForm } from "../middlewares/parseForm.js";
import { z } from "zod";

const router = Router();

router.use(protect);

// Patient routes — accept JSON and form-data
router.post(
  "/",
  parseForm,
  validateBody(
    z.object({
      doctorId: z.string().min(1),
      scheduledAt: z.string().datetime(),
      notes: z.string().optional(),
    }),
  ),
  appointmentController.create,
);

router.get("/my", appointmentController.getMyAppointments);
router.patch(
  "/:id/cancel",
  validateObjectId("id"),
  appointmentController.cancel,
);

// Doctor routes
router.get(
  "/pending",
  restrictTo("doctor"),
  appointmentController.getPendingRequests,
);
router.get(
  "/history",
  restrictTo("doctor"),
  appointmentController.getDoctorHistory,
);
router.patch(
  "/:id/status",
  restrictTo("doctor"),
  validateObjectId("id"),
  parseForm,
  validateBody(
    z.object({
      status: z.enum(["accepted", "rejected"]),
    }),
  ),
  appointmentController.updateStatus,
);

export default router;
