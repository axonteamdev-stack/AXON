import mongoose from "mongoose";

const { Schema } = mongoose;

const MAX_COMMENT_LIKES = Number(process.env.MAX_COMMENT_LIKES) || 5000;

const commentSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: [true, "Post reference is required"],
    index: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required"],
    index: true,
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true,
    minlength: [1, "Content cannot be empty"],
    maxlength: [2000, "Content must not exceed 2000 characters"],
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
    index: true,
  },
  ancestors: [{
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: [],
  }],
  likes: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
    validate: {
      validator: function (v) {
        return v.length <= MAX_COMMENT_LIKES;
      },
      message: `Cannot exceed ${MAX_COMMENT_LIKES} likes`,
    },
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false,
  },
  editedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1, createdAt: 1 });
commentSchema.index({ isDeleted: 1 });

commentSchema.virtual("likeCount").get(function () {
  return this.likes?.length || 0;
});

commentSchema.virtual("replyCount").get(function () {
  return this._replyCount || 0;
});

commentSchema.pre("save", function (next) {
  if (this.isModified("content") && !this.isNew) {
    this.editedAt = new Date();
  }
  next();
});

// Explicit soft-delete filter
commentSchema.statics.findActive = function (filter = {}) {
  return this.find({ ...filter, isDeleted: { $ne: true } });
};

export default mongoose.model("Comment", commentSchema);
