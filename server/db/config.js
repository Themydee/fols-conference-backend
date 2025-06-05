import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

export const DB = async() => {
    try {
        const dbconn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MONGODB CONNECTION SUCCESSFUL: ${dbconn.connection.host}`)
    } catch (error) {
        console.error("MONGODB connection unsuccessful", error.message)
        process.exit(1)
    }
}