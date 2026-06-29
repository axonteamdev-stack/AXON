import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["appointment", "medication", "chat", "system"],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        priority: {
            type: String,
            enum: ["urgent", "normal", "low"],
            default: "normal",
        },
        expiresAt: {
            type: Date,
            default: null,
        },
        data: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    },
);

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
