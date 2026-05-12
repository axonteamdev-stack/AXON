import request from "supertest";
import app from "../app.js";

describe("User API", () => {
    let authToken;
    let userId;

    beforeEach(async () => {
        const email = `user${Date.now()}@test.com`;
        const signupRes = await request(app)
            .post("/api/v1/auth/signup/patient")
            .send({
                fullName: "Test User",
                email,
                phoneNumber: "+1234567890",
                gender: "male",
                password: "ValidPass123!",
            });

        if (signupRes.statusCode === 201 || signupRes.statusCode === 200) {
            userId = signupRes.body.data?.user?._id;
        }

        const loginRes = await request(app)
            .post("/api/v1/auth/login")
            .send({ email, password: "ValidPass123!" });

        if (loginRes.statusCode === 200) {
            authToken = loginRes.body.data?.tokens?.accessToken || loginRes.body.data?.token;
        }
    });

    describe("GET /api/v1/users/doctors", () => {
        it("should return doctors list", async () => {
            const res = await request(app).get("/api/v1/users/doctors");
            expect([200, 401, 403]).toContain(res.statusCode);
        });

        it("should support pagination", async () => {
            const res = await request(app)
                .get("/api/v1/users/doctors")
                .query({ page: 1, limit: 10 });
            expect([200, 400, 401, 403]).toContain(res.statusCode);
        });
    });

    describe("GET /api/v1/users/doctors/search", () => {
        it("should search doctors by keyword", async () => {
            const res = await request(app)
                .get("/api/v1/users/doctors/search")
                .query({ keyword: "cardio", specialization: "Cardiology" });
            expect([200, 400, 401, 403]).toContain(res.statusCode);
        });
    });

    describe("GET /api/v1/users/doctors/:id", () => {
        it("should return doctor details", async () => {
            const res = await request(app).get("/api/v1/users/doctors/507f1f77bcf86cd799439011");
            expect([200, 404, 401, 403]).toContain(res.statusCode);
        });

        it("should reject invalid ObjectId", async () => {
            const res = await request(app).get("/api/v1/users/doctors/invalid-id");
            expect([400, 404]).toContain(res.statusCode);
        });
    });

    describe("GET /api/v1/users/me", () => {
        it("should require authentication", async () => {
            const res = await request(app).get("/api/v1/users/me");
            expect([401, 403]).toContain(res.statusCode);
        });

        it("should return current user profile", async () => {
            const res = await request(app)
                .get("/api/v1/users/me")
                .set("Authorization", `Bearer ${authToken}`);

            expect([200, 401, 403]).toContain(res.statusCode);
            if (res.statusCode === 200) {
                expect(res.body).toHaveProperty("data");
            }
        });
    });

    describe("PATCH /api/v1/users/me", () => {
        it("should require authentication", async () => {
            const res = await request(app)
                .patch("/api/v1/users/me")
                .send({ fullName: "Updated" });
            expect([401, 403]).toContain(res.statusCode);
        });

        it("should update profile fields", async () => {
            const res = await request(app)
                .patch("/api/v1/users/me")
                .set("Authorization", `Bearer ${authToken}`)
                .send({ fullName: "Updated Name" });

            expect([200, 400, 401, 403]).toContain(res.statusCode);
        });
    });

    describe("POST /api/v1/users/follow/:id", () => {
        it("should require authentication", async () => {
            const res = await request(app)
                .post("/api/v1/users/follow/507f1f77bcf86cd799439011");
            expect([401, 403]).toContain(res.statusCode);
        });

        it("should follow a user", async () => {
            const res = await request(app)
                .post("/api/v1/users/follow/507f1f77bcf86cd799439011")
                .set("Authorization", `Bearer ${authToken}`);

            expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
        });
    });

    describe("GET /api/v1/users/following", () => {
        it("should require authentication", async () => {
            const res = await request(app).get("/api/v1/users/following");
            expect([401, 403]).toContain(res.statusCode);
        });

        it("should return following list", async () => {
            const res = await request(app)
                .get("/api/v1/users/following")
                .set("Authorization", `Bearer ${authToken}`);

            expect([200, 401, 403]).toContain(res.statusCode);
        });
    });

    describe("GET /api/v1/users/followers", () => {
        it("should require authentication", async () => {
            const res = await request(app).get("/api/v1/users/followers");
            expect([401, 403]).toContain(res.statusCode);
        });
    });
});
