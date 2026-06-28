import mongoose from "mongoose";

const { Schema } = mongoose;

const botMessageSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "BotConversation",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

botMessageSchema.index({ conversation: 1, createdAt: 1 });

export default mongoose.models.BotMessage ||
  mongoose.model("BotMessage", botMessageSchema);
