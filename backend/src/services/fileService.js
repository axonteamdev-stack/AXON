import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execFile } from "child_process";
import { promisify } from "util";
import AppError from "../utils/appError.js";
import { msg } from "../utils/i18n.js";
import { preventTraversal } from "../utils/sanitize.js";

const execFileAsync = promisify(execFile);
const FILE_PERMISSIONS = 0o640;
const DIR_PERMISSIONS = 0o750;
const UPLOADS_ROOT = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "./uploads");

// ─── Virus Scan ──────────────────────────────────────────────────
const scanFile = async (filePath) => {
  try {
    await execFileAsync("clamdscan", ["--no-summary", "--stdout", filePath]);
    return { clean: true };
  } catch (error) {
    if (error.code === 1) {
      return { clean: false, virus: "Malware detected" };
    }
    throw new Error(`Virus scan failed: ${error.message}`);
  }
};

// ─── Path Resolution ───────────────────────────────────────────────
export const resolveUploadPath = (subFolder, fileName) => {
  const targetDir = path.join(UPLOADS_ROOT, subFolder);
  const filePath = path.join(targetDir, fileName);
  const resolved = path.resolve(filePath);
  preventTraversal(resolved);
  if (!resolved.startsWith(UPLOADS_ROOT)) {
    throw new Error("Path traversal detected");
  }
  return { targetDir, resolved };
};

// ─── Core File Operations ──────────────────────────────────────────
export const saveFile = async (file, subFolder, role = "user") => {
  if (!file?.buffer) return null;

  const extension = path.extname(file.originalname || "") || ".jpg";
  const fileName = `${role}-${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension.toLowerCase()}`;

  const { targetDir, resolved } = resolveUploadPath(subFolder, fileName);

  await fs.promises.mkdir(targetDir, { recursive: true, mode: DIR_PERMISSIONS });
  await fs.promises.writeFile(resolved, file.buffer, { mode: FILE_PERMISSIONS });

  return path.posix.join("uploads", subFolder, fileName);
};

export const deleteFile = async (filePath) => {
  if (!filePath) return true;
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
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

// ─── Radiology Tests ───────────────────────────────────────────────
export const processRadiologyTests = async (files, descriptions, subFolder = "radiology") => {
  if (!files?.length) return [];

  return Promise.all(
    files.map(async (file, index) => {
      const scanResult = await scanFile(file.path);
      if (!scanResult.clean) {
        await deleteFile(file.path);
        throw new AppError(msg("الملف يحتوي على برمجية خبيثة", "File contains malware"), 400);
      }

      const extension = path.extname(file.originalname || "").toLowerCase();
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".dcm", ".pdf"];
      if (!allowedExtensions.includes(extension)) {
        throw new AppError(
          msg("نوع الملف غير مدعوم", `Invalid file type. Allowed: ${allowedExtensions.join(", ")}`),
          400
        );
      }

      return {
        image: await saveFile(file, subFolder, "patient"),
        description: descriptions?.[index] || "",
        date: new Date(),
        archived: false,
      };
    })
  );
};

// ─── Lab Tests ─────────────────────────────────────────────────────
export const processLabTests = async (files, descriptions, subFolder = "labTests") => {
  if (!files?.length) return [];

  return Promise.all(
    files.map(async (file, index) => {
      const scanResult = await scanFile(file.path);
      if (!scanResult.clean) {
        await deleteFile(file.path);
        throw new AppError(msg("الملف يحتوي على برمجية خبيثة", "File contains malware"), 400);
      }

      const extension = path.extname(file.originalname || "").toLowerCase();
      const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".csv", ".xlsx"];
      if (!allowedExtensions.includes(extension)) {
        throw new AppError(
          msg("نوع الملف غير مدعوم", `Invalid file type. Allowed: ${allowedExtensions.join(", ")}`),
          400
        );
      }

      return {
        image: await saveFile(file, subFolder, "patient"),
        description: descriptions?.[index] || "",
        uploadedAt: new Date(),
        archived: false,
      };
    })
  );
};

// ─── Post Images ───────────────────────────────────────────────────
export const processPostImages = async (files, subFolder = "posts") => {
  if (!files?.length) return [];
  if (files.length > 10) {
    throw new Error("Maximum 10 images allowed");
  }

  return Promise.all(
    files.map(async (file) => {
      const scanResult = await scanFile(file.path);
      if (!scanResult.clean) {
        await deleteFile(file.path);
        throw new AppError(msg("الملف يحتوي على برمجية خبيثة", "File contains malware"), 400);
      }
      return saveFile(file, subFolder, "post");
    })
  );
};

// ─── Article/Blog Image ────────────────────────────────────────────
export const processArticleImage = async (file, subFolder = "articles") => {
  if (!file?.buffer) {
    return { success: false, error: "No file provided" };
  }

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const maxFileSize = 5 * 1024 * 1024;

  const extension = path.extname(file.originalname || "").toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return {
      originalName: file.originalname,
      success: false,
      error: `Invalid image type. Allowed: ${allowedExtensions.join(", ")}`,
    };
  }

  if (file.size > maxFileSize) {
    return {
      originalName: file.originalname,
      success: false,
      error: `Image too large. Max size: ${maxFileSize / (1024 * 1024)}MB`,
    };
  }

  try {
    const savedPath = await saveFile(file, subFolder, "article");
    return {
      originalName: file.originalname,
      success: true,
      path: savedPath,
      type: "article",
      size: file.size,
    };
  } catch (err) {
    return {
      originalName: file.originalname,
      success: false,
      error: err.message,
    };
  }
};
