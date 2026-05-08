import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import * as ChatService from "../services/chatService.js";

export const startConversation = catchAsync(async (req, res) => {
  const conversation = await ChatService.start(req.params.appointmentId);
  sendResponse(res, 201, msg("تم بدء المحادثة", "Conversation started"), conversation);
});

export const sendMessage = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const message = await ChatService.send(conversationId, req.user.id, req.body);
  sendResponse(res, 201, msg("تم إرسال الرسالة", "Message sent"), message);
});

export const getMessages = catchAsync(async (req, res) => {
  const messages = await ChatService.getMessages(req.params.conversationId, req.user.id);
  sendResponse(res, 200, msg("تم جلب الرسائل", "Messages retrieved"), messages);
});

export const getMyConversations = catchAsync(async (req, res) => {
  const conversations = await ChatService.getConversations(req.user.id);
  sendResponse(res, 200, msg("تم جلب المحادثات", "Conversations retrieved"), conversations);
});
