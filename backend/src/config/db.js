import mongoose from "mongoose";
import { logger } from "./logger.js";

const maxRetries = Number(process.env.DB_MAX_RETRIES) || 5;
const retryDelay = Number(process.env.DB_RETRY_DELAY_MS) || 5000;
const connectTimeout = Number(process.env.DB_CONNECT_TIMEOUT_MS) || 10000;
const maxPoolSize = Number(process.env.DB_MAX_POOL_SIZE) || 50;
const minPoolSize = Number(process.env.DB_MIN_POOL_SIZE) || 10;

mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected. Will reconnect automatically.");
});

mongoose.connection.on("error", (err) => {
    logger.error({ err: err.message }, "MongoDB connection error");
});

export default async function connectDB() {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is undefined");

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const conn = await mongoose.connect(uri, {
                retryWrites: true,
                w: "majority",
                maxPoolSize,
                minPoolSize,
                serverSelectionTimeoutMS: connectTimeout,
            });
            logger.info(`MongoDB Connected: ${conn.connection.host}`);
            return conn;
        } catch (error) {
            logger.error(`Attempt ${attempt} failed: ${error.message}`);
            if (attempt === maxRetries) {
                throw new Error(
                    `MongoDB connection failed after ${maxRetries} attempts`,
                );
            }
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
    }
}