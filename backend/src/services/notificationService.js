import Notification from "../models/Notification.js";
import { getIO } from "../config/socket.js";

export const create = async (userId, type, title, message, data = {}) => {
    const notification = await Notification.create({
        user: userId,
        type,
        title,
        message,
        data,
    });

    // Emit via socket if user is online
    try {
        const io = getIO();
        io.to(userId.toString()).emit("notification", {
            _id: notification._id,
            type,
            title,
            message,
            data,
            createdAt: notification.createdAt,
        });
    } catch {
        console.warn("Socket not available for notification");
    }

    return notification;
};

export const getForUser = async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
        Notification.find({ user: userId })
            .sort("-createdAt")
            .skip(skip)
            .limit(limit)
            .lean(),
        Notification.countDocuments({ user: userId }),
    ]);

    return {
        data: notifications,
        pagination: {
            current: page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

export const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user: userId },
        { read: true },
        { new: true },
    );

    if (!notification) {
        throw new Error("Notification not found");
    }

    return notification;
};

export const markAllAsRead = async (userId) => {
    await Notification.updateMany(
        { user: userId, read: false },
        { read: true },
    );

    return true;
};

export const getUnreadCount = async (userId) => {
    return Notification.countDocuments({ user: userId, read: false });
};
