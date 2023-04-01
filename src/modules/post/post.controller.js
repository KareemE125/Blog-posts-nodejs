import PostModel from "../../../DB/models/post.model.js";
import cloud from "../../utils/cloudinary.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import CommentModel from "../../../DB/models/comment.model.js";


export const getAllPosts = asyncHandler(async (req, res, next) => {

    const posts = await PostModel.find().populate({ path: 'comments', select: 'createdBy updatedAt text' })

    return res.status(200).json({ message: 'success', posts })
})


export const getMyPosts = asyncHandler(async (req, res, next) => {

    const posts = await PostModel.find({ createdBy: req.user._id }).populate({ path: 'comments', select: 'createdBy updatedAt text' })

    return res.status(200).json({ message: 'success', posts })
})


export const addPost = asyncHandler(async (req, res, next) => {

    const post = await PostModel.create({
        ...req.body,
        createdBy: req.user._id,
    });

    return res.status(201).json({ message: 'success', post })
})

export const toggleLike = asyncHandler(async (req, res, next) => {

    const { postId } = req.params
    const id = req.user._id

    const post = await PostModel.findById(postId)
    if (!post) {
        return next(new Error("Post Not Found", { cause: 404 }))
    }

    if (!post.likes.includes(id)) {
        // element is not in the array, add it
        post.likes.addToSet(id);
    } else {
        // element is in the array, remove it
        post.likes.pull(id);
    }

    await post.save()

    return res.status(201).json({ message: 'success', post })
})

export const addComment = asyncHandler(async (req, res, next) => {

    const { postId } = req.params

    const post = await PostModel.findById(postId)
    if (!post) {
        return next(new Error("Post Not Found", { cause: 404 }))
    }

    const comment = await CommentModel.create({ text: req.body.text, postId, createdBy: req.user._id })

    return res.status(201).json({ message: 'success', comment, post })
})

export const deleteComment = asyncHandler(async (req, res, next) => {

    const { commentId } = req.params

    const comment = await CommentModel.findOneAndDelete({ createdBy: req.user._id, _id: commentId })
    if (!comment) {
        return next(new Error("Comment Not Found -OR- your are not the comment creator", { cause: 404 }))
    }

    return res.status(201).json({ message: 'success', comment })
})

export const updateComment = asyncHandler(async (req, res, next) => {

    const { commentId } = req.params

    const comment = await CommentModel.findOneAndUpdate({ createdBy: req.user._id, _id: commentId }, req.body, { new: true })
    if (!comment) {
        return next(new Error("Comment Not Found -OR- your are not the comment creator", { cause: 404 }))
    }

    return res.status(201).json({ message: 'success', comment })
})


export const searchPosts = asyncHandler(async (req, res, next) => {
    const { searchTerm } = req.query

    const posts = await PostModel.find({ title: { $regex: `.*${searchTerm}.*`, $options: "i" } })

    return res.status(200).json({ message: 'success', posts })
})


export const updatePost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params

    const post = await PostModel.findOneAndUpdate({ _id: postId, createdBy: req.user._id }, req.body, { new: true })
    if (!post) {
        return next(new Error("Post Not Found", { cause: 404 }))
    }

    return res.status(200).json({ message: 'success', post })
})


export const deletePost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params

    const post = await PostModel.findOneAndDelete({ _id: postId, createdBy: req.user._id })
    if (!post) {
        return next(new Error("Post Not Found", { cause: 404 }))
    }

    return res.status(200).json({ message: 'success', post })
})
