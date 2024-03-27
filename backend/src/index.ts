import "dotenv/config"
import app from "./app"
import { connectDB } from "./db/connectDB"

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running at port ${process.env.PORT}`);
        })
    })
    .catch(() => {
        console.log(`DB connection failed !!!`);
    })