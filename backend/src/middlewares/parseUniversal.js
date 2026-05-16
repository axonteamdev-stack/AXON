import multer from "multer";
import express from "express";
import fs from "fs";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";

const urlencoded = express.urlencoded({ extended: true });
const upload = multer({ dest: "uploads/.temp" }).any();

export const parseUniversal =
  (fileFields = []) =>
  (req, res, next) => {
    const ct = (req.headers["content-type"] || "").toLowerCase();

    if (ct.includes("application/json")) return next();
    if (ct.includes("application/x-www-form-urlencoded"))
      return urlencoded(req, res, next);
    if (!ct.includes("multipart/form-data")) return next();

    upload(req, res, (err) => {
      if (err) {
        req.files?.forEach(
          (f) => f.path && fs.existsSync(f.path) && fs.unlinkSync(f.path),
        );
        return next(
          new AppError(msg("فشل في المعالجة", "Processing failed"), 400),
        );
      }

      if (req.files && fileFields.length) {
        for (const file of req.files) {
          if (!fileFields.includes(file.fieldname)) {
            req.files.forEach(
              (f) => f.path && fs.existsSync(f.path) && fs.unlinkSync(f.path),
            );
            return next(
              new AppError(
                msg("حقل ملف غير مسموح", "File field not allowed"),
                400,
              ),
            );
          }
        }
      }

      // Normalize array format to object format for compatibility
      if (req.files && Array.isArray(req.files)) {
        const normalized = {};
        req.files.forEach((file) => {
          if (!normalized[file.fieldname]) normalized[file.fieldname] = [];
          normalized[file.fieldname].push(file);
        });
        req.files = normalized;
      }

      next();
    });
  };
