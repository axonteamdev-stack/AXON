import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  ],
  appointmentId: {
    type: mongoose.Schema.ObjectId,
    ref: "Appointment",
    required: true
  },
  lastMessage: String,
  lastMessageAt: Date
}, { timestamps: true });

export default mongoose.model("Conversation", conversationSchema);
