import jwt from "jsonwebtoken"

interface Token {
    id: number,
    name?: string,
    email?: string
}
const generateAccessToken = (payload: Token, secret: any, expirey: any) => {
    return jwt.sign(
        payload, secret, { expiresIn: expirey })
}

const generateRefreshToken = (payload: Token, secret: any, expirey: any) => {
    return jwt.sign(
        payload, secret, { expiresIn: expirey }
    )
}

export{
    generateAccessToken,
    generateRefreshToken
}