import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import Appointment from "../models/Appointment.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";
import { getIO } from "../config/socket.js";
import * as NotificationService from "./notificationService.js";

export const start = async (appointmentId) => {
    let conversation = await Conversation.findOne({ appointmentId });
    if (conversation) return conversation;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        throw new AppError(
            msg("الحجز غير موجود", "Appointment not found"),
            404,
        );
    }

    return Conversation.create({
        appointmentId,
        participants: [appointment.patient, appointment.doctor],
    });
};

export const send = async (conversationId, senderId, { text, image }) => {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        throw new AppError(
            msg("المحادثة غير موجودة", "Conversation not found"),
            404,
        );
    }

    if (!conversation.participants.includes(senderId)) {
        throw new AppError(msg("غير مسموح", "Unauthorized"), 403);
    }

    const message = await Message.create({
        sender: senderId,
        conversation: conversationId,
        text: text?.trim(),
        image: image || null,
    });

    // Update conversation last message
    conversation.lastMessage = image ? "📷 صورة" : text;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Emit via socket
    try {
        const io = getIO();
        io.to(conversationId).emit("newMessage", {
            _id: message._id,
            sender: senderId,
            text: message.text,
            image: message.image,
            createdAt: message.createdAt,
        });
    } catch {
        console.warn("Socket emission failed");
    }

    const recipientId = conversation.participants.find(
        (p) => p.toString() !== senderId.toString(),
    );
    if (recipientId) {
        await NotificationService.create(
            recipientId,
            "chat",
            msg("رسالة جديدة", "New Message"),
            text || msg("تم إرسال صورة", "An image was sent"),
            {
                conversationId,
                senderId,
                messageId: message._id,
            },
            "normal",
        );
    }

    return message;
};

export const getMessages = async (conversationId, userId) => {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        throw new AppError(
            msg("المحادثة غير موجودة", "Conversation not found"),
            404,
        );
    }

    if (!conversation.participants.includes(userId)) {
        throw new AppError(msg("غير مسموح", "Unauthorized"), 403);
    }

    // Mark messages as read
    await Message.updateMany(
        { conversation: conversationId, sender: { $ne: userId }, read: false },
        { read: true, readAt: new Date() },
    );

    return Message.find({ conversation: conversationId })
        .populate("sender", "fullName personalPhoto")
        .sort("createdAt")
        .limit(100);
};

export const getConversations = (userId) =>
    Conversation.find({ participants: userId })
        .populate("participants", "fullName personalPhoto")
        .populate({ path: "appointmentId", select: "status scheduledAt" })
        .sort("-lastMessageAt");
