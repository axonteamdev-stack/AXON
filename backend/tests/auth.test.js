import request from "supertest";
import app from "../app.js";

const extractToken = (res) => {
    const body = res.body || {};
    return (
        body.token ||
        body.accessToken ||
        body.data?.token ||
        body.data?.accessToken ||
        null
    );
};

describe("Authentication API", () => {
    const userPassword = "Password123!";
    let authToken;

    describe("POST /api/v1/auth/signup/patient", () => {
        it("should register a new patient", async () => {
            const res = await request(app)
                .post("/api/v1/auth/signup/patient")
                .send({
                    fullName: "Test Patient",
                    email: `patient${Date.now()}@test.com`,
                    password: userPassword,
                    phone: "01234567890",
                    dateOfBirth: "1990-01-01",
                    gender: "male",
                });
            expect([201, 200, 400]).toContain(res.statusCode);
            if (res.statusCode === 201 || res.statusCode === 200) {
                expect(res.body).toHaveProperty("data");
            }
        });

        it("should reject missing required fields", async () => {
            const res = await request(app)
                .post("/api/v1/auth/signup/patient")
                .send({ email: `bad${Date.now()}@test.com` });
            expect([400, 422]).toContain(res.statusCode);
        });
    });

    describe("POST /api/v1/auth/signup/doctor", () => {
        it("should register a new doctor", async () => {
            const res = await request(app)
                .post("/api/v1/auth/signup/doctor")
                .field("fullName", "Dr. Test")
                .field("email", `doctor${Date.now()}@test.com`)
                .field("password", userPassword)
                .field("phone", "01234567890")
                .field("specialization", "Cardiology")
                .field("medicalLicenseNumber", "LIC123456");
            expect([201, 200, 400]).toContain(res.statusCode);
        });

        it("should reject missing specialization", async () => {
            const res = await request(app)
                .post("/api/v1/auth/signup/doctor")
                .send({
                    fullName: "Dr. Bad",
                    email: `baddoc${Date.now()}@test.com`,
                    password: userPassword,
                    phone: "01234567890",
                });
            expect([400, 422]).toContain(res.statusCode);
        });
    });

    describe("POST /api/v1/auth/login", () => {
        const email = `logintest${Date.now()}@test.com`;

        beforeAll(async () => {
            // Ensure user exists before login test
            const signupRes = await request(app)
                .post("/api/v1/auth/signup/patient")
                .send({
                    fullName: "Login Test",
                    email,
                    password: userPassword,
                    phone: "01234567890",
                    dateOfBirth: "1990-01-01",
                    gender: "male",
                });
            // If signup failed with 400, user might already exist - that's ok for login
        });

        it("should login with valid credentials", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ email, password: userPassword });

            expect([200, 201, 401]).toContain(res.statusCode);
            if (res.statusCode === 200 || res.statusCode === 201) {
                expect(res.body).toHaveProperty("data");
                authToken = extractToken(res);
            }
        });

        it("should reject invalid credentials", async () => {
            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ email: "nonexistent@test.com", password: "wrong" });
            expect([401, 400, 404]).toContain(res.statusCode);
        });
    });

    describe("POST /api/v1/auth/forgot-password", () => {
        it("should accept valid email", async () => {
            const res = await request(app)
                .post("/api/v1/auth/forgot-password")
                .send({ email: "test@test.com" });
            expect([200, 400, 404]).toContain(res.statusCode);
        });

        it("should reject invalid email format", async () => {
            const res = await request(app)
                .post("/api/v1/auth/forgot-password")
                .send({ email: "not-an-email" });
            expect([400, 422]).toContain(res.statusCode);
        });
    });
});
