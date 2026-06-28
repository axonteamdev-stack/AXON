import mongoose from "mongoose";

const { Schema } = mongoose;

const botConversationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      default: "New conversation",
      maxlength: 200,
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
  {
    timestamps: true,
  },
);

botConversationSchema.index({ userId: 1, lastMessageAt: -1 });

export default mongoose.models.BotConversation ||
  mongoose.model("BotConversation", botConversationSchema);
