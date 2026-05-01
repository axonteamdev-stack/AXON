import express from "express";
import * as appointment from "../Controllers/AppointmentController.js";
import { protect, restrictTo } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.use(protect); // لازم يكون مسجل دخول

// 1. المريض: إنشاء حجز
router.post("/", restrictTo("patient"), appointment.createAppointment);

// 2. الدكتور: جلب الطلبات الجديدة (Pending)
router.get("/doctor-requests", restrictTo("doctor"), appointment.getDoctorAppointments);

// 3. الدكتور: جلب كل تاريخ الحجوزات الخاص به (Accepted, Rejected, etc.)
router.get("/my-history", restrictTo("doctor"), appointment.getDoctorHistory);

// 4. الدكتور: اتخاذ قرار
router.patch("/:id/accept", restrictTo("doctor"), appointment.acceptAppointment);
router.patch("/:id/reject", restrictTo("doctor"), appointment.rejectAppointment);

export default router;
