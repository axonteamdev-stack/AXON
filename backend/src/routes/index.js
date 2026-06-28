import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import medicationRoutes from "./medicationRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import chatRoutes from "./chatRoutes.js";
import postRoutes from "./postRoutes.js";
import recordRoutes from "./recordRoutes.js";
import ddiRoutes from "./ddiRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import prescriptionRoutes from "./prescriptionRoutes.js";
import chatbotRoutes from "./chatbotRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/medications", medicationRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/chat", chatRoutes);
router.use("/posts", postRoutes);
router.use("/records", recordRoutes);
router.use("/ddi", ddiRoutes);
router.use("/notifications", notificationRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/chatbot", chatbotRoutes);

export default router;
