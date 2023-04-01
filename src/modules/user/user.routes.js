import { Router } from 'express'
import tokenAuth from '../../middleware/tokenAuth.js'
import validation from '../../middleware/validation.js'
import * as userController from './user.controller.js'
import { setProfilePicSchema, updatUserSchema, updatePasswordSchema } from './user.validation.js'
import filesUpload from '../../middleware/filesUpload.js'

const router = Router()



router.use(tokenAuth)

router.get('/data', userController.getUserData)
router.put('/update', validation(updatUserSchema), userController.updateUser)
router.delete('/delete', userController.deleteUser)

router.patch('/update-password', validation(updatePasswordSchema), userController.updatePassword)

router.patch(
    '/profile-pic',
    filesUpload({ fieldName: 'image' }),
    validation(setProfilePicSchema),
    userController.setProfilePic
);


export default router