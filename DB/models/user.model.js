import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        isEmailVerified: {
            type: Boolean,
            required: true,
            default: false,
        },
        phone: {
            type: Number,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        profilePic: {
            type: Object
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false,
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    }
)

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'createdBy'
});

const UserModel = mongoose.model.User || model('User', userSchema)
export default UserModel