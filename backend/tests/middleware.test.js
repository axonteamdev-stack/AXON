import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import mongoose from "mongoose";
import User from "../src/models/userModel.js";
import { protect, authorize } from "../src/middlewares/auth.js";
import { errorHandler } from "../src/middlewares/errorHandler.js";
import { checkOwnership } from "../src/middlewares/checkOwnership.js";
import { validateRequest } from "../src/middlewares/validate.js";
import AppError from "../src/utils/appError.js";
import { v4 as uuidv4 } from "uuid";

describe("Middleware Test Suite", () => {
  describe("Auth Middleware", () => {
    let testUser;
    let req, res, next;
    let token;

    beforeEach(async () => {
      testUser = await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hashedPassword",
        role: "patient",
      });

      token = generateTestToken(testUser._id);

      req = {
        headers: { authorization: `Bearer ${token}` },
        requestId: uuidv4(),
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it("should authenticate with valid token", async () => {
      await protect(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.id).toBe(testUser._id.toString());
      expect(next).toHaveBeenCalled();
    });

    it("should reject request without token", async () => {
      req.headers.authorization = "";

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should reject request with invalid token", async () => {
      req.headers.authorization = "Bearer invalid-token";

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should reject expired token", async () => {
      const expiredToken = generateTestToken(testUser._id, "1ms");
      req.headers.authorization = `Bearer ${expiredToken}`;

      await new Promise((resolve) => setTimeout(resolve, 50));

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should handle malformed authorization header", async () => {
      req.headers.authorization = "InvalidFormat";

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should throw error if user no longer exists", async () => {
      await User.findByIdAndDelete(testUser._id);

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("Authorization Middleware", () => {
    let testUser, req, res, next;

    beforeEach(async () => {
      testUser = await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hashedPassword",
        role: "patient",
      });

      req = {
        user: { id: testUser._id.toString(), role: testUser.role },
        requestId: uuidv4(),
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it("should allow authorized user", () => {
      const authMiddleware = authorize("patient", "doctor");

      authMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should reject unauthorized user", () => {
      const authMiddleware = authorize("admin");

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should allow admin access to any resource", async () => {
      testUser.role = "admin";
      await testUser.save();

      req.user.role = "admin";

      const authMiddleware = authorize("patient", "doctor");

      authMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should handle missing user", () => {
      req.user = null;

      const authMiddleware = authorize("patient");

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe("Check Ownership Middleware", () => {
    let user1, user2;
    let req, res, next;

    beforeEach(async () => {
      user1 = await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hashedPassword",
      });

      user2 = await User.create({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        password: "hashedPassword",
      });

      req = {
        user: { id: user1._id.toString() },
        params: { userId: user1._id.toString() },
        requestId: uuidv4(),
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it("should allow owner access", () => {
      checkOwnership(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should deny non-owner access", () => {
      req.user.id = user2._id.toString();

      checkOwnership(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should allow admin bypass", async () => {
      req.user.role = "admin";

      checkOwnership(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("Validate Request Middleware", () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        body: {},
        params: {},
        query: {},
        requestId: uuidv4(),
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it("should pass valid data", () => {
      const schema = { email: "user@example.com", password: "Pass123!" };
      req.body = schema;

      validateRequest("body", schema)(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should reject invalid data", () => {
      req.body = { email: "invalid-email" };

      validateRequest("body", { email: "user@example.com" })(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should validate query parameters", () => {
      req.query = { page: "1", limit: "10" };

      validateRequest("query", { page: "1", limit: "10" })(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should validate URL parameters", () => {
      req.params = { id: "507f1f77bcf86cd799439011" };

      validateRequest("params", { id: "507f1f77bcf86cd799439011" })(
        req,
        res,
        next,
      );

      expect(next).toHaveBeenCalled();
    });

    it("should provide detailed validation errors", () => {
      req.body = { email: "invalid" };

      validateRequest("body")(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("validation"),
        }),
      );
    });
  });

  describe("Error Handler Middleware", () => {
    let req, res;

    beforeEach(() => {
      req = { requestId: uuidv4() };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it("should handle operational errors", () => {
      const error = new AppError("User not found", 404);

      errorHandler(error, req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "User not found",
        }),
      );
    });

    it("should handle non-operational errors", () => {
      const error = new Error("Programming error");

      errorHandler(error, req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
        }),
      );
    });

    it("should handle MongoDB duplicate key error", () => {
      const error = new Error("Duplicate key");
      error.code = 11000;

      errorHandler(error, req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should handle MongoDB validation errors", () => {
      const error = new Error("Validation failed");
      error.name = "ValidationError";

      errorHandler(error, req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should include request ID in error response", () => {
      const error = new AppError("Test error", 400);

      errorHandler(error, req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          requestId: req.requestId,
        }),
      );
    });

    it("should not expose sensitive error details in production", () => {
      process.env.NODE_ENV = "production";
      const error = new Error("Database connection failed");

      errorHandler(error, req, res);

      const responseBody = res.json.mock.calls[0][0];
      expect(responseBody.message).not.toContain("Database");
    });

    it("should handle bilingual error messages", () => {
      const error = new AppError(
        { en: "User not found", ar: "المستخدم غير موجود" },
        404,
      );

      errorHandler(error, req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.objectContaining({
            en: "User not found",
            ar: "المستخدم غير موجود",
          }),
        }),
      );
    });
  });

  describe("Request ID Middleware", () => {
    it("should generate request ID if not provided", (req, res, next) => {
      const {
        requestId: middleware,
      } = require("../src/middlewares/requestId.js");

      req = { headers: {} };
      res = {};
      next = jest.fn();

      middleware(req, res, next);

      expect(req.requestId).toBeDefined();
      expect(typeof req.requestId).toBe("string");
      expect(next).toHaveBeenCalled();
    });

    it("should use existing request ID from header", (req, res, next) => {
      const {
        requestId: middleware,
      } = require("../src/middlewares/requestId.js");

      const existingId = uuidv4();
      req = { headers: { "x-request-id": existingId } };
      res = {};
      next = jest.fn();

      middleware(req, res, next);

      expect(req.requestId).toBe(existingId);
      expect(next).toHaveBeenCalled();
    });
  });
});

// Helper function to generate test token
function generateTestToken(userId, expiresIn = "24h") {
  const jwt = require("jsonwebtoken");
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "test-secret", {
    expiresIn,
  });
}
