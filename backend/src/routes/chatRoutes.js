import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { restrictChat } from "../middlewares/appointmentAuth.js";
import {
  startConversation,
  sendMessage,
  getMyConversations,
  getMessages,
} from "../controllers/chatController.js";
import { validateBody } from "../middlewares/validate.js";
import { sendMessageSchema } from "../validators/chatValidator.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";

const router = Router();

router.use(protect);
router.post("/start/:appointmentId", validateObjectId("appointmentId"), restrictChat, startConversation);
router.get("/", getMyConversations);
router.get("/:conversationId/messages", getMessages);
router.post("/:conversationId/messages", validateBody(sendMessageSchema), restrictChat, sendMessage);

export default router;
