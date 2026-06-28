import { catchAsync } from "../utils/catchAsync.js";
import { sendLocalizedResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import * as ChatbotService from "../services/chatbotService.js";

export const askQuestion = catchAsync(async (req, res) => {
  const result = await ChatbotService.askQuestion(req.user.id, req.body);
  sendLocalizedResponse(
    res,
    200,
    msg("تمت الإجابة", "Question answered"),
    {
      reply: result.reply,
      conversationId: result.conversationId,
      modelUsed: result.modelUsed,
    },
    req.lang,
  );
});

export const personalizedAsk = catchAsync(async (req, res) => {
  const result = await ChatbotService.personalizedAsk(req.user.id, req.body);
  sendLocalizedResponse(
    res,
    200,
    msg("تمت الإجابة بناءً على ملفك", "Personalized answer provided"),
    {
      reply: result.reply,
      conversationId: result.conversationId,
      modelUsed: result.modelUsed,
    },
    req.lang,
  );
});

export const getConversations = catchAsync(async (req, res) => {
  const conversations = await ChatbotService.getConversations(req.user.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب المحادثات", "Conversations fetched"),
    { conversations },
    req.lang,
  );
});

export const getMessages = catchAsync(async (req, res) => {
  const messages = await ChatbotService.getConversationMessages(
    req.user.id,
    req.params.conversationId,
  );
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب الرسائل", "Messages fetched"),
    { messages },
    req.lang,
  );
});
