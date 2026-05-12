import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const MONGO_CACHE_DIR = "./.cache/mongodb-binaries";

let mongod;
let mongoUri;

// This object holds state during a single test suite
export const testData = {
    users: {},
    posts: {},
    medications: {},
    appointments: {},
    records: {},
    tokens: {},
};

// HELPER: Generate a valid MongoDB ObjectId string
export const generateId = () => {
    const hex = "0123456789abcdef";
    let id = "";
    for (let i = 0; i < 24; i++) {
        id += hex[Math.floor(Math.random() * 16)];
    }
    return id;
};

// HELPER: Generate a JWT (Uses the same secret as the server)
export const generateToken = (payload, secret = "test-secret-key") => {
    return jwt.sign(payload, secret, { expiresIn: "1h" });
};

// HELPER: Create a user object (Useful for seeding DB)
export const createMockUser = async (overrides = {}) => {
    const defaultUser = {
        _id: generateId(),
        email: `user${Date.now()}@test.com`,
        password: await bcrypt.hash("ValidPassword123!", 10),
        fullName: "Test User",
        role: "patient",
        status: "active",
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return { ...defaultUser, ...overrides };
};

beforeAll(async () => {
    try {
        // 1. Start In-Memory MongoDB
        mongod = await MongoMemoryServer.create({
            instance: {
                dbName: "axon_test",
                port: 27017 + Math.floor(Math.random() * 1000),
            },
            binary: {
                version: "7.0.14",
                downloadDir: MONGO_CACHE_DIR,
            },
            skipMD5: true,
        });

        mongoUri = mongod.getUri();

        // 2. Set Environment Variables (This fixes the 401/Unauthorized errors)
        process.env.MONGODB_URI = mongoUri;
        process.env.JWT_SECRET = "test-secret-key";
        process.env.NODE_ENV = "test";

        // 3. Connect Mongoose
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }

        await mongoose.connect(mongoUri);

        // Expose for teardown
        global.__MONGOD__ = mongod;
        global.__MONGOOSE_CONN__ = mongoose.connection;
    } catch (err) {
        console.error("MongoDB Setup Error:", err);
        throw err;
    }
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    if (mongod) {
        await mongod.stop();
    }
});

// Clears the database between tests so they don't interfere with each other
afterEach(async () => {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();
        for (const collection of collections) {
            await collection.deleteMany({});
        }
    }
    // Clear the local testData helper
    Object.keys(testData).forEach((key) => {
        testData[key] = {};
    });
});
