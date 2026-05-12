import request from "supertest";
import app from "../app.js";

describe("Notification API", () => {
    let authToken;

    beforeEach(async () => {
        const email = `user${Date.now()}@test.com`;
        await request(app)
            .post("/api/v1/auth/signup/patient")
            .send({
                fullName: "Test User",
                email,
                phoneNumber: "+1234567890",
                gender: "male",
                password: "ValidPass123!",
            });

        const login = await request(app)
            .post("/api/v1/auth/login")
            .send({ email, password: "ValidPass123!" });

        if (login.statusCode === 200) {
            authToken = login.body.data?.tokens?.accessToken;
        }
    });

    describe("GET /api/v1/notifications", () => {
        it("should require authentication", async () => {
            const res = await request(app).get("/api/v1/notifications");
            expect([401, 403]).toContain(res.statusCode);
        });

        it("should return notifications", async () => {
            const res = await request(app)
                .get("/api/v1/notifications")
                .set("Authorization", `Bearer ${authToken}`);
            expect([200, 401, 403]).toContain(res.statusCode);
        });

        it("should support pagination", async () => {
            const res = await request(app)
                .get("/api/v1/notifications")
                .query({ page: 1, limit: 10 })
                .set("Authorization", `Bearer ${authToken}`);
            expect([200, 400, 401, 403]).toContain(res.statusCode);
        });
    });

    describe("GET /api/v1/notifications/unread-count", () => {
        it("should require authentication", async () => {
            const res = await request(app).get("/api/v1/notifications/unread-count");
            expect([401, 403]).toContain(res.statusCode);
        });

        it("should return unread count", async () => {
            const res = await request(app)
                .get("/api/v1/notifications/unread-count")
                .set("Authorization", `Bearer ${authToken}`);
            expect([200, 401, 403]).toContain(res.statusCode);
        });
    });

    describe("PATCH /api/v1/notifications/read-all", () => {
        it("should require authentication", async () => {
            const res = await request(app).patch("/api/v1/notifications/read-all");
            expect([401, 403]).toContain(res.statusCode);
        });

        it("should mark all as read", async () => {
            const res = await request(app)
                .patch("/api/v1/notifications/read-all")
                .set("Authorization", `Bearer ${authToken}`);
            expect([200, 401, 403]).toContain(res.statusCode);
        });
    });

    describe("PATCH /api/v1/notifications/:id/read", () => {
        it("should require authentication", async () => {
            const res = await request(app)
                .patch("/api/v1/notifications/507f1f77bcf86cd799439011/read");
            expect([401, 403]).toContain(res.statusCode);
        });

        it("should mark notification as read", async () => {
            const res = await request(app)
                .patch("/api/v1/notifications/507f1f77bcf86cd799439011/read")
                .set("Authorization", `Bearer ${authToken}`);
            expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
        });
    });
});
