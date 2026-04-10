// src/models/ArticleModel.js
import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "المقال يجب أن ينتمي لطبيب"],
  },
  title: { // حقل واحد فقط
    type: String,
    required: [true, "عنوان المقال مطلوب"],
  },
  content: { // حقل واحد فقط
    type: String,
    default: "",
  },
  image: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model("Article", articleSchema);
