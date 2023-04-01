import LogoutModel from "../../DB/models/logout.model.js"
import { asyncHandler } from "./errorHandling.js"

export const cleanLoggedOutTokens = asyncHandler(() => {
    setInterval(async () => {
        const DateNow = parseInt(new Date().getTime() / 1000)

        await LogoutModel.deleteMany({ exp: { $lte: DateNow } })

    }, 1000 * 60 * 5)
})