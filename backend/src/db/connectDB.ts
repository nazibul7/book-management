import { PrismaClient } from "@prisma/client";

export const prisma=new PrismaClient()
const connectDB = async () => {
    try {
        await prisma.$connect()
        console.log(`Databse is connected successfully!!!`);

    } catch (error) {
        console.log(`Database connection failed ${error}!!!`);
        process.exit(1)
    }
}

export { connectDB }
