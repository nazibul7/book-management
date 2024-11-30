import { Request, Response } from "express"
import Apierror from "../utils/apiError"
import { asyncHandler } from "../middlewares/asyncHandler"
import { prisma } from "../db/connectDB"
import ApiResponse from "../utils/apiResponse"
import { comparepassword, hashPassword } from "../utils/bcryptUtils"
import { z } from "zod"
import { generateAccessToken } from "../utils/tokens"
const registrationSchema = z.object({
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string"
    }).max(25, { message: "Must be 25 or fewer characters long" }),
    age: z.number({
        required_error: "Age is required",
        invalid_type_error: "Age must be a number"
    }),
    email: z.string({
        required_error: "Email is required"
    }).email({ message: "Invalid email address" }),
    password: z.string().min(6)
})

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { name, age, email, password } = registrationSchema.parse(req.body)
        const existingUser = await prisma.user.findFirst({
            where: { email: email }
        })
        if (existingUser) {
            throw new Apierror({ statusCode: 409, message: "User is already registered!", success: false })
        }
        const hashingPassword = await hashPassword(password)
        const accesstoken = generateAccessToken({
            name: name,
            email: email
        }, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIREY)
        const newUser = await prisma.user.create({
            data: {
                name, age, email, password: hashingPassword,accesstoken
            }
        })
        const { password: pass, ...user } = newUser
        
        res.status(201).json(
            new ApiResponse({ message: "User successfully registered", statusCode: 200, success: true, data: [user, accesstoken] })
        )
    } catch (error) {
        return new Apierror({ message: "Something went wrong", statusCode: 500, success: false })
    }
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})
const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body)
    const existingUser = await prisma.user.findFirst({
        where: { email }
    })
    if (!existingUser) {
        throw new Apierror({ statusCode: 409, message: "User is not registered!", success: false })
    }
    const comparePassword = await comparepassword(password, existingUser.password)
    if (!comparePassword) {
        throw new Apierror({
            statusCode: 401,
            success: false,
            message: "Invalid credentials"
        })
    }

    const accessToken = generateAccessToken({
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email
    }, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIREY)

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("checkToken", 'true', {
            maxAge: 24 * 60 * 60 * 1000,
            secure: true
        })
        .json(
            new ApiResponse({
                message: "User successfully logged in",
                statusCode: 200,
                success: true,
                data: { accessToken }
            })
        )
})

interface Extendedrequest extends Request {
    user?: any
}
const logoutUser = asyncHandler(async (req: Extendedrequest, res: Response) => {
    const userId = req.user.id
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            accesstoken: ''
        }
    })
    const options = {
        httpOnly: true,
        secure: true
    }
    res.clearCookie("accessToken", options)
        .clearCookie("checkToken", { secure: true })
        .status(200)
        .json(
            new ApiResponse({
                message: "User successfully logout",
                statusCode: 200,
                success: true
            })
        )
})
export {
    registerUser,
    loginUser,
    logoutUser
}


