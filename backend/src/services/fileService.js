import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execFile } from "child_process";
import { promisify } from "util";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";

const execFileAsync = promisify(execFile);
const FILE_PERMISSIONS = 0o640;
const DIR_PERMISSIONS = 0o750;
const UPLOADS_ROOT = path.resolve(
  process.cwd(),
  process.env.UPLOAD_DIR || "./uploads",
);

// ─── Virus Scan ──────────────────────────────────────────────────
const scanFile = async (filePath) => {
  try {
    await execFileAsync("clamdscan", ["--no-summary", "--stdout", filePath]);
    return { clean: true };
  } catch (error) {
    if (error.code === 1) {
      return { clean: false, virus: "Malware detected" };
    }
    // If clamdscan is not installed, log warning but allow
    console.warn("Virus scan unavailable:", error.message);
    return { clean: true };
  }
};

// ─── Path Resolution ───────────────────────────────────────────────
export const resolveUploadPath = (subFolder, fileName) => {
  const targetDir = path.join(UPLOADS_ROOT, subFolder);
  const filePath = path.join(targetDir, fileName);
  const resolved = path.resolve(filePath);

  // Prevent path traversal
  if (!resolved.startsWith(UPLOADS_ROOT)) {
    throw new AppError(msg("مسار غير صالح", "Invalid path"), 400);
  }
  return { targetDir, resolved };
};

// ─── Core File Operations ──────────────────────────────────────────
export const saveFile = async (file, subFolder, role = "user") => {
  if (!file?.buffer && !file?.path) return null;

  const extension = path.extname(file.originalname || "") || ".jpg";
  const fileName = `${role}-${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension.toLowerCase()}`;

  const { targetDir, resolved } = resolveUploadPath(subFolder, fileName);

  await fs.promises.mkdir(targetDir, {
    recursive: true,
    mode: DIR_PERMISSIONS,
  });

  // If file has buffer (memory), write it. If it has path (disk), move it.
  if (file.buffer) {
    await fs.promises.writeFile(resolved, file.buffer, {
      mode: FILE_PERMISSIONS,
    });
  } else if (file.path) {
    await fs.promises.copyFile(file.path, resolved);
    await fs.promises.unlink(file.path); // Delete temp file
  }

  return path.posix.join("uploads", subFolder, fileName);
};

export const deleteFile = async (filePath) => {
  if (!filePath) return true;
  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);
  try {
    await fs.promises.unlink(fullPath);
    return true;
  } catch (err) {
    if (err.code === "ENOENT") return true;
    console.error(`Failed to delete ${filePath}:`, err.message);
    return false;
  }
};

export const cleanupFiles = async (filePaths) => {
  const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
  const results = [];
  for (const filePath of paths) {
    if (!filePath) {
      results.push({ path: filePath, success: true });
      continue;
    }
    const success = await deleteFile(filePath);
    results.push({ path: filePath, success });
  }
  return results;
};

// ─── Process Uploaded Files with Security ─────────────────────────
export const processFiles = async (files, options = {}) => {
  const {
    subFolder = "general",
    role = "user",
    allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"],
    maxFileSize = 10 * 1024 * 1024, // 10MB
    maxFiles = 10,
    requireScan = false,
  } = options;

  if (!files?.length) return [];
  if (files.length > maxFiles) {
    throw new AppError(
      msg(`الحد الأقصى ${maxFiles} ملفات`, `Maximum ${maxFiles} files allowed`),
      400,
    );
  }

  return Promise.all(
    files.map(async (file) => {
      // Check file size
      const size = file.size || file.buffer?.length || 0;
      if (size > maxFileSize) {
        throw new AppError(
          msg(
            "حجم الملف كبير جداً",
            `File too large. Max: ${maxFileSize / 1024 / 1024}MB`,
          ),
          400,
        );
      }

      // Check extension
      const extension = path.extname(file.originalname || "").toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        throw new AppError(
          msg(
            "نوع الملف غير مدعوم",
            `Invalid type. Allowed: ${allowedExtensions.join(", ")}`,
          ),
          400,
        );
      }

      // Virus scan (optional)
      if (requireScan && file.path) {
        const scanResult = await scanFile(file.path);
        if (!scanResult.clean) {
          await deleteFile(file.path);
          throw new AppError(
            msg("الملف يحتوي على برمجية خبيثة", "File contains malware"),
            400,
          );
        }
      }

      // Save file
      const savedPath = await saveFile(file, subFolder, role);
      return {
        originalName: file.originalname,
        path: savedPath,
        size,
        extension,
      };
    }),
  );
};

// ─── Specific File Processors ────────────────────────────────────────
export const processRadiologyTests = async (files, descriptions) => {
  const results = await processFiles(files, {
    subFolder: "radiology",
    role: "patient",
    allowedExtensions: [".jpg", ".jpeg", ".png", ".dcm", ".pdf"],
    maxFileSize: 20 * 1024 * 1024, // 20MB for medical images
  });

  return results.map((result, index) => ({
    image: result.path,
    description: descriptions?.[index] || "",
    date: new Date(),
    archived: false,
  }));
};

export const processLabTests = async (files, descriptions) => {
  const results = await processFiles(files, {
    subFolder: "labTests",
    role: "patient",
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".csv", ".xlsx"],
    maxFileSize: 10 * 1024 * 1024,
  });

  return results.map((result, index) => ({
    image: result.path,
    description: descriptions?.[index] || "",
    uploadedAt: new Date(),
    archived: false,
  }));
};

export const processPostImages = async (files) => {
  return processFiles(files, {
    subFolder: "posts",
    role: "post",
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 10,
  });
};

export const processArticleImage = async (file) => {
  if (!file) {
    throw new AppError(msg("لم يتم رفع ملف", "No file provided"), 400);
  }

  const results = await processFiles([file], {
    subFolder: "articles",
    role: "article",
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 1,
  });

  return results[0];
};

export const processDoctorFiles = async (files) => {
  return processFiles(files, {
    subFolder: "certificates",
    role: "doctor",
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png"],
    maxFileSize: 10 * 1024 * 1024,
    maxFiles: 5,
  });
};
