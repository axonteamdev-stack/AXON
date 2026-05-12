import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        text: {
            type: String,
            trim: true,
            maxlength: [2000, "Message must not exceed 2000 characters"],
            required: function () {
                return !this.image;
            },
        },
        image: {
            type: String,
            default: null,
        },
        read: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true },
);

messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });

export default mongoose.models.Message || mongoose.model("Message", messageSchema);
