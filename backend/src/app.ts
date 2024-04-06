import express, { Express } from "express";
import cors from "cors";
import cookieparser from "cookie-parser"
const app = express()

// middleawres
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['POST', "GET", "PUT", "DELETE"],
    credentials: true
}))
app.use(cookieparser())
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true }))

import userRouter from "./routes/user.route"
import authRouter from "./routes/auth.route"
import bookRouter from "./routes/book.route"

app.use("/api/v1/users", userRouter)
app.use("/api/v1", authRouter)
app.use("/api/v1/books", bookRouter)
export default app;




