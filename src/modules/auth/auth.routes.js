import { Router } from 'express'
import tokenAuth from '../../middleware/tokenAuth.js'
import vlidation from '../../middleware/validation.js'
import * as authController from './auth.controller.js'
import { forgetPasswordSchema, loginSchema, resetPasswordSchema, signupSchema } from './auth.validation.js'


const router = Router()

router.post('/signup', vlidation(signupSchema), authController.signup)
router.post('/login', vlidation(loginSchema), authController.login)
router.post('/logout', tokenAuth, authController.logout)

router.get('/verify-email/:token', authController.verifyEmail)
router.get('/new-verify-email/:token', authController.newVerifyEmail)

router.post('/forget-password', vlidation(forgetPasswordSchema), authController.forgetPassword)
router.get('/reset-password/:token', authController.resetPasswordPage)
router.post('/reset-password', vlidation(resetPasswordSchema), authController.resetPassword)


export default router