import bcryptjs from "bcryptjs"
import UserModel from "../../../DB/models/user.model.js"
import cloud from "../../utils/cloudinary.js"
import { asyncHandler } from "../../utils/errorHandling.js"

export const getUserData = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user._id).populate([{path:"posts"}])
    
    return res.json({ message: "Success", data: user })
})

export const updateUser = asyncHandler(async (req, res, next) => {

    const queryResult = await UserModel.updateOne({ _id: req.user._id }, req.body)
    if (!queryResult.acknowledged || queryResult.modifiedCount < 1) {
        return next(new Error("User Not Found - Nothing to delete", { cause: 404 }))
    }

    return res.status(200).json({ message: "Success", user: { ...req.user._doc, ...req.body } })
})

export const deleteUser = asyncHandler(async (req, res, next) => {

    const queryResult = await UserModel.deleteOne({ _id: req.user._id })
    if (!queryResult.acknowledged || queryResult.deletedCount < 1) {
        return next(new Error("Nothing to delete", { cause: 404 }))
    }

    return res.status(200).json({ message: "Success", user: req.user })
})

export const updatePassword = asyncHandler(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body

    const user = await UserModel.findById(req.user._id)

    const isSamePassword = bcryptjs.compareSync(oldPassword, user.password)
    if (!isSamePassword) {
        return next(new Error("Wrong Old Password", { cause: 401 }))
    }

    user.password = bcryptjs.hashSync(newPassword, parseInt(process.env.SALT_ROUND));
    await user.save()

    return res.status(200).json({ message: "Success - Password is updated successfully" })
})

// SET or UPDATE profile pic
export const setProfilePic = asyncHandler(async (req, res, next) => {

    const { _id } = req.user
    const { file } = req

    if (!file) return next(new Error("Profile Pic Not Found", { cause: 400 }))

    const imageInfo = await cloud().uploader.upload(file.path, { folder: `users/${_id}/images` })
    const { secure_url, public_id } = imageInfo
    await cloud().uploader.destroy(req.user.profilePic.public_id)

    const user = await UserModel.findOneAndUpdate(
        { _id },
        { profilePic: { url: secure_url, public_id } },
        { new: true }
    );

    return res.json({ message: "Success", user, profilePic: imageInfo.url })
})

