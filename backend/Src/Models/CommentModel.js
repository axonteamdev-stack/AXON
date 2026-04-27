import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    // --- References ---
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post reference is required"],
      // index: true, <-- Removed: Redundant with compound index (post, createdAt)
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
      // index: true, <-- Removed: Redundant with manual index below
    },

    // --- Content ---
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [1, "Content cannot be empty"],
      maxlength: [2000, "Content must not exceed 2000 characters"],
    },

    // --- Nested Replies ---
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      // index: true, <-- Removed: Redundant with manual index below
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: [],
      },
    ],

    // --- Likes ---
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    // --- Metadata ---
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// --- Indexes ---
// Corrected: Removed duplicates. We keep these because they define specific directions or compound logic.
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ isDeleted: 1 });

// --- Virtuals ---
commentSchema.virtual("likeCount").get(function () {
  return this.likes?.length || 0;
});

commentSchema.virtual("replyCount").get(function () {
  return this.replies?.length || 0;
});

// --- Pre-save Hooks ---
commentSchema.pre("save", function (next) {
  if (this.isModified("content") && !this.isNew) {
    this.editedAt = new Date();
  }
  next();
});

// --- Query Hooks ---
commentSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export default mongoose.model("Comment", commentSchema);
