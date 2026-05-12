import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        appointmentId: {
            type: mongoose.Schema.ObjectId,
            ref: "Appointment",
            required: true,
            unique: true,
        },
        lastMessage: {
            type: String,
            default: null,
        },
        lastMessageAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true },
);

conversationSchema.index({ participants: 1, updatedAt: -1 });
conversationSchema.index({ lastMessageAt: -1 });

export default mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);
