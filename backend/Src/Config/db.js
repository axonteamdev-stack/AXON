    import mongoose from "mongoose";
    import dotenv from "dotenv";

    dotenv.config();

const connectDB = async () => {
  try {
    console.log("Attempting to connect with URI:", process.env.MONGO_URI); // ADD THIS
    
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is undefined. Check your .env file!");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

    export default connectDB;
