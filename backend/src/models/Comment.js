import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema(
    {
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            minlength: [1, "Content cannot be empty"],
            maxlength: [2000, "Content must not exceed 2000 characters"],
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

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });
commentSchema.index({ isDeleted: 1 });

commentSchema.pre(/^find/, function () {
    this.find({ isDeleted: { $ne: true } });
});

export default mongoose.models.Comment || mongoose.model("Comment", commentSchema);
