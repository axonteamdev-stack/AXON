/**
 * UserService Integration Tests
 * Tests service layer logic with real-like scenarios
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "../../Models/UserModel.js";
import { UserService } from "../UserService.js";
import { ROLES } from "../../Constants/index.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clean up database before each test
  await User.deleteMany({});
});

describe("UserService", () => {
  describe("toggleFollow - Atomic Transactions", () => {
    it("should atomically add doctor to following and patient to followers", async () => {
      // Create test users
      const patient = await User.create({
        fullName: "Test Patient",
        email: "patient@test.com",
        password: "password123",
        role: ROLES.PATIENT,
        following: [],
        followers: [],
      });

      const doctor = await User.create({
        fullName: "Test Doctor",
        email: "doctor@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
        following: [],
        followers: [],
      });

      // Follow doctor
      const result = await UserService.toggleFollow(patient._id, doctor._id);

      expect(result.followed).toBe(true);

      // Verify both sides of relationship updated
      const updatedPatient = await User.findById(patient._id);
      const updatedDoctor = await User.findById(doctor._id);

      expect(updatedPatient.following.some((id) => id.equals(doctor._id))).toBe(
        true,
      );
      expect(updatedDoctor.followers.some((id) => id.equals(patient._id))).toBe(
        true,
      );
    });

    it("should atomically remove follow relationship", async () => {
      // Create users with existing follow relationship
      const patient = await User.create({
        fullName: "Test Patient",
        email: "patient@test.com",
        password: "password123",
        role: ROLES.PATIENT,
        following: [],
        followers: [],
      });

      const doctor = await User.create({
        fullName: "Test Doctor",
        email: "doctor@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
        following: [],
        followers: [],
      });

      // First follow
      await UserService.toggleFollow(patient._id, doctor._id);

      // Then unfollow
      const result = await UserService.toggleFollow(patient._id, doctor._id);

      expect(result.followed).toBe(false);

      // Verify both sides removed
      const updatedPatient = await User.findById(patient._id);
      const updatedDoctor = await User.findById(doctor._id);

      expect(updatedPatient.following.length).toBe(0);
      expect(updatedDoctor.followers.length).toBe(0);
    });

    it("should resolve race conditions with concurrent toggleFollow", async () => {
      const patient = await User.create({
        fullName: "Test Patient",
        email: "patient@test.com",
        password: "password123",
        role: ROLES.PATIENT,
        following: [],
        followers: [],
      });

      const doctor = await User.create({
        fullName: "Test Doctor",
        email: "doctor@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
        following: [],
        followers: [],
      });

      // Simulate concurrent requests
      const promise1 = UserService.toggleFollow(patient._id, doctor._id);
      const promise2 = UserService.toggleFollow(patient._id, doctor._id);

      // One should succeed, one should complete
      const results = await Promise.all([promise1, promise2]);

      // At least one should be successful
      expect(results).toBeDefined();

      // Verify final state is consistent
      const finalPatient = await User.findById(patient._id);
      const finalDoctor = await User.findById(doctor._id);

      // Followers and following should be consistent
      expect(finalDoctor.followers.some((id) => id.equals(patient._id))).toBe(
        finalPatient.following.some((id) => id.equals(doctor._id)),
      );
    });

    it("should prevent self-following", async () => {
      const user = await User.create({
        fullName: "Test User",
        email: "user@test.com",
        password: "password123",
        role: ROLES.PATIENT,
        following: [],
        followers: [],
      });

      try {
        await UserService.toggleFollow(user._id, user._id);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).toMatch(
          /cannot follow yourself|لا يمكنك متابعة نفسك/i,
        );
      }
    });

    it("should prevent following non-doctor users", async () => {
      const patient1 = await User.create({
        fullName: "Patient 1",
        email: "patient1@test.com",
        password: "password123",
        role: ROLES.PATIENT,
        following: [],
        followers: [],
      });

      const patient2 = await User.create({
        fullName: "Patient 2",
        email: "patient2@test.com",
        password: "password123",
        role: ROLES.PATIENT,
        following: [],
        followers: [],
      });

      try {
        await UserService.toggleFollow(patient1._id, patient2._id);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe("getAllDoctors", () => {
    it("should return paginated list of verified doctors", async () => {
      // Create test doctors
      const doctors = await Promise.all([
        User.create({
          fullName: "Doctor 1",
          email: "doc1@test.com",
          password: "password123",
          role: ROLES.DOCTOR,
          isVerified: true,
        }),
        User.create({
          fullName: "Doctor 2",
          email: "doc2@test.com",
          password: "password123",
          role: ROLES.DOCTOR,
          isVerified: true,
        }),
        User.create({
          fullName: "Unverified Doctor",
          email: "doc3@test.com",
          password: "password123",
          role: ROLES.DOCTOR,
          isVerified: false,
        }),
      ]);

      const result = await UserService.getAllDoctors(1, 10);

      expect(result.data.length).toBe(2);
      expect(result.pagination.total).toBe(2);
      expect(result.data[0].fullName).toMatch(/Doctor/);
    });

    it("should apply pagination limits", async () => {
      // Create 15 doctors
      const doctorPromises = Array.from({ length: 15 }).map((_, i) =>
        User.create({
          fullName: `Doctor ${i}`,
          email: `doc${i}@test.com`,
          password: "password123",
          role: ROLES.DOCTOR,
          isVerified: true,
        }),
      );

      await Promise.all(doctorPromises);

      // First page
      const page1 = await UserService.getAllDoctors(1, 5);
      expect(page1.data.length).toBe(5);
      expect(page1.pagination.pages).toBe(3);

      // Second page
      const page2 = await UserService.getAllDoctors(2, 5);
      expect(page2.data.length).toBe(5);

      // Third page
      const page3 = await UserService.getAllDoctors(3, 5);
      expect(page3.data.length).toBe(5);
    });
  });

  describe("updateProfile", () => {
    it("should update user basic fields", async () => {
      const user = await User.create({
        fullName: "Original Name",
        email: "user@test.com",
        password: "password123",
        role: ROLES.PATIENT,
        phoneNumber: "1234567890",
      });

      const updated = await UserService.updateProfile(
        user._id,
        {
          fullName: "Updated Name",
          phoneNumber: "9876543210",
        },
        {},
      );

      expect(updated.fullName).toBe("Updated Name");
      expect(updated.phoneNumber).toBe("9876543210");
    });

    it("should prevent invalid updates", async () => {
      const user = await User.create({
        fullName: "Test User",
        email: "user@test.com",
        password: "password123",
        role: ROLES.PATIENT,
      });

      try {
        await UserService.updateProfile(user._id, {}, {});
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });
  });

  describe("getFollowing", () => {
    it("should return list of followed doctors", async () => {
      const patient = await User.create({
        fullName: "Patient",
        email: "patient@test.com",
        password: "password123",
        role: ROLES.PATIENT,
        following: [],
      });

      const doctor1 = await User.create({
        fullName: "Doctor 1",
        email: "doc1@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
      });

      const doctor2 = await User.create({
        fullName: "Doctor 2",
        email: "doc2@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
      });

      // Follow doctors
      await UserService.toggleFollow(patient._id, doctor1._id);
      await UserService.toggleFollow(patient._id, doctor2._id);

      const following = await UserService.getFollowing(patient._id, 1, 10);

      expect(following.length).toBe(2);
      expect(following.some((d) => d._id.equals(doctor1._id))).toBe(true);
      expect(following.some((d) => d._id.equals(doctor2._id))).toBe(true);
    });
  });

  describe("getFollowers", () => {
    it("should return list of followers", async () => {
      const doctor = await User.create({
        fullName: "Doctor",
        email: "doctor@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
        followers: [],
      });

      const patient1 = await User.create({
        fullName: "Patient 1",
        email: "pat1@test.com",
        password: "password123",
        role: ROLES.PATIENT,
      });

      const patient2 = await User.create({
        fullName: "Patient 2",
        email: "pat2@test.com",
        password: "password123",
        role: ROLES.PATIENT,
      });

      // Both patients follow doctor
      await UserService.toggleFollow(patient1._id, doctor._id);
      await UserService.toggleFollow(patient2._id, doctor._id);

      const followers = await UserService.getFollowers(doctor._id, 1, 10);

      expect(followers.length).toBe(2);
      expect(followers.some((p) => p._id.equals(patient1._id))).toBe(true);
      expect(followers.some((p) => p._id.equals(patient2._id))).toBe(true);
    });
  });
});
