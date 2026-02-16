import express from "express";
import * as admin from "../controllers/Admin_Controller.js";
import { protect, restrictTo } from "../middlewares/AuthMiddleware.js";
import { upload } from "../middlewares/UploadMiddleware.js";

const router = express.Router();

// كل العمليات التالية تتطلب تسجيل دخول "أدمن"
router.use(protect);
router.use(restrictTo("admin"));

// التعديل المطلوب في ملف Router
router.post("/users", upload.none(), admin.addUser);
// استخدم upload.none() لفك بيانات الـ form-data النصيةrouter.patch("/activate-doctor/:id", admin.activateDoctor); // تفعيل طبيب
router
  .route("/users/:id")
  .patch(upload.any(), admin.updateUser) // تعديل مستخدم
  .delete(admin.deleteUser); // حذف مستخدم

export default router;
