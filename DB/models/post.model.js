import mongoose, { model, Schema, Types } from "mongoose";

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        createdBy: {
            type: Types.ObjectId,
            ref: 'User',
            required: true
        },
        privacy: {
            type: String,
            default: 'Public',
            enum: ['Public', 'OnlyMe']
        },
        likes: [Types.ObjectId]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    }
)

postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'postId'
});

const PostModel = mongoose.model.Post || model('Post', postSchema)
export default PostModel