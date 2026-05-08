import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.js";
import {
  createAppointment,
  getDoctorAppointments,
  getDoctorHistory,
  updateAppointmentStatus,
  getPatientAppointments,
} from "../controllers/appointmentController.js";
import { validateBody } from "../middlewares/validate.js";
import {
  createAppointmentSchema,
  updateStatusSchema,
} from "../validators/appointmentValidator.js";

const router = Router();

router.use(protect);

// Patient routes
router.post("/", restrictTo("patient"), validateBody(createAppointmentSchema), createAppointment);
router.get("/my-appointments", restrictTo("patient"), getPatientAppointments);

// Doctor routes
router.get("/doctor-requests", restrictTo("doctor"), getDoctorAppointments);
router.get("/doctor-history", restrictTo("doctor"), getDoctorHistory);
router.patch("/:id/status", restrictTo("doctor"), validateBody(updateStatusSchema), updateAppointmentStatus);

export default router;
