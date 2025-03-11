import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        author: {
            type: String,
            default: 'Anonymous'
        },
        photo: {
            type: String
        },
        likeCount: {
            type: Number,
            default: 0
        },
        likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    },
    { timestamps: true }
);

export default mongoose.model("Post", postSchema)