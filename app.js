import dotenv from 'dotenv'
import express from 'express'
import connectDB from './DB/connection.js'
import authRouter from './src/modules/auth/auth.routes.js'
import userRouter from './src/modules/user/user.routes.js'
import postRouter from './src/modules/post/post.routes.js'
import cors from 'cors'
import { cleanLoggedOutTokens } from './src/utils/cleanLogoutDB.js'
import { GlobalErrorHandling } from './src/utils/errorHandling.js'


dotenv.config()
const app = express()
const port = process.env.PORT
const BASE_URL = process.env.BASE_URL


// Global Middlewares
app.use(cors())
app.use(express.json())
app.use(`${BASE_URL}/uploads`, express.static('./uploads'))

// Routing
app.use(`${BASE_URL}/auth`, authRouter)
app.use(`${BASE_URL}/users`, userRouter)
app.use(`${BASE_URL}/posts`, postRouter)

// all() does NOT support nested routing as use()
app.all('*', (req, res, next) => res.json({ message: '404 Page Not Found' }))

// Global Error Handling
app.use(GlobalErrorHandling)

// Init Functions
connectDB()
cleanLoggedOutTokens()

// Server Boot
app.listen(port, () => console.log(`Server Booting...\nServer Listening on PORT::${port}!`))
