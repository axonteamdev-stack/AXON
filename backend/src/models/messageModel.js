import mongoose from "mongoose";

const MESSAGE_TYPES = Object.freeze(["text", "image"]);

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
    index: true,
  },
  text: {
    type: String,
    trim: true,
    maxlength: [2000, "Message must not exceed 2000 characters"],
  },
  image: {
    type: String,
    default: null,
  },
  messageType: {
    type: String,
    enum: MESSAGE_TYPES,
    default: "text",
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null,
  },
  readBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    readAt: { type: Date, default: Date.now },
  }],
  deliveredAt: {
    type: Date,
    default: null,
  },
  editedAt: {
    type: Date,
    default: null,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  reactions: {
    type: Map,
    of: String,
    default: {},
  },
  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: [],
  }],
}, { timestamps: true });

messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });

messageSchema.pre("save", function (next) {
  if (this.messageType === "text" && (!this.text || !this.text.trim())) {
    return next(new Error("Text messages require non-empty text"));
  }
  if (this.messageType === "image" && !this.image) {
    return next(new Error("Image messages require an image URL"));
  }
  next();
});

export default mongoose.model("Message", messageSchema);
