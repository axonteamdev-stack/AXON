/**
 * FileService - Centralized file handling with security validations
 * Handles all file operations: saving, cleanup, validation
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import AppError from "../Utils/AppError.js";
import { msg } from "../Utils/ResponseHelper.js";
import { FILE_CONFIG, FILE_LIMITS } from "../Constants/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class FileService {
  /**
   * Sanitized file saving with security validations
   * - Path traversal prevention
   * - Extension whitelisting
   * - File size limits
   * - Disk space checking
   */
  static saveFile(file, subFolder, role = "user") {
    if (!file || !file.buffer) return null;

    try {
      // 1. Validate subfolder (whitelist approach)
      if (!FILE_CONFIG.VALID_FOLDERS.includes(subFolder)) {
        throw new Error("Invalid subfolder");
      }

      // 2. Validate and sanitize extension
      let extension = path.extname(file.originalname) || ".jpg";
      if (!FILE_CONFIG.ALLOWED_EXTENSIONS.includes(extension.toLowerCase())) {
        throw new Error("File type not allowed");
      }

      // 3. Check file size limit
      const fileSizeLimit =
        subFolder === "Certificates"
          ? FILE_LIMITS.CERTIFICATE
          : FILE_LIMITS.IMAGE;

      if (file.buffer.length > fileSizeLimit) {
        throw new Error(
          `File size exceeds ${fileSizeLimit / 1024 / 1024}MB limit`,
        );
      }

      // 4. Generate safe filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `${role}-${uniqueSuffix}${extension.toLowerCase()}`;
      const targetDir = path.join(
        process.cwd(),
        FILE_CONFIG.UPLOAD_BASE_PATH,
        subFolder,
      );

      // 5. Create directory if not exists
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true, mode: 0o755 });
      }

      // 6. Construct and validate full path (path traversal prevention)
      const filePath = path.join(targetDir, fileName);
      const resolvedPath = path.resolve(filePath);
      const uploadsPath = path.resolve(
        path.join(process.cwd(), FILE_CONFIG.UPLOAD_BASE_PATH),
      );

      if (!resolvedPath.startsWith(uploadsPath)) {
        throw new Error("Path traversal detected");
      }

      // 7. Check disk space before writing
      const stats = fs.statfsSync(targetDir);
      const availableSpace = stats.bavail * stats.bsize;
      if (file.buffer.length > availableSpace) {
        throw new Error("Insufficient disk space");
      }

      // 8. Write file with secure permissions
      fs.writeFileSync(resolvedPath, file.buffer, { mode: 0o644 });

      // 9. Return path with forward slashes (cross-platform compatibility)
      return `${FILE_CONFIG.UPLOAD_BASE_PATH}/${subFolder}/${fileName}`.replace(
        /\\/g,
        "/",
      );
    } catch (error) {
      console.error(`File write failed: ${error.message}`);
      throw new AppError(
        msg("فشل حفظ الملف. يرجى المحاولة لاحقاً", "File upload failed. Please try again later."),
        500,
      );
    }
  }

  /**
   * Process radiology test files and descriptions
   * Maps files to their corresponding descriptions
   */
  static processRadiologyTests(files, descriptions) {
    if (!files || files.length === 0) return [];

    const descs = this.safeParse(descriptions);

    return files.map((file, index) => ({
      image: this.saveFile(file, "Radiology", "patient"),
      description: descs[index] || "",
      date: new Date(),
      archived: false,
    }));
  }

  /**
   * Process lab test files and descriptions
   */
  static processLabTests(files, descriptions) {
    if (!files || files.length === 0) return [];

    const descs = this.safeParse(descriptions);

    return files.map((file, index) => ({
      image: this.saveFile(file, "LabTests", "patient"),
      description: descs[index] || "",
      uploadedAt: new Date(),
      archived: false,
    }));
  }

  /**
   * Process post images
   */
  static processPostImages(files) {
    if (!files || files.length === 0) return [];

    if (files.length > FILE_LIMITS.MAX_POST_IMAGES) {
      throw new Error(`Maximum ${FILE_LIMITS.MAX_POST_IMAGES} images allowed`);
    }

    return files.map((file) => this.saveFile(file, "Posts", "post"));
  }

  /**
   * Clean up files on failure (transactional rollback)
   */
  static cleanupFiles(filePaths) {
    if (!Array.isArray(filePaths)) filePaths = [filePaths];

    filePaths.forEach((filePath) => {
      if (!filePath) return;

      try {
        const fullPath = path.join(process.cwd(), filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`✅ Cleaned up: ${filePath}`);
        }
      } catch (error) {
        console.error(`⚠️ Cleanup failed for ${filePath}:`, error.message);
      }
    });
  }

  /**
   * Safe parser for form data
   * Handles arrays, strings, and JSON strings
   */
  static safeParse(data) {
    if (!data) return [];

    // 1. Already an array
    if (Array.isArray(data)) return data;

    // 2. Try to parse as JSON
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      // 3. Return as single-element array
      return [data];
    }
  }

  /**
   * Delete file with error handling
   */
  static deleteFile(filePath) {
    try {
      if (!filePath) return true;

      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
      return true;
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error.message);
      return false;
    }
  }

  /**
   * Validate file exists and is accessible
   */
  static fileExists(filePath) {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      return fs.existsSync(fullPath);
    } catch (error) {
      return false;
    }
  }
}

export default FileService;
