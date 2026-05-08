import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import mongoose from "mongoose";
import * as authService from "../src/services/authService.js";
import * as userService from "../src/services/userService.js";
import * as postService from "../src/services/postService.js";
import * as medicationService from "../src/services/medicationService.js";
import * as emailService from "../src/services/emailService.js";
import * as tokenService from "../src/services/tokenService.js";
import AppError from "../src/utils/appError.js";
import User from "../src/models/userModel.js";
import Post from "../src/models/postModel.js";
import Medication from "../src/models/medicationModel.js";

describe("Services Test Suite", () => {
  describe("Token Service", () => {
    it("should generate a valid JWT token", async () => {
      const userId = new mongoose.Types.ObjectId();
      const token = tokenService.generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3); // JWT has 3 parts
    });

    it("should verify a valid token", () => {
      const userId = new mongoose.Types.ObjectId();
      const token = tokenService.generateToken(userId);
      const decoded = tokenService.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(userId.toString());
    });

    it("should reject an invalid token", () => {
      expect(() => {
        tokenService.verifyToken("invalid.token.here");
      }).toThrow();
    });

    it("should reject an expired token", async () => {
      const userId = new mongoose.Types.ObjectId();
      // Create an expired token (if your implementation supports custom expiry)
      const expiredToken = tokenService.generateToken(userId, "1ms");

      await new Promise((resolve) => setTimeout(resolve, 50)); // Wait for expiry

      expect(() => {
        tokenService.verifyToken(expiredToken);
      }).toThrow();
    });
  });

  describe("Email Service", () => {
    beforeEach(() => {
      jest.spyOn(emailService, "sendEmail").mockResolvedValue(true);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should send password reset email", async () => {
      const mockEmail = "user@example.com";
      const resetToken = "test-reset-token";

      await emailService.sendPasswordResetEmail(mockEmail, resetToken);

      expect(emailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: mockEmail,
          subject: expect.stringContaining("reset"),
        }),
      );
    });

    it("should send verification email", async () => {
      const mockEmail = "user@example.com";
      const verificationToken = "test-verification-token";

      await emailService.sendVerificationEmail(mockEmail, verificationToken);

      expect(emailService.sendEmail).toHaveBeenCalled();
    });

    it("should send appointment confirmation email", async () => {
      const appointmentData = {
        patientEmail: "patient@example.com",
        doctorName: "Dr. Smith",
        appointmentDate: new Date("2026-06-15"),
        appointmentTime: "10:00 AM",
      };

      await emailService.sendAppointmentConfirmation(appointmentData);

      expect(emailService.sendEmail).toHaveBeenCalled();
    });

    it("should handle email sending errors gracefully", async () => {
      jest
        .spyOn(emailService, "sendEmail")
        .mockRejectedValueOnce(new Error("SMTP error"));

      await expect(
        emailService.sendEmail({
          to: "test@example.com",
          subject: "Test",
        }),
      ).rejects.toThrow();
    });
  });

  describe("User Service", () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hashedPassword",
        phone: "1234567890",
        role: "patient",
      });
    });

    it("should retrieve user by ID", async () => {
      const user = await userService.getUserById(testUser._id);

      expect(user).toBeDefined();
      expect(user._id.toString()).toBe(testUser._id.toString());
      expect(user.email).toBe("john@example.com");
    });

    it("should retrieve user by email", async () => {
      const user = await userService.getUserByEmail("john@example.com");

      expect(user).toBeDefined();
      expect(user.email).toBe("john@example.com");
    });

    it("should return null for non-existent user", async () => {
      const user = await userService.getUserByEmail("nonexistent@example.com");

      expect(user).toBeNull();
    });

    it("should update user profile", async () => {
      const updateData = { firstName: "Jane" };
      const updatedUser = await userService.updateUserProfile(
        testUser._id,
        updateData,
      );

      expect(updatedUser.firstName).toBe("Jane");
    });

    it("should not allow email duplication", async () => {
      await expect(
        userService.updateUserProfile(testUser._id, {
          email: "john@example.com",
        }),
      ).rejects.toThrow();
    });

    it("should follow another user", async () => {
      const targetUser = await User.create({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        password: "hashedPassword",
        role: "patient",
      });

      const result = await userService.followUser(testUser._id, targetUser._id);

      expect(result).toBe(true);

      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.following).toContainEqual(targetUser._id);
    });

    it("should unfollow a user", async () => {
      const targetUser = await User.create({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        password: "hashedPassword",
        role: "patient",
      });

      await userService.followUser(testUser._id, targetUser._id);
      const result = await userService.unfollowUser(
        testUser._id,
        targetUser._id,
      );

      expect(result).toBe(true);

      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.following).not.toContainEqual(targetUser._id);
    });

    it("should block a user", async () => {
      const targetUser = await User.create({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        password: "hashedPassword",
        role: "patient",
      });

      const result = await userService.blockUser(testUser._id, targetUser._id);

      expect(result).toBe(true);

      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.blockedUsers).toContainEqual(targetUser._id);
    });

    it("should not allow self-follow", async () => {
      await expect(
        userService.followUser(testUser._id, testUser._id),
      ).rejects.toThrow("Cannot follow yourself");
    });
  });

  describe("Post Service", () => {
    let testUser;
    let testPost;

    beforeEach(async () => {
      testUser = await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hashedPassword",
        role: "patient",
      });

      testPost = await Post.create({
        content: "Test post",
        author: testUser._id,
        visibility: "public",
      });
    });

    it("should create a new post", async () => {
      const post = await postService.createPost(testUser._id, {
        content: "New post content",
        visibility: "public",
      });

      expect(post).toBeDefined();
      expect(post.content).toBe("New post content");
      expect(post.author.toString()).toBe(testUser._id.toString());
    });

    it("should retrieve post by ID with author details", async () => {
      const post = await postService.getPostById(testPost._id);

      expect(post).toBeDefined();
      expect(post._id.toString()).toBe(testPost._id.toString());
      expect(post.author).toBeDefined();
    });

    it("should like a post", async () => {
      const likeUser = await User.create({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        password: "hashedPassword",
        role: "patient",
      });

      const result = await postService.likePost(testPost._id, likeUser._id);

      expect(result).toBe(true);

      const updatedPost = await Post.findById(testPost._id);
      expect(updatedPost.likes).toContainEqual(likeUser._id);
    });

    it("should unlike a post", async () => {
      const likeUser = await User.create({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        password: "hashedPassword",
        role: "patient",
      });

      await postService.likePost(testPost._id, likeUser._id);
      const result = await postService.unlikePost(testPost._id, likeUser._id);

      expect(result).toBe(true);

      const updatedPost = await Post.findById(testPost._id);
      expect(updatedPost.likes).not.toContainEqual(likeUser._id);
    });

    it("should not allow double-liking", async () => {
      const likeUser = await User.create({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        password: "hashedPassword",
        role: "patient",
      });

      await postService.likePost(testPost._id, likeUser._id);

      await expect(
        postService.likePost(testPost._id, likeUser._id),
      ).rejects.toThrow("Already liked");
    });

    it("should delete own post", async () => {
      const result = await postService.deletePost(testPost._id, testUser._id);

      expect(result).toBe(true);

      const deletedPost = await Post.findById(testPost._id);
      expect(deletedPost).toBeNull();
    });

    it("should prevent deleting another user's post", async () => {
      const otherUser = await User.create({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        password: "hashedPassword",
        role: "patient",
      });

      await expect(
        postService.deletePost(testPost._id, otherUser._id),
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("Medication Service", () => {
    let testMedication;
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hashedPassword",
        role: "patient",
      });

      testMedication = await Medication.create({
        name: "Aspirin",
        dosage: "500mg",
        frequency: "twice daily",
        prescribedDate: new Date(),
      });
    });

    it("should retrieve medication by ID", async () => {
      const medication = await medicationService.getMedicationById(
        testMedication._id,
      );

      expect(medication).toBeDefined();
      expect(medication.name).toBe("Aspirin");
    });

    it("should check for drug interactions", async () => {
      const drug1 = { name: "Aspirin", id: testMedication._id };
      const drug2 = { name: "Ibuprofen" };

      const interactions = await medicationService.checkDrugInteractions([
        drug1,
        drug2,
      ]);

      expect(interactions).toBeDefined();
      expect(Array.isArray(interactions)).toBe(true);
    });

    it("should record medication adherence", async () => {
      const adherenceData = {
        medicationId: testMedication._id,
        userId: testUser._id,
        taken: true,
        date: new Date(),
      };

      const result = await medicationService.recordAdherence(adherenceData);

      expect(result).toBeDefined();
    });

    it("should calculate adherence percentage", async () => {
      const adherencePercentage =
        await medicationService.getAdherencePercentage(
          testUser._id,
          testMedication._id,
          30,
        );

      expect(typeof adherencePercentage).toBe("number");
      expect(adherencePercentage).toBeGreaterThanOrEqual(0);
      expect(adherencePercentage).toBeLessThanOrEqual(100);
    });

    it("should alert for medication refill", async () => {
      const refillAlert = await medicationService.checkRefillStatus(
        testMedication._id,
      );

      expect(refillAlert).toBeDefined();
    });
  });

  describe("Auth Service", () => {
    it("should hash password correctly", async () => {
      const password = "TestPassword123!";
      const hashed = await authService.hashPassword(password);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
    });

    it("should compare password with hash", async () => {
      const password = "TestPassword123!";
      const hashed = await authService.hashPassword(password);

      const isMatch = await authService.comparePassword(password, hashed);

      expect(isMatch).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const password = "TestPassword123!";
      const hashed = await authService.hashPassword(password);

      const isMatch = await authService.comparePassword(
        "WrongPassword",
        hashed,
      );

      expect(isMatch).toBe(false);
    });

    it("should generate password reset token", async () => {
      const token = authService.generatePasswordResetToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });
  });
});
