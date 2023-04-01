import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';


export const multerUploader = (isOnDisk, customPath) => {
    
    if(!isOnDisk) return multer({storage: multer.diskStorage({})})

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const fullPath = path.join(__dirname, '../../uploads', customPath)

    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true })
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, fullPath)
        },
        filename: (req, file, cb) => {
            let date = new Date().toISOString().slice(0, 10)
            cb(null, `(${date}){${uuidv4()}}-${file.originalname}`)
        }
    })

    return multer({ storage })
}
