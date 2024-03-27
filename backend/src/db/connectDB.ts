import pg, { Client } from 'pg'

const client = new Client({
    host: process.env.POSTGRESS_DB_HOST,
    user: process.env.POSTGRESS_DB_USER,
    password: process.env.POSTGRESS_DB_PASSWORD,
    database: process.env.POSTGRESS_DB_DATABASE_NAME,
    port: Number(process.env.POSTGRESS_DB_PORT)
})

const connectDB = async () => {
    try {
        await client.connect()
        console.log(`Databse ${client.database} is connected successfully!!!`);

    } catch (error) {
        console.log(`Database connection failed ${error}!!!`);
        process.exit(1)
    }
}

export { connectDB, client }
