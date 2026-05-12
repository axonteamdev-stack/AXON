import mongoose from "mongoose";

const { Schema } = mongoose;

const likeSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

likeSchema.index({ user: 1, post: 1 }, { unique: true });
likeSchema.index({ post: 1 });

export default mongoose.models.Like || mongoose.model("Like", likeSchema);
