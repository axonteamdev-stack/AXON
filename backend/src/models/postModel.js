import mongoose from "mongoose";

const { Schema } = mongoose;

// ─── Inline constants (previously in Constants/roles.js) ───────────
const VISIBILITY = Object.freeze({
  PUBLIC: "public",
  FOLLOWERS: "followers",
  PRIVATE: "private",
});

const MAX_IMAGES = 10;
const MAX_TAGS = 10;
const MAX_CONTENT_LENGTH = 5000;

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true,
    minlength: [1, "Content cannot be empty"],
    maxlength: [MAX_CONTENT_LENGTH, `Content must not exceed ${MAX_CONTENT_LENGTH} characters`],
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: (v) => v.length <= MAX_IMAGES,
      message: `Cannot upload more than ${MAX_IMAGES} images`,
    },
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "User",
    default: [],
  }],
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: (v) => v.length <= MAX_TAGS,
      message: `Cannot add more than ${MAX_TAGS} tags`,
    },
  },
  visibility: {
    type: String,
    enum: {
      values: Object.values(VISIBILITY),
      message: "Visibility must be public, followers, or private",
    },
    default: VISIBILITY.PUBLIC,
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "published",
  },
  views: {
    type: Number,
    default: 0,
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

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1, visibility: 1, createdAt: -1 });
postSchema.index({ visibility: 1, createdAt: -1 });
postSchema.index({ isDeleted: 1 });

postSchema.virtual("likeCount").get(function () {
  return this.likes?.length || 0;
});

postSchema.virtual("commentCount").get(function () {
  return this._commentCount || 0;
});

postSchema.pre("save", function (next) {
  if (this.isModified("content") && !this.isNew) {
    this.editedAt = new Date();
  }
  next();
});

// Explicit soft-delete filter
postSchema.statics.findActive = function (filter = {}) {
  return this.find({ ...filter, isDeleted: { $ne: true } });
};

export default mongoose.model("Post", postSchema);
