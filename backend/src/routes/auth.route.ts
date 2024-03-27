import express, { Request, Response } from "express"
import { verifyJwt } from "../middlewares/authMiddleware"

interface User extends Request {
    user?: any
}

const route = express.Router()

route.get('/validate-token', verifyJwt, (req: User, res: Response) => {
    const username = req.user.name
    res.status(200).send({ name: username })
})

export default route
