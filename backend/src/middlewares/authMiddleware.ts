import jwt, { Secret } from "jsonwebtoken"
import { asyncHandler } from "./asyncHandler"
import { NextFunction, Request, Response } from "express"
import Apierror from "../utils/apiError"

interface Extendedrequest extends Request {
    user?: any
}
const verifyJwt = asyncHandler(async (req: Extendedrequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer", " ")
    // console.log(token);
    
    if (!token) {
        throw new Apierror({
            message: "Unauthorized request",
            statusCode: 401,
            success: false
        })
    }
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret)
    if (!decode) {
        throw new Apierror({
            message: "Invalid access tokenn",
            statusCode: 401,
            success: false
        })
    }
    req.user = decode
    next()
})


export { verifyJwt }