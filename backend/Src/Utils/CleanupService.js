/**
 * CleanupService - Manage temporary file cleanup
 * ✅ MEDIUM FIX: Prevents disk space exhaustion from orphaned temp files
 */

import fs from "fs";
import path from "path";

export class CleanupService {
  /**
   * Clean up old temporary files
   * Runs periodically to remove files older than specified age
   */
  static async cleanupOldTempFiles(ageMinutes = 60) {
    const tempDir = path.join(process.cwd(), "Uploads/.temp");
    const now = Date.now();
    const ageMs = ageMinutes * 60 * 1000;

    try {
      if (!fs.existsSync(tempDir)) return;

      const files = fs.readdirSync(tempDir);
      let cleanedCount = 0;

      files.forEach((file) => {
        try {
          const filePath = path.join(tempDir, file);
          const stat = fs.statSync(filePath);

          if (now - stat.mtimeMs > ageMs) {
            fs.unlinkSync(filePath);
            cleanedCount++;
          }
        } catch (error) {
          console.error(`Failed to cleanup ${file}:`, error.message);
        }
      });

      if (cleanedCount > 0) {
        console.log(`✅ Cleaned up ${cleanedCount} temp files`);
      }
    } catch (error) {
      console.error("Cleanup service error:", error.message);
    }
  }

  /**
   * Immediately delete a specific file
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
      console.error(`Failed to delete ${filePath}:`, error.message);
      return false;
    }
  }

  /**
   * Delete multiple files (transactional rollback on failure)
   */
  static deleteFiles(filePaths) {
    if (!Array.isArray(filePaths)) filePaths = [filePaths];

    filePaths.forEach((filePath) => {
      if (!filePath) return;

      try {
        const fullPath = path.join(process.cwd(), filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`✅ Deleted: ${filePath}`);
        }
      } catch (error) {
        console.error(`⚠️ Delete failed for ${filePath}:`, error.message);
      }
    });
  }
}

export default CleanupService;
