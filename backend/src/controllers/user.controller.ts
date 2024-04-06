import { Request, Response } from "express"
import Apierror from "../utils/apiError"
import { asyncHandler } from "../middlewares/asyncHandler"
import { client } from "../db/connectDB"
import ApiResponse from "../utils/apiResponse"
import { comparepassword, hashPassword } from "../utils/bcryptUtils"
import { z } from "zod"
import { generateAccessToken, generateRefreshToken } from "../utils/tokens"
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
    const { name, age, email, password } = registrationSchema.parse(req.body)
    const existingUser = await client.query(`SELECT * FROM authors WHERE email = $1`, [email])
    if (existingUser.rows.length > 0) {
        console.log(existingUser.rowCount);

        throw new Apierror({ statusCode: 409, message: "User is already registered!", success: false })
    }
    const hashingPassword = await hashPassword(password)
    const newUser = await client.query(`INSERT INTO authors (name,age,email,password) VALUES($1,$2,$3,$4)`, [name, age, email, hashingPassword])
    res.status(201).json(
        new ApiResponse({ message: "User successfully registered", statusCode: 200, success: true, data: newUser.fields })
    )
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})
const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body)
    const existingUser = await client.query(`SELECT * FROM authors WHERE email = $1`, [email])
    if (existingUser.rows.length == 0) {
        console.log(existingUser.rowCount);
        throw new Apierror({ statusCode: 409, message: "User is not registered!", success: false })
    }
    const comparePassword = await comparepassword(password, existingUser.rows[0].password)
    if (!comparePassword) {
        throw new Apierror({
            statusCode: 401,
            success: false,
            message: "Invalid credentials"
        })
    }

    const accessToken = generateAccessToken({
        id: existingUser.rows[0].authorid,
        name: existingUser.rows[0].name,
        email: existingUser.rows[0].email
    }, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIREY)
    const refreshToken = generateRefreshToken({
        id: existingUser.rows[0].authorid
    }, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIREY)

    await client.query(`UPDATE authors SET refresh_token=$1 WHERE authorid=$2`, [refreshToken, existingUser.rows[0].authorid])

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .cookie("checkToken", 'true', {
            maxAge: 24 * 60 * 60 * 1000,
            secure:true
        })
        .json(
            new ApiResponse({
                message: "User successfully logged in",
                statusCode: 200,
                success: true,
                data: { refreshToken, accessToken }
            })
        )
})

interface Extendedrequest extends Request {
    user?: any
}
const logoutUser = asyncHandler(async (req: Extendedrequest, res: Response) => {
    const user = req.user.id
    await client.query(`UPDATE authors SET refresh_token=NULL WHERE authorid=$1`, [user])
    const options = {
        httpOnly: true,
        secure: true
    }
    res.clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
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


