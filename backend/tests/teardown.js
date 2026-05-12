import mongoose from "mongoose";

export default async function globalTeardown() {
    // Close mongoose connection if open
    if (global.__MONGOOSE_CONN__) {
        await global.__MONGOOSE_CONN__.close();
    }
    // Stop MongoMemoryServer if running
    if (global.__MONGOD__) {
        await global.__MONGOD__.stop();
    }
    console.log("Global Teardown complete.");
}