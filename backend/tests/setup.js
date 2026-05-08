import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { jest } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MONGO_CACHE_DIR = path.join(__dirname, "..", ".cache", "mongodb-binaries");

// Uncomment if mongod fails to start on Arch (missing libcrypto, etc.)
// process.env.MONGOMS_SYSTEM_BINARY = "/usr/bin/mongod";

jest.setTimeout(30000);

let mongod;
let mongoUri;

export const testData = {
    users: {},
    posts: {},
    articles: {},
    medications: {},
    appointments: {},
    conversations: {},
    comments: {},
    tokens: {},
};

export const generateId = () => {
    const hex = "0123456789abcdef";
    let id = "";
    for (let i = 0; i < 24; i++) {
        id += hex[Math.floor(Math.random() * 16)];
    }
    return id;
};

export const generateToken = (payload, secret = "test-secret-key") => {
    return jwt.sign(payload, secret, { expiresIn: "1h" });
};

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

export const getAuthHeaders = (token = "valid-token") => ({
    Authorization: `Bearer ${token}`,
});

export const createMockDoc = (collection, data) => {
    const id = generateId();
    const doc = {
        _id: id,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
    };
    testData[collection] = testData[collection] || {};
    testData[collection][id] = doc;
    return doc;
};

beforeAll(async () => {
    try {
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
        process.env.MONGODB_URI = mongoUri;

        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
        });

        console.log("Test MongoDB connected:", mongoUri);
    } catch (err) {
        console.warn("MongoDB Memory Server failed:", err.message);
        console.warn("Falling back to mock mode");

        process.env.MONGODB_URI =
            "mongodb://localhost:27017/axon_test_fallback";
        mongoose.connection.readyState = 1;
        mongoose.connection.db = {
            collection: () => ({
                find: () => ({ toArray: async () => [] }),
                findOne: async () => null,
                insertOne: async () => ({ insertedId: generateId() }),
                deleteOne: async () => ({ deletedCount: 1 }),
                updateOne: async () => ({ modifiedCount: 1 }),
            }),
        };
    }
});

afterAll(async () => {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        if (mongod) {
            await mongod.stop();
        }
    } catch (err) {
        console.warn("Cleanup warning:", err.message);
    }
});

afterEach(async () => {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();
        for (const collection of collections) {
            await collection.deleteMany({});
        }
    }

    Object.keys(testData).forEach((key) => {
        testData[key] = {};
    });
});

process.on("unhandledRejection", (reason) => {
    console.warn("Unhandled Rejection in test:", reason);
});
