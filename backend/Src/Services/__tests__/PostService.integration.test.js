/**
 * PostService Integration Tests
 * Tests aggregation pipeline for comment counts and N+1 prevention
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import Post from "../../Models/PostModel.js";
import Comment from "../../Models/CommentModel.js";
import User from "../../Models/UserModel.js";
import PostService from "../PostService.js";
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
  await Post.deleteMany({});
  await Comment.deleteMany({});
  await User.deleteMany({});
});

describe("PostService", () => {
  describe("getExploreFeeds - ✅ N+1 Query Prevention", () => {
    it("should fetch posts with comment counts using single aggregation", async () => {
      // Create test doctor
      const doctor = await User.create({
        fullName: "Test Doctor",
        email: "doctor@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
        isVerified: true,
      });

      // Create test posts
      const posts = await Promise.all(
        Array.from({ length: 5 }).map((_, i) =>
          Post.create({
            author: doctor._id,
            content: `Post ${i}`,
            visibility: "public",
          }),
        ),
      );

      // Create comments for first 3 posts (varying counts)
      for (let i = 0; i < 3; i++) {
        for (let c = 0; c < i + 2; c++) {
          await Comment.create({
            post: posts[i]._id,
            author: doctor._id,
            content: `Comment ${c}`,
          });
        }
      }

      // Fetch explore feed
      const result = await PostService.getExploreFeeds(1, 10, "recent", null);

      // Verify correct comment counts (without N+1 queries)
      expect(result.data.length).toBe(5);
      expect(result.data[0].commentCount || 0).toBe(2); // Post 0 has 2 comments
      expect(result.data[1].commentCount || 0).toBe(3); // Post 1 has 3 comments
      expect(result.data[2].commentCount || 0).toBe(4); // Post 2 has 4 comments
      expect(result.data[3].commentCount || 0).toBe(0); // Posts 3 & 4 have no comments
    });

    it("should respect sorting options", async () => {
      const doctor = await User.create({
        fullName: "Test Doctor",
        email: "doctor@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
        isVerified: true,
      });

      // Create posts with different like counts
      const post1 = await Post.create({
        author: doctor._id,
        content: "Post 1",
        visibility: "public",
        likes: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
      });

      const post2 = await Post.create({
        author: doctor._id,
        content: "Post 2",
        visibility: "public",
        likes: [new mongoose.Types.ObjectId()],
      });

      // Test recent sorting
      const recentResult = await PostService.getExploreFeeds(
        1,
        10,
        "recent",
        null,
      );
      expect(recentResult.data.length).toBe(2);

      // Test trending sorting
      const trendingResult = await PostService.getExploreFeeds(
        1,
        10,
        "trending",
        null,
      );
      expect(trendingResult.data.length).toBe(2);
    });

    it("should respect visibility constraints", async () => {
      const doctor = await User.create({
        fullName: "Test Doctor",
        email: "doctor@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
        isVerified: true,
      });

      const patient = await User.create({
        fullName: "Test Patient",
        email: "patient@test.com",
        password: "password123",
        role: ROLES.PATIENT,
      });

      // Create posts with different visibility
      const publicPost = await Post.create({
        author: doctor._id,
        content: "Public",
        visibility: "public",
      });

      const privatePost = await Post.create({
        author: doctor._id,
        content: "Private",
        visibility: "private",
      });

      // Unauthenticated request - should see only public
      const unAuthResult = await PostService.getExploreFeeds(
        1,
        10,
        "recent",
        null,
      );
      expect(unAuthResult.data.length).toBe(1);

      // Authenticated patient - should see only public
      const patientResult = await PostService.getExploreFeeds(
        1,
        10,
        "recent",
        patient._id,
      );
      expect(patientResult.data.length).toBe(1);

      // Doctor's own view - should see own private
      const doctorResult = await PostService.getExploreFeeds(
        1,
        10,
        "recent",
        doctor._id,
      );
      expect(doctorResult.data.length).toBe(2);
    });
  });

  describe("getFollowingFeeds - Following Filter", () => {
    it("should return posts from followed doctors only", async () => {
      const patient = await User.create({
        fullName: "Patient",
        email: "patient@test.com",
        password: "password123",
        role: ROLES.PATIENT,
        following: [],
      });

      const followedDoctor = await User.create({
        fullName: "Followed Doctor",
        email: "followed@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
        isVerified: true,
      });

      const unfollowedDoctor = await User.create({
        fullName: "Unfollowed Doctor",
        email: "unfollowed@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
        isVerified: true,
      });

      // Create posts
      const followedPost = await Post.create({
        author: followedDoctor._id,
        content: "Followed",
        visibility: "public",
      });

      const unfollowedPost = await Post.create({
        author: unfollowedDoctor._id,
        content: "Unfollowed",
        visibility: "public",
      });

      // Follow one doctor
      patient.following.push(followedDoctor._id);
      await patient.save();

      // Get following feed
      const result = await PostService.getFollowingFeeds(patient._id, 1, 10);

      // Should only see posts from followed doctor
      expect(result.data.length).toBe(1);
      expect(result.data[0].content).toBe("Followed");
    });
  });

  describe("toggleLike - Atomic Operations", () => {
    it("should toggle like status", async () => {
      const doctor = await User.create({
        fullName: "Doctor",
        email: "doctor@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
      });

      const patient = await User.create({
        fullName: "Patient",
        email: "patient@test.com",
        password: "password123",
        role: ROLES.PATIENT,
      });

      const post = await Post.create({
        author: doctor._id,
        content: "Test",
        visibility: "public",
        likes: [],
      });

      // Like post
      let result = await PostService.toggleLike(post._id, patient._id);
      expect(result.liked).toBe(true);

      // Verify like added
      let updatedPost = await Post.findById(post._id);
      expect(updatedPost.likes.some((id) => id.equals(patient._id))).toBe(true);

      // Unlike post
      result = await PostService.toggleLike(post._id, patient._id);
      expect(result.liked).toBe(false);

      // Verify like removed
      updatedPost = await Post.findById(post._id);
      expect(updatedPost.likes.length).toBe(0);
    });
  });

  describe("getMyPosts - User's Own Posts", () => {
    it("should return only current user's posts with comment counts", async () => {
      const doctor = await User.create({
        fullName: "Doctor 1",
        email: "doctor1@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
      });

      const otherDoctor = await User.create({
        fullName: "Doctor 2",
        email: "doctor2@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
      });

      // Create posts
      const myPost1 = await Post.create({
        author: doctor._id,
        content: "My Post 1",
        visibility: "public",
      });

      const myPost2 = await Post.create({
        author: doctor._id,
        content: "My Post 2",
        visibility: "public",
      });

      const otherPost = await Post.create({
        author: otherDoctor._id,
        content: "Other Post",
        visibility: "public",
      });

      // Add comments to my first post
      await Comment.create({
        post: myPost1._id,
        author: otherDoctor._id,
        content: "Comment",
      });

      // Get my posts
      const result = await PostService.getMyPosts(doctor._id, 1, 10);

      expect(result.data.length).toBe(2);
      expect(result.data[0].content).toMatch(/My Post/);
      expect(result.pagination.total).toBe(2);
    });
  });

  describe("searchByTags - Tag Search", () => {
    it("should find posts with specific tag", async () => {
      const doctor = await User.create({
        fullName: "Doctor",
        email: "doctor@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
        isVerified: true,
      });

      // Create posts with different tags
      await Post.create({
        author: doctor._id,
        content: "Healthcare post",
        visibility: "public",
        tags: ["healthcare", "medical"],
      });

      await Post.create({
        author: doctor._id,
        content: "Medical post",
        visibility: "public",
        tags: ["medical", "diagnosis"],
      });

      await Post.create({
        author: doctor._id,
        content: "Tech post",
        visibility: "public",
        tags: ["technology"],
      });

      // Search for healthcare tag
      const result = await PostService.searchByTags("healthcare", 1, 10);

      expect(result.data.length).toBe(1);
      expect(result.data[0].content).toBe("Healthcare post");

      // Search for medical tag
      const medicalResult = await PostService.searchByTags("medical", 1, 10);
      expect(medicalResult.data.length).toBe(2);
    });

    it("should respect visibility in tag search", async () => {
      const doctor = await User.create({
        fullName: "Doctor",
        email: "doctor@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
        isVerified: true,
      });

      // Create public and private posts with same tag
      await Post.create({
        author: doctor._id,
        content: "Public medical",
        visibility: "public",
        tags: ["medical"],
      });

      await Post.create({
        author: doctor._id,
        content: "Private medical",
        visibility: "private",
        tags: ["medical"],
      });

      // Search should only return public
      const result = await PostService.searchByTags("medical", 1, 10);
      expect(result.data.length).toBe(1);
      expect(result.data[0].visibility).toBe("public");
    });
  });

  describe("createPost - File Handling", () => {
    it("should create post with images", async () => {
      const doctor = await User.create({
        fullName: "Doctor",
        email: "doctor@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
      });

      const mockFile = {
        buffer: Buffer.from("mock image data"),
        originalname: "test.jpg",
      };

      const post = await PostService.createPost(
        doctor._id,
        {
          content: "Test post",
          tags: ["test"],
          visibility: "public",
        },
        [mockFile],
      );

      expect(post.content).toBe("Test post");
      expect(post.images.length).toBeGreaterThan(0);
      expect(post.images[0]).toMatch(/Uploads\/Posts/);
    });
  });

  describe("deletePost - Soft Delete with Comments", () => {
    it("should soft delete post and associated comments", async () => {
      const doctor = await User.create({
        fullName: "Doctor",
        email: "doctor@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
      });

      const post = await Post.create({
        author: doctor._id,
        content: "Test",
        visibility: "public",
      });

      // Add comments
      const comment = await Comment.create({
        post: post._id,
        author: doctor._id,
        content: "Test comment",
      });

      // Delete post
      const result = await PostService.deletePost(post._id, doctor._id);
      expect(result).toBe(true);

      // Verify post is deleted
      const deletedPost = await Post.findById(post._id);
      expect(deletedPost).toBeNull();

      // Verify comment is deleted
      const deletedComment = await Comment.findById(comment._id);
      expect(deletedComment).toBeNull();
    });

    it("should prevent deletion by non-owner", async () => {
      const doctor = await User.create({
        fullName: "Doctor",
        email: "doctor@test.com",
        password: "password123",
        role: ROLES.DOCTOR,
      });

      const patient = await User.create({
        fullName: "Patient",
        email: "patient@test.com",
        password: "password123",
        role: ROLES.PATIENT,
      });

      const post = await Post.create({
        author: doctor._id,
        content: "Test",
        visibility: "public",
      });

      try {
        await PostService.deletePost(post._id, patient._id);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.statusCode).toBe(403);
      }
    });
  });
});
