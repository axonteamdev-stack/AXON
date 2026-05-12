import { Router } from "express";
import * as chatController from "../controllers/chatController.js";
import { protect } from "../middlewares/auth.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";

const router = Router();

router.use(protect);

router.get("/conversations", chatController.getMyConversations);
router.post(
    "/conversations/:appointmentId",
    validateObjectId("appointmentId"),
    chatController.startConversation,
);
router.get(
    "/conversations/:conversationId/messages",
    validateObjectId("conversationId"),
    chatController.getMessages,
);
router.post(
    "/conversations/:conversationId/messages",
    validateObjectId("conversationId"),
    chatController.sendMessage,
);

export default router;
