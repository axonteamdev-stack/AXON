import mongoose from "mongoose";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import Appointment from "../models/appointmentModel.js";
import AppError from "../utils/appError.js";
import { msg } from "../utils/i18n.js";
import { getIO } from "../config/socket.js";

export const start = async (appointmentId) => {
  let conversation = await Conversation.findOne({ appointmentId });
  if (conversation) return conversation;

  const appointment = await Appointment.findById(appointmentId);
  return Conversation.create({
    appointmentId,
    participants: [appointment.patient, appointment.doctor],
  });
};

export const send = async (conversationId, senderId, { text, image }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const message = await Message.create(
      [{
        sender: senderId,
        conversation: conversationId,
        text: text?.trim(),
        image: image || null,
        messageType: image ? "image" : "text",
      }],
      { session }
    );

    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: image ? "📷 صورة" : text,
        lastMessageAt: new Date(),
      },
      { session }
    );

    await session.commitTransaction();

    try {
      const io = getIO();
      io.to(conversationId).emit("receiveMessage", {
        _id: message[0]._id,
        sender: senderId,
        text: message[0].text,
        image: message[0].image,
        messageType: message[0].messageType,
        createdAt: message[0].createdAt,
      });
    } catch {
      console.warn("Socket emission failed");
    }

    return message[0];
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const getMessages = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation.participants.includes(userId)) {
    throw new AppError(msg("غير مسموح", "Unauthorized"), 403);
  }

  await Message.updateMany(
    { conversation: conversationId, "readBy.user": { $ne: userId } },
    { $push: { readBy: { user: userId, readAt: new Date() } } }
  );

  return Message.find({ conversation: conversationId })
    .populate("sender", "fullName personalPhoto")
    .sort("createdAt")
    .limit(100);
};

export const getConversations = (userId) =>
  Conversation.find({ participants: userId })
    .populate("participants", "fullName personalPhoto")
    .populate({ path: "appointmentId", select: "status amount createdAt" })
    .sort("-lastMessageAt");
