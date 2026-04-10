import express from "express";
import * as medController from "../Controllers/MedicationController.js";
import { protect, restrictTo } from "../Middlewares/AuthMiddleware.js";
import validateMiddleware from "../Middlewares/ValidateMiddleware.js"; // تأكد من المسار والاسم
import { upload } from "../Middlewares/UploadMiddleware.js";

const router = express.Router();

// 1. حماية جميع المسارات القادمة
router.use(protect);

// 2. قصر الوصول للمرضى فقط (لأن الأدوية خاصة بالمريض)
router.use(restrictTo('patient'));

// --- المسارات الأساسية ---

// جلب كل أدوية المريض الحالي
router.get("/", medController.getMyMedications);

// إضافة دواء جديد
router.post(
  "/", 
  upload.none(), 
  validateMiddleware.addMedication, 
  medController.addMedication
);

// تحديث دواء معين بواسطة المعرف (ID)
router.patch(
  "/:id", 
  upload.none(), 
  medController.updateMedication
);

// حذف دواء معين بواسطة المعرف (ID)
router.delete(
  "/:id", 
  medController.deleteMedication
);



router.get("/:id", medController.getSingleMedication);



export default router;
