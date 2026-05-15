import { catchAsync } from "../utils/catchAsync.js";
import { sendLocalizedResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import * as NotificationService from "../services/notificationService.js";

export const getMyNotifications = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await NotificationService.getForUser(
    req.user.id,
    Number(page),
    Number(limit),
  );
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب الإشعارات", "Notifications fetched"),
    result,
    req.lang,
  );
});

export const markAsRead = catchAsync(async (req, res) => {
  await NotificationService.markAsRead(req.params.id, req.user.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم تحديد الإشعار كمقروء", "Notification marked as read"),
    null,
    req.lang,
  );
});

export const markAllAsRead = catchAsync(async (req, res) => {
  await NotificationService.markAllAsRead(req.user.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم تحديد الكل كمقروء", "All notifications marked as read"),
    null,
    req.lang,
  );
});

export const getUnreadCount = catchAsync(async (req, res) => {
  const count = await NotificationService.getUnreadCount(req.user.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب العدد", "Count fetched"),
    { count },
    req.lang,
  );
});
