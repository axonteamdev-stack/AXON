import mongoose from "mongoose";

const { Schema } = mongoose;

const articleSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor reference is required"],
      // Removed redundant index: true because it is included in the compound index below
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title must not exceed 200 characters"],
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
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
// This compound index handles searches for 'doctor' alone AND 'doctor' with 'createdAt'
articleSchema.index({ doctor: 1, createdAt: -1 });
articleSchema.index({ isDeleted: 1 });

// Virtuals
articleSchema.virtual("likeCount").get(function () {
  return this.likes?.length || 0;
});

// Middleware — soft-delete filter
articleSchema.pre(/^find/, function () {
  this.find({ isDeleted: { $ne: true } });
});

export default mongoose.model("Article", articleSchema);
