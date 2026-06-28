import { Router } from "express";
import * as chatbotController from "../controllers/chatbotController.js";
import { protect } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { parseUniversal } from "../middlewares/parseUniversal.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";
import { askSchema } from "../validators/chatbotValidator.js";

const router = Router();

router.use(protect);

router.post(
  "/ask",
  parseUniversal(),
  validateBody(askSchema),
  chatbotController.askQuestion,
);

router.post(
  "/personalized",
  parseUniversal(),
  validateBody(askSchema),
  chatbotController.personalizedAsk,
);

router.get("/conversations", chatbotController.getConversations);

router.get(
  "/:conversationId/messages",
  validateObjectId("conversationId"),
  chatbotController.getMessages,
);

export default router;
