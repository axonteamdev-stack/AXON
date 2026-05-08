import { describe, it, expect, beforeEach } from "@jest/globals";
import {
  paginationHelper,
  sanitizeInput,
  parseQuery,
  getTimeRange,
  formatResponse,
} from "../src/utils/index.js";
import AppError from "../src/utils/appError.js";
import { validate as validateWithZod } from "zod";

describe("Utilities Test Suite", () => {
  describe("Pagination Helper", () => {
    it("should calculate pagination correctly", () => {
      const pagination = paginationHelper(2, 10, 50);

      expect(pagination.page).toBe(2);
      expect(pagination.limit).toBe(10);
      expect(pagination.skip).toBe(10);
      expect(pagination.totalPages).toBe(5);
      expect(pagination.hasNextPage).toBe(true);
      expect(pagination.hasPreviousPage).toBe(true);
    });

    it("should handle first page", () => {
      const pagination = paginationHelper(1, 10, 50);

      expect(pagination.skip).toBe(0);
      expect(pagination.hasPreviousPage).toBe(false);
      expect(pagination.hasNextPage).toBe(true);
    });

    it("should handle last page", () => {
      const pagination = paginationHelper(5, 10, 50);

      expect(pagination.hasNextPage).toBe(false);
      expect(pagination.hasPreviousPage).toBe(true);
    });

    it("should use default limits", () => {
      const pagination = paginationHelper(1);

      expect(pagination.limit).toBe(10);
    });

    it("should clamp page to minimum 1", () => {
      const pagination = paginationHelper(0, 10, 50);

      expect(pagination.page).toBe(1);
      expect(pagination.skip).toBe(0);
    });

    it("should handle invalid input gracefully", () => {
      const pagination = paginationHelper("2", "10", 50);

      expect(typeof pagination.page).toBe("number");
      expect(typeof pagination.limit).toBe("number");
    });
  });

  describe("Sanitize Input", () => {
    it("should remove XSS attempts", () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(input);

      expect(sanitized).not.toContain("<script>");
    });

    it("should preserve normal text", () => {
      const input = "Hello World";
      const sanitized = sanitizeInput(input);

      expect(sanitized).toBe("Hello World");
    });

    it("should remove HTML tags", () => {
      const input = "<p>Hello</p>";
      const sanitized = sanitizeInput(input);

      expect(sanitized).not.toContain("<p>");
    });

    it("should handle SQL injection attempts", () => {
      const input = "'; DROP TABLE users; --";
      const sanitized = sanitizeInput(input);

      expect(sanitized).toBeDefined();
    });

    it("should handle empty string", () => {
      const sanitized = sanitizeInput("");

      expect(sanitized).toBe("");
    });

    it("should trim whitespace", () => {
      const input = "  Hello  ";
      const sanitized = sanitizeInput(input);

      expect(sanitized).toBe("Hello");
    });
  });

  describe("Parse Query", () => {
    it("should parse simple query", () => {
      const query = { search: "test", page: "1" };
      const parsed = parseQuery(query);

      expect(parsed.search).toBe("test");
      expect(parsed.page).toBe(1);
    });

    it("should parse filter arrays", () => {
      const query = { status: ["active", "pending"] };
      const parsed = parseQuery(query);

      expect(Array.isArray(parsed.status)).toBe(true);
    });

    it("should convert numeric strings", () => {
      const query = { limit: "50", offset: "100" };
      const parsed = parseQuery(query);

      expect(parsed.limit).toBe(50);
      expect(parsed.offset).toBe(100);
    });

    it("should convert boolean strings", () => {
      const query = { active: "true", archived: "false" };
      const parsed = parseQuery(query);

      expect(parsed.active).toBe(true);
      expect(parsed.archived).toBe(false);
    });

    it("should handle date ranges", () => {
      const query = { startDate: "2026-01-01", endDate: "2026-12-31" };
      const parsed = parseQuery(query);

      expect(parsed.startDate instanceof Date).toBe(true);
      expect(parsed.endDate instanceof Date).toBe(true);
    });
  });

  describe("Time Range Helper", () => {
    it("should get current day range", () => {
      const range = getTimeRange("day");

      expect(range.start instanceof Date).toBe(true);
      expect(range.end instanceof Date).toBe(true);
      expect(range.end > range.start).toBe(true);
    });

    it("should get current week range", () => {
      const range = getTimeRange("week");

      expect(range.start instanceof Date).toBe(true);
      expect(range.end instanceof Date).toBe(true);
    });

    it("should get current month range", () => {
      const range = getTimeRange("month");

      expect(range.start instanceof Date).toBe(true);
      expect(range.end instanceof Date).toBe(true);
    });

    it("should get current year range", () => {
      const range = getTimeRange("year");

      expect(range.start instanceof Date).toBe(true);
      expect(range.end instanceof Date).toBe(true);
    });

    it("should get custom date range", () => {
      const start = new Date("2026-01-01");
      const end = new Date("2026-12-31");
      const range = getTimeRange("custom", start, end);

      expect(range.start).toEqual(start);
      expect(range.end).toEqual(end);
    });
  });

  describe("Format Response", () => {
    it("should format success response", () => {
      const response = formatResponse({
        status: "success",
        data: { id: 1, name: "Test" },
      });

      expect(response.status).toBe("success");
      expect(response.data).toBeDefined();
      expect(response.timestamp).toBeDefined();
    });

    it("should format error response", () => {
      const response = formatResponse({
        status: "error",
        message: "Something went wrong",
        code: 500,
      });

      expect(response.status).toBe("error");
      expect(response.message).toBe("Something went wrong");
    });

    it("should include request ID if provided", () => {
      const response = formatResponse({
        status: "success",
        data: {},
        requestId: "req-123",
      });

      expect(response.requestId).toBe("req-123");
    });

    it("should include pagination if provided", () => {
      const response = formatResponse({
        status: "success",
        data: [],
        pagination: { page: 1, limit: 10, total: 50 },
      });

      expect(response.pagination).toBeDefined();
      expect(response.pagination.page).toBe(1);
    });

    it("should add timestamp to response", () => {
      const response = formatResponse({ status: "success", data: {} });

      expect(response.timestamp).toBeDefined();
      expect(new Date(response.timestamp).getTime()).toBeLessThanOrEqual(
        Date.now(),
      );
    });
  });

  describe("AppError Utility", () => {
    it("should create an operational error", () => {
      const error = new AppError("Something went wrong", 400);

      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      expect(error.message).toBe("Something went wrong");
    });

    it("should support bilingual messages", () => {
      const error = new AppError({ en: "Error", ar: "خطأ" }, 400);

      expect(error.message.en).toBe("Error");
      expect(error.message.ar).toBe("خطأ");
    });

    it("should mark programming errors as non-operational", () => {
      const error = new AppError("Programming error", 500, false);

      expect(error.isOperational).toBe(false);
    });

    it("should include status code", () => {
      const error = new AppError("Not found", 404);

      expect(error.statusCode).toBe(404);
    });

    it("should default to 500 status code", () => {
      const error = new AppError("Internal error");

      expect(error.statusCode).toBe(500);
    });
  });

  describe("Aggregation Helper", () => {
    it("should build pagination stage", () => {
      const stage = buildPaginationStage(2, 10);

      expect(stage.$skip).toBe(10);
      expect(stage.$limit).toBe(10);
    });

    it("should build sort stage", () => {
      const stage = buildSortStage({ createdAt: -1 });

      expect(stage.$sort).toBeDefined();
      expect(stage.$sort.createdAt).toBe(-1);
    });

    it("should build match stage", () => {
      const stage = buildMatchStage({ status: "active" });

      expect(stage.$match).toBeDefined();
      expect(stage.$match.status).toBe("active");
    });

    it("should handle empty aggregation", () => {
      const pipeline = [];

      expect(Array.isArray(pipeline)).toBe(true);
    });
  });

  describe("Validation Utilities", () => {
    it("should validate email format", () => {
      const isValid = validateEmail("user@example.com");

      expect(isValid).toBe(true);
    });

    it("should reject invalid email", () => {
      const isValid = validateEmail("invalid-email");

      expect(isValid).toBe(false);
    });

    it("should validate phone number", () => {
      const isValid = validatePhoneNumber("+1234567890");

      expect(isValid).toBe(true);
    });

    it("should validate password strength", () => {
      const result = validatePasswordStrength("StrongPass123!");

      expect(result.isStrong).toBe(true);
    });

    it("should reject weak password", () => {
      const result = validatePasswordStrength("weak");

      expect(result.isStrong).toBe(false);
    });

    it("should validate URL format", () => {
      const isValid = validateURL("https://example.com");

      expect(isValid).toBe(true);
    });
  });
});
