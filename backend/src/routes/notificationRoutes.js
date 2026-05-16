import { Router } from "express";
import * as notificationController from "../controllers/notificationController.js";
import { protect } from "../middlewares/auth.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";

const router = Router();

router.use(protect);

router.get("/", notificationController.getMyNotifications);

router.get("/unread-count", notificationController.getUnreadCount);

router.patch("/read-all", notificationController.markAllAsRead);

router.patch(
  "/:id/read",
  validateObjectId("id"),
  notificationController.markAsRead,
);

export default router;
