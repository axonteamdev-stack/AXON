import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  let retries = 5;

  const attemptConnection = async () => {
    try {
      console.log("Attempting MongoDB connection...");

      if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is undefined. Check your .env file!");
      }

      const conn = await mongoose.connect(process.env.MONGO_URI, {
        // Connection pooling and resilience settings
        retryWrites: true,
        w: "majority",
        maxPoolSize: 10,
        minPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

      // Handle disconnection events
      mongoose.connection.on("disconnected", () => {
        console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
      });

      return conn;
    } catch (error) {
      console.error(`❌ Connection attempt failed: ${error.message}`);

      if (retries > 0) {
        retries--;
        console.log(`Retrying in 5 seconds... (${retries} attempts remaining)`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return attemptConnection();
      } else {
        console.error("❌ MongoDB connection failed after multiple attempts");
        process.exit(1);
      }
    }
  };

  return attemptConnection();
};

export default connectDB;
