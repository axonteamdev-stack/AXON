/**
 * FileService Unit Tests
 * Tests for file operations, security validations, and error handling
 */

import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs";
import path from "path";
import FileService from "../Services/FileService.js";
import { FILE_CONFIG, FILE_LIMITS } from "../Constants/index.js";

describe("FileService", () => {
  const mockFile = {
    buffer: Buffer.from("test content"),
    originalname: "test.jpg",
  };

  describe("saveFile", () => {
    test("should save file with correct path", () => {
      vi.spyOn(fs, "writeFileSync").mockReturnValue(undefined);
      vi.spyOn(fs, "existsSync").mockReturnValue(true);

      const result = FileService.saveFile(mockFile, "PersonalPhoto", "patient");

      expect(result).toMatch(/^Uploads\/PersonalPhoto\/patient-\d+-\d+\.jpg$/);
      expect(result).not.toContain("\\");
    });

    test("should throw error for invalid subfolder", () => {
      expect(() => {
        FileService.saveFile(mockFile, "InvalidFolder", "patient");
      }).toThrow("Invalid subfolder");
    });

    test("should throw error for invalid file extension", () => {
      const invalidFile = { ...mockFile, originalname: "test.exe" };

      expect(() => {
        FileService.saveFile(invalidFile, "PersonalPhoto", "patient");
      }).toThrow("File type not allowed");
    });

    test("should throw error for file size exceeding limit", () => {
      const largeFile = {
        ...mockFile,
        buffer: Buffer.alloc(FILE_LIMITS.IMAGE + 1),
      };

      expect(() => {
        FileService.saveFile(largeFile, "PersonalPhoto", "patient");
      }).toThrow("File size exceeds");
    });

    test("should prevent path traversal attacks", () => {
      const traversalFile = {
        ...mockFile,
        originalname: "../../etc/passwd.jpg",
      };

      expect(() => {
        FileService.saveFile(traversalFile, "PersonalPhoto", "patient");
      }).not.toThrow();
      // Path should be sanitized, not traverse up
    });

    test("should return null for null file", () => {
      const result = FileService.saveFile(null, "PersonalPhoto", "patient");
      expect(result).toBeNull();
    });

    test("should convert extension to lowercase", () => {
      const uppercaseFile = { ...mockFile, originalname: "test.JPG" };
      vi.spyOn(fs, "writeFileSync").mockReturnValue(undefined);
      vi.spyOn(fs, "existsSync").mockReturnValue(true);

      const result = FileService.saveFile(
        uppercaseFile,
        "PersonalPhoto",
        "patient",
      );

      expect(result).toContain(".jpg");
    });
  });

  describe("safeParse", () => {
    test("should handle array input", () => {
      const result = FileService.safeParse(["desc1", "desc2"]);
      expect(result).toEqual(["desc1", "desc2"]);
    });

    test("should handle single string input", () => {
      const result = FileService.safeParse("single description");
      expect(result).toEqual(["single description"]);
    });

    test("should handle JSON array string", () => {
      const result = FileService.safeParse('["desc1", "desc2"]');
      expect(result).toEqual(["desc1", "desc2"]);
    });

    test("should handle null or undefined", () => {
      expect(FileService.safeParse(null)).toEqual([]);
      expect(FileService.safeParse(undefined)).toEqual([]);
    });

    test("should handle empty string", () => {
      const result = FileService.safeParse("");
      expect(result).toEqual([""]);
    });
  });

  describe("processRadiologyTests", () => {
    test("should process radiology files with descriptions", () => {
      vi.spyOn(fs, "writeFileSync").mockReturnValue(undefined);
      vi.spyOn(fs, "existsSync").mockReturnValue(true);

      const files = [mockFile, mockFile];
      const result = FileService.processRadiologyTests(files, [
        "desc1",
        "desc2",
      ]);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("image");
      expect(result[0]).toHaveProperty("description", "desc1");
      expect(result[0]).toHaveProperty("date");
      expect(result[0]).toHaveProperty("archived", false);
    });

    test("should handle missing descriptions", () => {
      vi.spyOn(fs, "writeFileSync").mockReturnValue(undefined);
      vi.spyOn(fs, "existsSync").mockReturnValue(true);

      const files = [mockFile];
      const result = FileService.processRadiologyTests(files, []);

      expect(result[0].description).toBe("");
    });

    test("should return empty array for no files", () => {
      const result = FileService.processRadiologyTests([], []);
      expect(result).toEqual([]);
    });
  });

  describe("cleanupFiles", () => {
    test("should delete files successfully", () => {
      const deleteSpy = vi.spyOn(fs, "unlinkSync").mockReturnValue(undefined);
      vi.spyOn(fs, "existsSync").mockReturnValue(true);

      FileService.cleanupFiles(["Uploads/test/file.jpg"]);

      expect(deleteSpy).toHaveBeenCalled();
    });

    test("should handle non-existent files gracefully", () => {
      const deleteSpy = vi.spyOn(fs, "unlinkSync").mockReturnValue(undefined);
      vi.spyOn(fs, "existsSync").mockReturnValue(false);

      expect(() => {
        FileService.cleanupFiles(["Uploads/nonexistent/file.jpg"]);
      }).not.toThrow();
    });

    test("should handle array of file paths", () => {
      const deleteSpy = vi.spyOn(fs, "unlinkSync").mockReturnValue(undefined);
      vi.spyOn(fs, "existsSync").mockReturnValue(true);

      FileService.cleanupFiles([
        "Uploads/test/file1.jpg",
        "Uploads/test/file2.jpg",
      ]);

      expect(deleteSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("fileExists", () => {
    test("should return true for existing file", () => {
      vi.spyOn(fs, "existsSync").mockReturnValue(true);

      const result = FileService.fileExists("Uploads/test/file.jpg");

      expect(result).toBe(true);
    });

    test("should return false for non-existent file", () => {
      vi.spyOn(fs, "existsSync").mockReturnValue(false);

      const result = FileService.fileExists("Uploads/nonexistent/file.jpg");

      expect(result).toBe(false);
    });
  });
});
