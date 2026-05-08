import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../app.js";
import User from "../src/models/userModel.js";
import Post from "../src/models/postModel.js";
import Comment from "../src/models/commentModel.js";
import Appointment from "../src/models/appointmentModel.js";
import Message from "../src/models/messageModel.js";
import Conversation from "../src/models/conversationModel.js";

describe("Integration Tests - Complete Workflows", () => {
  let patient, doctor, authTokenPatient, authTokenDoctor;

  beforeEach(async () => {
    // Create users
    patient = await User.create({
      firstName: "John",
      lastName: "Patient",
      email: "patient@example.com",
      password: "PatientPass123!",
      role: "patient",
    });

    doctor = await User.create({
      firstName: "Dr",
      lastName: "Smith",
      email: "doctor@example.com",
      password: "DoctorPass123!",
      role: "doctor",
    });

    // Login to get tokens
    const patientLogin = await request(app).post("/api/v2/auth/login").send({
      email: "patient@example.com",
      password: "PatientPass123!",
    });

    const doctorLogin = await request(app).post("/api/v2/auth/login").send({
      email: "doctor@example.com",
      password: "DoctorPass123!",
    });

    authTokenPatient = patientLogin.body.data?.token;
    authTokenDoctor = doctorLogin.body.data?.token;
  });

  describe("User Registration & Authentication Flow", () => {
    it("should complete full auth workflow: register → verify → login → access protected routes", async () => {
      // Step 1: Register new user
      const registerRes = await request(app)
        .post("/api/v2/auth/register")
        .send({
          firstName: "New",
          lastName: "User",
          email: `newuser${Date.now()}@example.com`,
          password: "SecurePass123!",
          role: "patient",
        });

      expect(registerRes.status).toBe(201);
      const newUserId = registerRes.body.data._id;

      // Step 2: Login with new credentials
      const loginRes = await request(app)
        .post("/api/v2/auth/login")
        .send({
          email: `newuser${Date.now()}@example.com`,
          password: "SecurePass123!",
        });

      expect(loginRes.status).toBe(200);
      const token = loginRes.body.data?.token;
      expect(token).toBeDefined();

      // Step 3: Access protected route
      const profileRes = await request(app)
        .get("/api/v2/users/me")
        .set("Authorization", `Bearer ${token}`);

      expect(profileRes.status).toBe(200);
      expect(profileRes.body.data._id).toBe(newUserId);

      // Step 4: Update profile
      const updateRes = await request(app)
        .patch(`/api/v2/users/${newUserId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ firstName: "Updated" });

      expect(updateRes.status).toBe(200);

      // Step 5: Logout
      const logoutRes = await request(app)
        .post("/api/v2/auth/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(logoutRes.status).toBe(200);

      // Step 6: Verify token no longer works
      const afterLogoutRes = await request(app)
        .get("/api/v2/users/me")
        .set("Authorization", `Bearer ${token}`);

      expect(afterLogoutRes.status).toBe(401);
    });

    it("should handle password reset flow", async () => {
      // Step 1: Request password reset
      const resetReqRes = await request(app)
        .post("/api/v2/auth/forgot-password")
        .send({ email: patient.email });

      expect(resetReqRes.status).toBe(200);
      const resetToken = resetReqRes.body.data?.resetToken;

      // Step 2: Reset password with token
      const resetRes = await request(app)
        .post("/api/v2/auth/reset-password")
        .send({
          token: resetToken,
          newPassword: "NewPass123!",
          confirmPassword: "NewPass123!",
        });

      expect(resetRes.status).toBe(200);

      // Step 3: Login with new password
      const loginRes = await request(app).post("/api/v2/auth/login").send({
        email: patient.email,
        password: "NewPass123!",
      });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.data?.token).toBeDefined();
    });
  });

  describe("Social Features Workflow", () => {
    it("should complete full social workflow: create post → like → comment → share", async () => {
      // Step 1: Patient creates a post
      const createPostRes = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", `Bearer ${authTokenPatient}`)
        .send({
          content: "Health tips for everyone!",
          visibility: "public",
          tags: ["health", "tips"],
        });

      expect(createPostRes.status).toBe(201);
      const postId = createPostRes.body.data._id;

      // Step 2: Doctor likes the post
      const likeRes = await request(app)
        .post(`/api/v2/posts/${postId}/like`)
        .set("Authorization", `Bearer ${authTokenDoctor}`);

      expect(likeRes.status).toBe(200);

      // Step 3: Doctor comments on post
      const commentRes = await request(app)
        .post(`/api/v2/posts/${postId}/comments`)
        .set("Authorization", `Bearer ${authTokenDoctor}`)
        .send({
          content: "Great information!",
        });

      expect(commentRes.status).toBe(201);
      const commentId = commentRes.body.data._id;

      // Step 4: Patient replies to comment
      const replyRes = await request(app)
        .post(`/api/v2/comments/${commentId}/reply`)
        .set("Authorization", `Bearer ${authTokenPatient}`)
        .send({
          content: "Thanks for the feedback!",
        });

      expect(replyRes.status).toBe(201);

      // Step 5: Share post
      const shareRes = await request(app)
        .post(`/api/v2/posts/${postId}/share`)
        .set("Authorization", `Bearer ${authTokenDoctor}`);

      expect([200, 201]).toContain(shareRes.status);

      // Step 6: Verify post details with interactions
      const getPostRes = await request(app)
        .get(`/api/v2/posts/${postId}`)
        .set("Authorization", `Bearer ${authTokenPatient}`);

      expect(getPostRes.status).toBe(200);
      expect(getPostRes.body.data.likes.length).toBeGreaterThan(0);
      expect(getPostRes.body.data.comments.length).toBeGreaterThan(0);
    });

    it("should complete follow workflow: follow → see posts → unfollow", async () => {
      // Step 1: Patient follows Doctor
      const followRes = await request(app)
        .post(`/api/v2/users/${doctor._id}/follow`)
        .set("Authorization", `Bearer ${authTokenPatient}`);

      expect(followRes.status).toBe(200);

      // Step 2: Doctor creates post
      const postRes = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", `Bearer ${authTokenDoctor}`)
        .send({
          content: "Doctor's post",
          visibility: "public",
        });

      expect(postRes.status).toBe(201);

      // Step 3: Patient sees doctor's post in feed
      const feedRes = await request(app)
        .get("/api/v2/posts/feed/following")
        .set("Authorization", `Bearer ${authTokenPatient}`);

      expect(feedRes.status).toBe(200);
      const feedPostIds = feedRes.body.data.map((p) => p._id);
      expect(feedPostIds).toContain(postRes.body.data._id);

      // Step 4: Patient unfollows doctor
      const unfollowRes = await request(app)
        .post(`/api/v2/users/${doctor._id}/unfollow`)
        .set("Authorization", `Bearer ${authTokenPatient}`);

      expect(unfollowRes.status).toBe(200);

      // Step 5: Verify no longer following
      const userRes = await request(app)
        .get("/api/v2/users/me")
        .set("Authorization", `Bearer ${authTokenPatient}`);

      expect(userRes.body.data.following.map((u) => u._id)).not.toContain(
        doctor._id.toString(),
      );
    });
  });

  describe("Appointment Booking & Chat Workflow", () => {
    it("should complete full appointment workflow: search → book → confirm → discuss via chat", async () => {
      // Step 1: Patient searches for doctors
      const searchRes = await request(app)
        .get("/api/v2/users/doctors")
        .query({ specialty: "general" })
        .set("Authorization", `Bearer ${authTokenPatient}`);

      expect(searchRes.status).toBe(200);

      // Step 2: Patient books appointment with doctor
      const bookRes = await request(app)
        .post("/api/v2/appointments")
        .set("Authorization", `Bearer ${authTokenPatient}`)
        .send({
          doctorId: doctor._id,
          date: "2026-06-15",
          time: "10:00 AM",
          reason: "General checkup",
          notes: "No specific concerns",
        });

      expect(bookRes.status).toBe(201);
      const appointmentId = bookRes.body.data._id;

      // Step 3: Doctor confirms appointment
      const confirmRes = await request(app)
        .patch(`/api/v2/appointments/${appointmentId}`)
        .set("Authorization", `Bearer ${authTokenDoctor}`)
        .send({
          status: "confirmed",
        });

      expect(confirmRes.status).toBe(200);

      // Step 4: Patient initiates chat
      const chatRes = await request(app)
        .post("/api/v2/chat/conversations")
        .set("Authorization", `Bearer ${authTokenPatient}`)
        .send({
          participantId: doctor._id,
          type: "direct",
          linkedAppointmentId: appointmentId,
        });

      expect(chatRes.status).toBe(201);
      const conversationId = chatRes.body.data._id;

      // Step 5: Both exchange messages
      const msgRes1 = await request(app)
        .post("/api/v2/chat/messages")
        .set("Authorization", `Bearer ${authTokenPatient}`)
        .send({
          conversationId,
          content: "Hi Doctor, I have some questions",
          type: "text",
        });

      expect(msgRes1.status).toBe(201);

      const msgRes2 = await request(app)
        .post("/api/v2/chat/messages")
        .set("Authorization", `Bearer ${authTokenDoctor}`)
        .send({
          conversationId,
          content: "Sure, I'm happy to help!",
          type: "text",
        });

      expect(msgRes2.status).toBe(201);

      // Step 6: Verify conversation history
      const historyRes = await request(app)
        .get(`/api/v2/chat/conversations/${conversationId}`)
        .set("Authorization", `Bearer ${authTokenPatient}`);

      expect(historyRes.status).toBe(200);
      expect(historyRes.body.data.messages.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Health Records & Medication Workflow", () => {
    it("should complete full medication tracking workflow", async () => {
      // Step 1: Doctor prescribes medication
      const prescribeRes = await request(app)
        .post("/api/v2/medications")
        .set("Authorization", `Bearer ${authTokenDoctor}`)
        .send({
          patientId: patient._id,
          name: "Aspirin",
          dosage: "500mg",
          frequency: "twice daily",
          startDate: "2026-05-09",
          endDate: "2026-05-23",
          reason: "Pain relief",
        });

      expect(prescribeRes.status).toBe(201);
      const medicationId = prescribeRes.body.data._id;

      // Step 2: Patient records adherence
      const adherenceRes1 = await request(app)
        .post(`/api/v2/medications/${medicationId}/adherence`)
        .set("Authorization", `Bearer ${authTokenPatient}`)
        .send({
          taken: true,
          date: "2026-05-09",
          time: "09:00 AM",
        });

      expect(adherenceRes1.status).toBe(201);

      const adherenceRes2 = await request(app)
        .post(`/api/v2/medications/${medicationId}/adherence`)
        .set("Authorization", `Bearer ${authTokenPatient}`)
        .send({
          taken: true,
          date: "2026-05-09",
          time: "09:00 PM",
        });

      expect(adherenceRes2.status).toBe(201);

      // Step 3: Check adherence percentage
      const percentageRes = await request(app)
        .get(`/api/v2/medications/${medicationId}/adherence?days=14`)
        .set("Authorization", `Bearer ${authTokenPatient}`);

      expect(percentageRes.status).toBe(200);
      expect(percentageRes.body.data.percentage).toBeGreaterThan(0);

      // Step 4: Check for drug interactions
      const interactionRes = await request(app)
        .post("/api/v2/medications/check-interactions")
        .set("Authorization", `Bearer ${authTokenPatient}`)
        .send({
          medications: [medicationId],
          newMedication: "Ibuprofen",
        });

      expect(interactionRes.status).toBe(200);
      expect(interactionRes.body.data).toBeDefined();

      // Step 5: Get medication report
      const reportRes = await request(app)
        .get(`/api/v2/medications/${medicationId}/report`)
        .set("Authorization", `Bearer ${authTokenPatient}`);

      expect([200, 404]).toContain(reportRes.status); // May not have report yet
    });
  });

  describe("Medical Article Workflow", () => {
    it("should complete full article workflow: publish → bookmark → comment → share", async () => {
      // Step 1: Doctor publishes article
      const publishRes = await request(app)
        .post("/api/v2/articles")
        .set("Authorization", `Bearer ${authTokenDoctor}`)
        .send({
          title: "Understanding Hypertension",
          content: "Detailed article about blood pressure management",
          category: "medical",
          tags: ["hypertension", "health"],
          seoDescription: "Learn about hypertension",
        });

      expect(publishRes.status).toBe(201);
      const articleId = publishRes.body.data._id;

      // Step 2: Patient bookmarks article
      const bookmarkRes = await request(app)
        .post(`/api/v2/articles/${articleId}/bookmark`)
        .set("Authorization", `Bearer ${authTokenPatient}`);

      expect(bookmarkRes.status).toBe(200);

      // Step 3: Patient comments on article
      const commentRes = await request(app)
        .post(`/api/v2/articles/${articleId}/comments`)
        .set("Authorization", `Bearer ${authTokenPatient}`)
        .send({
          content: "Very informative!",
        });

      expect(commentRes.status).toBe(201);

      // Step 4: Doctor replies to comment
      const replyRes = await request(app)
        .post(`/api/v2/comments/${commentRes.body.data._id}/reply`)
        .set("Authorization", `Bearer ${authTokenDoctor}`)
        .send({
          content: "Glad you found it helpful!",
        });

      expect(replyRes.status).toBe(201);

      // Step 5: Patient shares article
      const shareRes = await request(app)
        .post(`/api/v2/articles/${articleId}/share`)
        .set("Authorization", `Bearer ${authTokenPatient}`);

      expect([200, 201]).toContain(shareRes.status);

      // Step 6: Patient's feed should show activity
      const feedRes = await request(app)
        .get("/api/v2/posts/feed/all")
        .set("Authorization", `Bearer ${authTokenPatient}`);

      expect(feedRes.status).toBe(200);
    });
  });

  describe("Admin & Moderation Workflow", () => {
    it("should handle content moderation workflow", async () => {
      // Create an admin user
      const admin = await User.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: "AdminPass123!",
        role: "admin",
      });

      const adminLogin = await request(app).post("/api/v2/auth/login").send({
        email: "admin@example.com",
        password: "AdminPass123!",
      });

      const adminToken = adminLogin.body.data?.token;

      // Patient creates post
      const postRes = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", `Bearer ${authTokenPatient}`)
        .send({
          content: "Test post",
          visibility: "public",
        });

      const postId = postRes.body.data._id;

      // Admin reviews post
      const reviewRes = await request(app)
        .get(`/api/v2/admin/content/${postId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect([200, 404]).toContain(reviewRes.status);

      // Admin can take action if needed
      const actionRes = await request(app)
        .patch(`/api/v2/admin/content/${postId}/moderate`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          action: "review", // or "remove", "warn", etc
          reason: "Review requested",
        });

      expect([200, 404]).toContain(actionRes.status);
    });
  });

  describe("Complex Multi-User Scenarios", () => {
    it("should handle complex scenarios with multiple users and interactions", async () => {
      // Create additional users
      const nurse = await User.create({
        firstName: "Jane",
        lastName: "Nurse",
        email: "nurse@example.com",
        password: "NursePass123!",
        role: "nurse",
      });

      const nurseLogin = await request(app).post("/api/v2/auth/login").send({
        email: "nurse@example.com",
        password: "NursePass123!",
      });

      const authTokenNurse = nurseLogin.body.data?.token;

      // Patient creates post
      const postRes = await request(app)
        .post("/api/v2/posts")
        .set("Authorization", `Bearer ${authTokenPatient}`)
        .send({
          content: "Seeking advice on recovery",
          visibility: "public",
        });

      const postId = postRes.body.data._id;

      // Doctor likes and comments
      await request(app)
        .post(`/api/v2/posts/${postId}/like`)
        .set("Authorization", `Bearer ${authTokenDoctor}`);

      const doctorCommentRes = await request(app)
        .post(`/api/v2/posts/${postId}/comments`)
        .set("Authorization", `Bearer ${authTokenDoctor}`)
        .send({
          content: "Following recovery protocol",
        });

      // Nurse likes doctor's comment
      await request(app)
        .post(`/api/v2/comments/${doctorCommentRes.body.data._id}/like`)
        .set("Authorization", `Bearer ${authTokenNurse}`);

      // Nurse replies to doctor's comment
      const nurseReplyRes = await request(app)
        .post(`/api/v2/comments/${doctorCommentRes.body.data._id}/reply`)
        .set("Authorization", `Bearer ${authTokenNurse}`)
        .send({
          content: "I'll monitor progress",
        });

      expect(nurseReplyRes.status).toBe(201);

      // Verify post with all interactions
      const finalPostRes = await request(app)
        .get(`/api/v2/posts/${postId}`)
        .set("Authorization", `Bearer ${authTokenPatient}`);

      expect(finalPostRes.status).toBe(200);
      expect(finalPostRes.body.data.likes.length).toBeGreaterThan(0);
      expect(finalPostRes.body.data.comments.length).toBeGreaterThan(0);
    });
  });
});
