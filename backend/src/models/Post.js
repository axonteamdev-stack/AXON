import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: [5, "Title must be at least 5 characters"],
            maxlength: [200, "Title must not exceed 200 characters"],
        },
        content: {
            type: String,
            required: true,
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
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
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
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ tags: 1, createdAt: -1 });
postSchema.index({ isDeleted: 1 });

postSchema.pre(/^find/, function () {
    this.find({ isDeleted: { $ne: true } });
});

export default mongoose.model("Post", postSchema);
