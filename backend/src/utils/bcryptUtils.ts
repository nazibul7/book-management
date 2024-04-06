import bcrypt from "bcrypt"

const hashPassword = async (password: string) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        return hashedPassword
    } catch (error) {
        throw new Error("Error hashing password")
    }
}

const comparepassword = async (password: string, hashedPassword: any) => {
    try {
        const passwordMatch = await bcrypt.compare(password, hashedPassword)
        return passwordMatch
    } catch (error) {
        throw new Error("Error comparing password")
    }
}

export {
    hashPassword,
    comparepassword
}