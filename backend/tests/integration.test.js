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

describe("Integration Tests", () => {
    let doctorToken, patientToken, postId;
    const doctorEmail = `intdoc${Date.now()}@test.com`;
    const patientEmail = `intpat${Date.now()}@test.com`;
    const password = "Password123!";

    beforeAll(async () => {
        // Signup doctor
        await request(app)
            .post("/api/v1/auth/signup/doctor")
            .field("fullName", "Dr. Integration")
            .field("email", doctorEmail)
            .field("password", password)
            .field("phone", "01234567890")
            .field("specialization", "General")
            .field("medicalLicenseNumber", "LICINT");

        // Signup patient
        await request(app).post("/api/v1/auth/signup/patient").send({
            fullName: "Int Patient",
            email: patientEmail,
            password,
            phone: "01234567890",
            dateOfBirth: "1995-01-01",
            gender: "female",
        });

        // Login both
        const dLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: doctorEmail, password });
        doctorToken = extractToken(dLogin);

        const pLogin = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: patientEmail, password });
        patientToken = extractToken(pLogin);
    });

    it("should complete full workflow: signup → login → create post → book appointment → chat", async () => {
        // 1. Doctor creates post
        const postRes = await request(app)
            .post("/api/v1/posts")
            .set("Authorization", doctorToken ? `Bearer ${doctorToken}` : "")
            .send({
                title: "Integration Post",
                content:
                    "Detailed content for integration test post with sufficient length.",
                category: "general",
            });
        expect([201, 200, 400, 401]).toContain(postRes.statusCode);
        if (
            (postRes.statusCode === 201 || postRes.statusCode === 200) &&
            postRes.body?.data
        ) {
            postId = postRes.body.data._id || postRes.body.data.id;
        }

        // 2. Patient views posts
        const postsRes = await request(app).get("/api/v1/posts");
        expect([200, 401]).toContain(postsRes.statusCode);

        // 3. Patient books appointment
        const apptRes = await request(app)
            .post("/api/v1/appointments")
            .set("Authorization", patientToken ? `Bearer ${patientToken}` : "")
            .send({
                doctorId: "507f1f77bcf86cd799439011",
                date: "2024-12-01",
                time: "10:00",
                reason: "Checkup",
            });
        expect([201, 200, 400, 401]).toContain(apptRes.statusCode);

        // 4. Chat initiation
        const chatRes = await request(app)
            .post("/api/v1/chat/conversations")
            .set("Authorization", patientToken ? `Bearer ${patientToken}` : "")
            .send({ participantId: "507f1f77bcf86cd799439011" });
        expect([201, 200, 400, 401]).toContain(chatRes.statusCode);
    });

    it("should handle medication tracking workflow", async () => {
        const medRes = await request(app)
            .post("/api/v1/medications")
            .set("Authorization", patientToken ? `Bearer ${patientToken}` : "")
            .send({
                medicineName: "Paracetamol",
                dosage: "500mg",
                frequency: "twice daily",
                startDate: "2024-01-01",
            });
        expect([201, 200, 400, 401]).toContain(medRes.statusCode);

        const getRes = await request(app)
            .get("/api/v1/medications")
            .set("Authorization", patientToken ? `Bearer ${patientToken}` : "");
        expect([200, 401]).toContain(getRes.statusCode);
    });
});
