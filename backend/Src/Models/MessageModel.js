import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    text: { type: String }, // النص (اختياري لو مبعوت صورة)
    image: { type: String, default: null }, // رابط الصورة من السحابة
    messageType: { 
        type: String, 
        enum: ["text", "image"], 
        default: "text" 
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;
