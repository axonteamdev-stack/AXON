import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }],
  appointmentId: {
    type: mongoose.Schema.ObjectId,
    ref: "Appointment",
    required: true,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    enum: ["active", "closed", "archived"],
    default: "active",
  },
  lastMessage: {
    type: String,
    default: null,
  },
  lastMessageAt: {
    type: Date,
    default: null,
  },
  readBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    readAt: { type: Date, default: Date.now },
  }],
  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: [],
  }],
}, { timestamps: true });

conversationSchema.index({ participants: 1, updatedAt: -1 });
conversationSchema.index({ lastMessageAt: -1 });

// Validate exactly 2 participants
conversationSchema.pre("save", function (next) {
  if (this.participants.length !== 2) {
    return next(new Error("Conversation must have exactly 2 participants"));
  }
  next();
});

export default mongoose.model("Conversation", conversationSchema);
