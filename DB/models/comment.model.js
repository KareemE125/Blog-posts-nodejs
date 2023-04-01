import mongoose, { model, Schema, Types } from "mongoose";

const commentSchema = new Schema(
    {
        text: {
            type: String,
            required: true
        },
        createdBy: {
            type: Types.ObjectId,
            ref: 'User',
            required: true
        },
        postId: {
            type: Types.ObjectId,
            ref: 'Post',
            required: true
        },
    },
    { timestamps: true }
)

const CommentModel = mongoose.model.Comment || model('Comment', commentSchema)
export default CommentModel