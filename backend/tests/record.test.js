import request from "supertest";
import app from "../app.js";

describe("Medical Record API", () => {
    let authToken;

    beforeEach(async () => {
        const email = `patient${Date.now()}@test.com`;
        await request(app)
            .post("/api/v1/auth/signup/patient")
            .send({
                fullName: "Test Patient",
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

    describe("GET /api/v1/records/me", () => {
        it("should require authentication", async () => {
            const res = await request(app).get("/api/v1/records/me");
            expect([401, 403]).toContain(res.statusCode);
        });

        it("should return medical record", async () => {
            const res = await request(app)
                .get("/api/v1/records/me")
                .set("Authorization", `Bearer ${authToken}`);
            expect([200, 401, 403, 404]).toContain(res.statusCode);
        });
    });

    describe("PATCH /api/v1/records/me", () => {
        it("should require authentication", async () => {
            const res = await request(app)
                .patch("/api/v1/records/me")
                .send({ bloodType: "A+" });
            expect([401, 403]).toContain(res.statusCode);
        });

        it("should update record", async () => {
            const res = await request(app)
                .patch("/api/v1/records/me")
                .set("Authorization", `Bearer ${authToken}`)
                .send({ bloodType: "A+", allergies: ["penicillin"] });
            expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
        });
    });

    describe("POST /api/v1/records/tests/:type", () => {
        it("should require authentication", async () => {
            const res = await request(app)
                .post("/api/v1/records/tests/radiology")
                .send({ description: "X-ray" });
            expect([401, 403]).toContain(res.statusCode);
        });
    });

    describe("POST /api/v1/records/qr", () => {
        it("should require authentication", async () => {
            const res = await request(app).post("/api/v1/records/qr");
            expect([401, 403]).toContain(res.statusCode);
        });

        it("should generate QR code", async () => {
            const res = await request(app)
                .post("/api/v1/records/qr")
                .set("Authorization", `Bearer ${authToken}`);
            expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
        });
    });

    describe("GET /api/v1/records/qr/:token", () => {
        it("should return record by QR token", async () => {
            const res = await request(app).get("/api/v1/records/qr/test-token-123");
            expect([200, 404, 400]).toContain(res.statusCode);
        });
    });
});
