import { Router } from "express";
import * as chatController from "../controllers/chatController.js";
import { protect } from "../middlewares/auth.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";

const router = Router();

router.use(protect);

router.post(
  "/start/:appointmentId",
  validateObjectId("appointmentId"),
  chatController.startConversation,
);

router.get("/conversations", chatController.getMyConversations);

router.get(
  "/:conversationId/messages",
  validateObjectId("conversationId"),
  chatController.getMessages,
);

router.post(
  "/:conversationId/messages",
  validateObjectId("conversationId"),
  chatController.sendMessage,
);

export default router;
