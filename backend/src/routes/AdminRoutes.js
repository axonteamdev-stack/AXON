import express from "express";
import * as admin from "../controllers/Admin_Controller.js";
import { protect, restrictTo } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// كل العمليات التالية تتطلب تسجيل دخول "أدمن"
router.use(protect);
router.use(restrictTo("admin"));

router.post("/users", admin.addUser); // إضافة مستخدم
router.patch("/activate-doctor/:id", admin.activateDoctor); // تفعيل طبيب
router
  .route("/users/:id")
  .patch(admin.updateUser) // تعديل مستخدم
  .delete(admin.deleteUser); // حذف مستخدم

export default router;
