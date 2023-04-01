import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addPostSchema = joi.object({
    title: joi.string().min(3).required(),
    text: joi.string().min(3).required(),
    createdBy: generalFields.id.required()
}).required()

export const toggleLikeSchema = joi.object({
    postId: generalFields.id.required()
}).required()

export const addCommentSchema = joi.object({
    text: joi.string().required(),
    postId: generalFields.id.required()
}).required()

export const searchPostsSchema = joi.object({
    searchTerm: joi.string().required()
}).required()

export const updatePostSchema = joi.object({
    title: joi.string().min(3),
    text: joi.string().min(3),
    postId: generalFields.id,
    privacy: joi.string().valid('Public', 'OnlyMe')
})

export const deleteCommentSchema = joi.object({
    commentId: generalFields.id.required()
}).required()

export const updateCommentSchema = joi.object({
    commentId: generalFields.id.required(),
    text: joi.string().required(),
}).required()