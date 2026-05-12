import request from "supertest";
import app from "../app.js";

describe("Health & Root Endpoints", () => {
    describe("GET /", () => {
        it("should return welcome message", async () => {
            const res = await request(app).get("/");
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("success");
            expect(res.body.message).toContain("AXON");
        });
    });

    describe("GET /health", () => {
        it("should return health status", async () => {
            const res = await request(app).get("/health");
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toMatch(/ok|degraded/);
            expect(res.body).toHaveProperty("timestamp");
            expect(res.body).toHaveProperty("uptime");
            expect(res.body).toHaveProperty("services");
            expect(res.body.services).toHaveProperty("database");
        });

        it("should include database status", async () => {
            const res = await request(app).get("/health");
            expect(res.body.services.database).toMatch(/connected|disconnected|error/);
        });
    });

    describe("404 Handling", () => {
        it("should return 404 for unknown routes", async () => {
            const res = await request(app).get("/api/v1/nonexistent");
            expect(res.statusCode).toBe(404);
        });
    });
});
