import express from "express";
import * as medController from "../Controllers/MedicationController.js";
import { protect, restrictTo } from "../Middlewares/AuthMiddleware.js";
import validateMiddleware from "../Middlewares/ValidateMiddleware.js"; // تأكد من المسار والاسم
import { upload } from "../Middlewares/UploadMiddleware.js";

const router = express.Router();

// 1. حماية جميع المسارات التالية
router.use(protect);

// 2. قصر الوصول للمرضى فقط
router.use(restrictTo("patient"));

router
  .route("/")
  // جلب كل أدوية المريض الحالي
  .get(medController.getMyMedications)

  // إضافة دواء جديد
  // ملاحظة: upload.none() يجب أن يسبق الـ validation لقراءة حقول الـ form-data
  .post(
    upload.none(),
    validateMiddleware.addMedication,
    medController.addMedication,
  );

router
  .route("/:id")
  .patch(upload.none(), medController.updateMedication) // تعديل دواء
  .delete(medController.deleteMedication); // حذف دواء

export default router;
