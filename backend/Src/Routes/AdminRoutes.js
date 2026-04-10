import express from "express";
import * as admin from "../Controllers/AdminController.js";
import { protect, restrictTo } from "../Middlewares/AuthMiddleware.js";
import uploadMiddleware from "../Middlewares/UploadMiddleware.js";

const router = express.Router();

// كل العمليات التالية تتطلب تسجيل دخول "أدمن"
router.use(protect);
router.use(restrictTo("admin"));

// التعديل المطلوب في ملف Router
router.post("/users", uploadMiddleware.none, admin.addUser);
// استخدم uploadMiddleware.none لفك بيانات الـ form-data النصية
router.patch("/activate-doctor/:id", admin.activateDoctor); // تفعيل طبيب
router.route("/users/:id").patch(uploadMiddleware.general, admin.updateUser); // تعديل مستخدم

export default router;
