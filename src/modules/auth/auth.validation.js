import joi from "joi";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).{8,}$/;

export const signupSchema = joi.object({
    name: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    phone: joi.string().min(11).max(11).required(),
    password: joi.string().pattern(new RegExp(passwordPattern)).required(),
    cPassword: joi.string().valid(joi.ref('password')).required()
}).required()

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp(passwordPattern)).required(),
}).required()


export const forgetPasswordSchema = joi.object({
    email: joi.string().email().required(),
}).required()


export const resetPasswordSchema = joi.object({
    newPassword: joi.string().pattern(new RegExp(passwordPattern)).required(),
    cNewPassword: joi.string().valid(joi.ref('newPassword')).required(),
    token: joi.string().required()
}).required()

