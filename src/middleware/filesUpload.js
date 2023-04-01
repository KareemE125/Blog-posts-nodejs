import multer from "multer";
import { asyncHandler } from "../utils/errorHandling.js";
import { multerUploader } from "../utils/multerUploader.js";

export default function filesUpload({ fieldName = 'general', isMany = false, isOnDisk = false, customPath = '' } = {}) {
    return asyncHandler((req, res, next) => {

        let uploader;
        if (isMany) uploader = multerUploader(isOnDisk, customPath).array(fieldName);
        else uploader = multerUploader(isOnDisk, customPath).single(fieldName);

        uploader(req, res, (error) => {
            if (error) { next(error) }
            next()
        })
    })
}