import jwt from "jsonwebtoken"
import LogoutModel from "../../DB/models/logout.model.js"
import UserModel from "../../DB/models/user.model.js"


export default async function tokenAuth(req, res, next) {
    try {
        const { token } = req.headers
        if (!token) {
            return res.status(401).json({ message: 'Invaild User - User TOKEN Not Found' })
        }
        
        const decodeToken = jwt.verify(token, process.env.TOKERN_SIGNATURE)
        if (!decodeToken) {
            return res.status(401).json({ message: 'Invaild Token' })
        }

        // Check If User is Logged-Out
        const checkIsExpiredToken = await LogoutModel.find({token})
        if (checkIsExpiredToken.length) {
            return res.status(401).json({ message: 'Token is Expired' })
        }

        const user = await UserModel.findById(decodeToken.id).select('-password -__v')
        if (!user) {
            return res.status(401).json({ message: 'User Not Found' })
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invaild User TOKEN', error: error.message || error })
    }
}