import express from "express";
import * as chat from "../Controllers/ChatController.js";
import { protect } from "../Middlewares/AuthMiddleware.js";
import { restrictChat } from "../Middlewares/ChatMiddleware.js"; // استيراد الميدلوير الضامن

const router = express.Router();

router.use(protect);

// 1. بدء المحادثة: تم إضافة restrictChat وتمرير معرف الحجز في الرابط
// المريض مش هيقدر يفتح شات إلا لو الـ appointmentId حالته accepted
router.post("/start/:appointmentId", restrictChat, chat.startConversation);

// 2. إرسال رسالة
router.post("/send", chat.sendMessage);

// 3. جلب كل المحادثات الخاصة بالمستخدم
router.get("/", chat.getMyConversations);

// 4. جلب رسائل محادثة معينة بواسطة الـ ID
router.get("/:id", chat.getMessages);

export default router;
