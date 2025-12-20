import "dotenv/config"
import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    const { connection: conn } = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connect at: ${conn.host}`)
  } catch (err) {
    console.log("DB connection error: ", err)
    process.exit(1)
  }
}