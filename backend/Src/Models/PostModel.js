import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    // --- Core Post ---
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
      // index: true, <-- Removed: Redundant because author is the prefix of the compound index below
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [1, "Content cannot be empty"],
      maxlength: [5000, "Content must not exceed 5000 characters"],
    },

    // --- Images ---
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 10;
        },
        message: "Cannot upload more than 10 images",
      },
    },

    // --- Likes ---
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    // --- Tags ---
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 10;
        },
        message: "Cannot add more than 10 tags",
      },
    },

    // --- Metadata ---
    visibility: {
      type: String,
      enum: {
        values: ["public", "followers", "private"],
        message: "Visibility must be public, followers, or private",
      },
      default: "public",
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// --- Indexes ---
// This index handles queries for (author) AND (author + createdAt)
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ visibility: 1, createdAt: -1 });
postSchema.index({ isDeleted: 1 });

// --- Virtuals ---
postSchema.virtual("likeCount").get(function () {
  return this.likes?.length || 0;
});

postSchema.virtual("commentCount").get(function () {
  return this._commentCount || 0;
});

// --- Pre-save Hook ---
postSchema.pre("save", function () {
  if (this.isModified("content") && !this.isNew) {
    this.editedAt = new Date();
  }

});

// --- Query Hook ---
postSchema.pre(/^find/, function () {
  this.find({ isDeleted: { $ne: true } });

});

export default mongoose.model("Post", postSchema);
