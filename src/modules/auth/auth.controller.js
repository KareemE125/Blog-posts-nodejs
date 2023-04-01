import UserModel from "../../../DB/models/user.model.js"
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"
import LogoutModel from "../../../DB/models/logout.model.js"
import { sendEmail } from "../../utils/emailing.js"


async function sendEmailVerification(email, req) {

    const token = jwt.sign({ email }, process.env.TOKERN_SIGNATURE, { expiresIn: 60 * 5 })
    const verifyLink = `${req.protocol}://${req.headers.host}/api/v1/auth/verify-email/${token}`

    const refreshToken = jwt.sign({ email }, process.env.TOKERN_SIGNATURE, { expiresIn: 60 * 60 * 24 * 60 })
    const newVerifyLink = `${req.protocol}://${req.headers.host}/api/v1/auth/new-verify-email/${refreshToken}`

    const htmlBody = `<p>
    You registered an account on Library Systems, before being able to use your account <br/>
    you need to verify that this is your email address by clicking here: <a href=${verifyLink}>verify your email</a> <br/>
    If the verification link expired, generate new one by clicking here: <a href=${newVerifyLink}>new verification email</a>
    <br/><br/>
    Kind Regards,<br/>
    Library Systems
    </p>`;

    return await sendEmail({ to: email, subject: "Email Confirmation", html: htmlBody })
}

export async function signup(req, res, next) {
    try {
        let { name, email, phone, password, cPassword } = req.body
        email = email.toLowerCase()

        if (password !== cPassword) {
            return res.status(400).json({ message: "Password and Confirm-Password Missmatch" })
        }

        const checkEmail = await UserModel.findOne({ email })
        if (checkEmail) {
            return res.status(409).json({ message: "Email already exists" })
        }

        const hashPassword = bcryptjs.hashSync(password, parseInt(process.env.SALT_ROUND));
        const userData = { name, email, phone, password: hashPassword }

        const user = await UserModel.create(userData)
        user.password = undefined


        const isSent = await sendEmailVerification(email, req);

        if (!isSent) {
            return res.status(500).json({ message: "Failed to send confirmation email", error, stack: error.stack })
        }

        return res.json({ message: "Success", user })
    } catch (error) {
        return res.status(500).json({ message: "Registration Failed", error, stack: error.stack })
    }
}


export async function login(req, res, next) {
    try {
        let { email, password } = req.body
        email = email.toLowerCase()

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "Email not found" })
        }

        if (!user.isEmailVerified) {
            return res.status(401).json({ message: "Email is not verified" })
        }

        const isMatch = bcryptjs.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Wrong Password" })
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            process.env.TOKERN_SIGNATURE,
            { expiresIn: 60 * 60 * 24 }
        )

        return res.status(200).json({ message: "Success", token })
    } catch (error) {
        return res.status(500).json({ message: "Login Failed", error, stack: error.stack })
    }
}

export async function logout(req, res, next) {
    try {
        const { token } = req.headers
        const decodedToken = jwt.verify(token, process.env.TOKERN_SIGNATURE)
        await LogoutModel.create({ token, exp: decodedToken.exp })

        return res.status(200).json({ message: "Logout Success" })
    } catch (error) {
        return res.status(500).json({ message: "Logout Failed", error, stack: error.stack })
    }
}

// Email Verification
export async function verifyEmail(req, res, next) {
    try {
        const { token } = req.params
        const decodeToken = jwt.verify(token, process.env.TOKERN_SIGNATURE)
        const result = await UserModel.updateOne({ email: decodeToken.email }, { isEmailVerified: true })

        return result.modifiedCount < 1
            ? res.status(404).json({ message: "Email Not Found" })
            : res.status(200).send(`<body style="background: black">
                <h1 style="text-align: center; margin-top: 50px; color: green">Email is Verified Successfully</h1>
            </body>`)

    } catch (error) {
        return res.status(500).json({ message: "Verification Failed", error, stack: error.stack })
    }
}

export async function newVerifyEmail(req, res, next) {
    try {
        const { token } = req.params
        const decodeToken = jwt.verify(token, process.env.TOKERN_SIGNATURE)

        const isSent = await sendEmailVerification(decodeToken.email, req);

        if (!isSent) {
            return res.status(500).json({ message: "Failed to send verification email", error, stack: error.stack })
        }

        return res.status(200).send(`<body style="background: black">
        <h1 style="text-align: center; margin-top: 50px; color: green">New Verification Email is Sent Successfully</h1>
    </body>`)

    } catch (error) {
        return res.status(500).json({ message: "Failed to send verification email", error, stack: error.stack })
    }
}

// Forget Password
export const forgetPassword = async (req, res, next) => {

    try {
        const { email } = req.body

        const isFound = await UserModel.findOne({ email })
        if (!isFound) {
            return res.json({ message: "Email is Not Registered" })
        }

        const token = jwt.sign({ email }, process.env.TOKERN_SIGNATURE, { expiresIn: 60 * 10 })
        const resetLink = `${req.protocol}://${req.headers.host}/api/v1/auth/reset-password/${token}`
        const htmlBody = `<p>
            Trouble signing in?<br/>
            Resetting your password is easy.<br/><br/>
            Just press the following link: <a href=${resetLink}>Reset Password</a> <br/><br/>
            If you did not make this request then please ignore this email. <br/><br/>
            Kind Regards,<br/>
            Library Systems
        </p>`;

        const isSent = await sendEmail({ to: email, subject: "Resetting Password", html: htmlBody })
        if (!isSent) {
            return res.json({ message: "Failed to send Resetting Password email", error, stack: error.stack })
        }

        return res.status(200).json({ message: "Resetting Password Email is Sent Successfully" })

    } catch (error) {
        return res.status(500).json({ message: "Resetting Password Failed", error, stack: error.stack })
    }

}

export const resetPasswordPage = (req, res, next) => {

    try {
        const htmlPath = "D:/Kareem/Full-Stack/Route/NodeJs/week(9)/libarary-backend/src/utils/html/resetPass.html";
        res.sendFile(htmlPath)
    } catch (error) {
        return res.json({ message: error.message || error, error, stack: error.stack })
    }

}

export const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body

        const decodedToken = jwt.verify(token, process.env.TOKERN_SIGNATURE)
        const hashedPassword = bcryptjs.hashSync(newPassword, parseInt(process.env.SALT_ROUND));

        const result = await UserModel.updateOne({ email: decodedToken.email }, { password: hashedPassword })


        return result.modifiedCount < 1
            ? res.status(404).json({ message: "Email Not Found" })
            : res.status(200).send(`<body style="background: black">
                <h1 style="text-align: center; margin-top: 50px; color: green">Password is Resetted Successfully</h1>
            </body>`)
            
    } catch (error) {
        return res.status(400).json({ message: error.message || error, error, stack: error.stack })
    }
}
