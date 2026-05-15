import { catchAsync } from "../utils/catchAsync.js";
import { sendLocalizedResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import * as ChatService from "../services/chatService.js";

export const startConversation = catchAsync(async (req, res) => {
  const conversation = await ChatService.start(req.params.appointmentId);
  sendLocalizedResponse(
    res,
    200,
    msg("تم بدء المحادثة", "Conversation started"),
    {
      conversation,
    },
    req.lang,
  );
});

export const sendMessage = catchAsync(async (req, res) => {
  const message = await ChatService.send(
    req.params.conversationId,
    req.user.id,
    req.body,
  );
  sendLocalizedResponse(
    res,
    201,
    msg("تم إرسال الرسالة", "Message sent"),
    {
      message,
    },
    req.lang,
  );
});

export const getMessages = catchAsync(async (req, res) => {
  const messages = await ChatService.getMessages(
    req.params.conversationId,
    req.user.id,
  );
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب الرسائل", "Messages fetched"),
    {
      messages,
    },
    req.lang,
  );
});

export const getMyConversations = catchAsync(async (req, res) => {
  const conversations = await ChatService.getConversations(req.user.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب المحادثات", "Conversations fetched"),
    {
      conversations,
    },
    req.lang,
  );
});
