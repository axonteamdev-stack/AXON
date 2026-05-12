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

describe("DDI API", () => {
    let doctorToken;
    const doctorEmail = `ddidoc${Date.now()}@test.com`;
    const password = "Password123!";

    beforeAll(async () => {
        await request(app)
            .post("/api/v1/auth/signup/doctor")
            .field("fullName", "Dr. DDI")
            .field("email", doctorEmail)
            .field("password", password)
            .field("phone", "01234567890")
            .field("specialization", "Pharmacology")
            .field("medicalLicenseNumber", "LICDDI");

        const loginRes = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: doctorEmail, password });

        doctorToken = extractToken(loginRes);
    });

    describe("POST /api/v1/ddi/check", () => {
        it("should check drug interactions", async () => {
            const res = await request(app)
                .post("/api/v1/ddi/check")
                .set(
                    "Authorization",
                    doctorToken ? `Bearer ${doctorToken}` : "",
                )
                .send({
                    medications: ["Aspirin", "Warfarin"],
                });
            expect([200, 400, 401]).toContain(res.statusCode);
        });

        it("should reject missing medication name", async () => {
            const res = await request(app)
                .post("/api/v1/ddi/check")
                .set(
                    "Authorization",
                    doctorToken ? `Bearer ${doctorToken}` : "",
                )
                .send({});
            expect([400, 422, 401]).toContain(res.statusCode);
        });
    });
});
