import joi from 'joi'
import { Types } from 'mongoose'



const validateObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message('In-valid objectId')
}

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).{8,}$/;

export const generalFields = {

    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net',] }
    }).required(),
    password: joi.string().pattern(new RegExp(passwordPattern)).required(),
    cPassword: joi.string().required(),
    id: joi.string().custom(validateObjectId),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()

    }).required()
}

export default function vlidation(schema) {
    return (req, res, next) => {

        let dataFields = { ...req.body, ...req.params, ...req.query }
        if (req.file || req.files) {
            dataFields.files = req.file || req.files
        }
        

        const validationErrors = schema.validate(dataFields, {abortEarly: false})

        if (validationErrors.error) {
            return res.status(400).json({ message: 'Validation Errors', errors: validationErrors.error })
        }

        return next()
    }
}