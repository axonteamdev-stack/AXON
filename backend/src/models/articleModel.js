import mongoose from "mongoose";

const { Schema } = mongoose;

const MAX_ARTICLE_LIKES = 10000;

const articleSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Doctor reference is required"],
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [5, "Title must be at least 5 characters"],
    maxlength: [200, "Title must not exceed 200 characters"],
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true,
    minlength: [10, "Content must be at least 10 characters"],
  },
  image: {
    type: String,
    default: null,
  },
  category: {
    type: String,
    trim: true,
    default: null,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "published",
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
    validate: {
      validator: function (v) {
        return v.length <= MAX_ARTICLE_LIKES;
      },
      message: `Cannot exceed ${MAX_ARTICLE_LIKES} likes`,
    },
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

articleSchema.index({ doctor: 1, createdAt: -1 });
articleSchema.index({ category: 1, createdAt: -1 });
articleSchema.index({ tags: 1, createdAt: -1 });
articleSchema.index({ isDeleted: 1 });

articleSchema.virtual("likeCount").get(function () {
  return this.likes?.length || 0;
});

// Explicit soft-delete filter (safer than pre(/^find/))
articleSchema.statics.findActive = function (filter = {}) {
  return this.find({ ...filter, isDeleted: { $ne: true } });
};

export default mongoose.model("Article", articleSchema);
