import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).{8,}$/;

export const updatUserSchema = joi.object({
    name: joi.string(),
    email: joi.string().email(),
    phone: joi.string().min(11).max(11),
})

export const updatePasswordSchema = joi.object({
    oldPassword: joi.string().pattern(new RegExp(passwordPattern)).required(),
    newPassword: joi.string().invalid(joi.ref('oldPassword')).pattern(new RegExp(passwordPattern)).required(),
    cNewPassword: joi.string().valid(joi.ref('newPassword')).required()
})

export const setProfilePicSchema = joi.object({
    files: generalFields.file
}).required()
