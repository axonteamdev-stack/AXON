import Message from "../Models/MessageModel.js";
import Conversation from "../Models/ConversationModel.js";
import Appointment from "../Models/AppointmentModel.js";
import { getIO } from "../Socket/socket.js";
import AppError, { catchAsync, sendResponse } from "../Utils/AppError.js";

/**
 * 1. بدء محادثة جديدة (أو جلب محادثة قائمة)
 */
export const startConversation = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        return next(new AppError({
            ar: "هذا الحجز غير موجود",
            en: "This appointment does not exist"
        }, 404));
    }

    // 🔒 لا شات إلا بعد القبول
    if (appointment.status !== 'accepted') {
        return next(new AppError({
            ar: "لا يمكنك بدء المحادثة إلا بعد قبول الطبيب للحجز",
            en: "Conversation allowed only after doctor acceptance"
        }, 403));
    }

    // 🔐 التأكد من الصلاحية
    const isOwner =
        appointment.patient.toString() === req.user.id ||
        appointment.doctor.toString() === req.user.id;

    if (!isOwner) {
        return next(new AppError({
            ar: "غير مسموح لك بالدخول لهذه المحادثة",
            en: "Unauthorized"
        }, 403));
    }

    // 🔁 منع تكرار المحادثة
    let conversation = await Conversation.findOne({ appointmentId });

    if (!conversation) {
        conversation = await Conversation.create({
            appointmentId,
            participants: [appointment.patient, appointment.doctor],
        });
    }

    sendResponse(res, 201, {
        ar: "تم بدء المحادثة بنجاح",
        en: "Conversation started successfully"
    }, conversation);
});

/**
 * 2. إرسال رسالة
 */
export const sendMessage = catchAsync(async (req, res, next) => {
    const { conversationId, text, image } = req.body;

    // ✅ Validation أقوى
    if ((!text || text.trim() === "") && !image) {
        return next(new AppError({
            ar: "لا يمكن إرسال رسالة فارغة",
            en: "Cannot send empty message"
        }, 400));
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        return next(new AppError({
            ar: "المحادثة غير موجودة",
            en: "Conversation not found"
        }, 404));
    }

    // 🔐 التحقق من العضوية
    const isParticipant = conversation.participants.some(
        id => id.toString() === req.user.id
    );

    if (!isParticipant) {
        return next(new AppError({
            ar: "غير مسموح لك بإرسال رسائل هنا",
            en: "Unauthorized"
        }, 403));
    }

    // 🔴 أهم حماية: منع الشات قبل القبول
    const appointment = await Appointment.findById(conversation.appointmentId);

    if (!appointment || appointment.status !== "accepted") {
        return next(new AppError({
            ar: "لا يمكن إرسال رسائل إلا بعد قبول الحجز",
            en: "Chat allowed only after acceptance"
        }, 403));
    }

    // 💾 حفظ الرسالة
    const message = await Message.create({
        sender: req.user.id,
        conversation: conversationId,
        text: text || "",
        image: image || null,
        messageType: image ? "image" : "text"
    });

    // 🔄 تحديث آخر رسالة
    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: image ? "📷 صورة" : text,
        lastMessageAt: new Date(),
    });

    // ⚡ إرسال Real-time
    const io = getIO();
    io.to(conversationId).emit("receiveMessage", {
        _id: message._id,
        sender: req.user.id,
        text: message.text,
        image: message.image,
        messageType: message.messageType,
        createdAt: message.createdAt
    });

    sendResponse(res, 201, {
        ar: "تم إرسال الرسالة",
        en: "Message sent"
    }, message);
});

/**
 * 3. جلب الرسائل
 */
export const getMessages = catchAsync(async (req, res, next) => {
    const messages = await Message.find({
        conversation: req.params.id,
    })
    .populate("sender", "fullName personalPhoto")
    .sort("createdAt");

    sendResponse(res, 200, {
        ar: "تم جلب الرسائل بنجاح",
        en: "Messages retrieved successfully"
    }, messages);
});

/**
 * 4. جلب المحادثات
 */
export const getMyConversations = catchAsync(async (req, res, next) => {
    const conversations = await Conversation.find({
        participants: req.user.id,
    })
    .populate("participants", "fullName personalPhoto")
    .populate({
        path: "appointmentId",
        select: "status amount createdAt"
    })
    .sort("-lastMessageAt");

    sendResponse(res, 200, {
        ar: "تم جلب المحادثات بنجاح",
        en: "Conversations retrieved successfully"
    }, conversations);
});
