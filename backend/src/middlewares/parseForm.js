import multer from "multer";
import express from "express";

const upload = multer();
const urlencodedParser = express.urlencoded({ extended: true });

export const parseForm = (req, res, next) => {
  const contentType = (req.headers["content-type"] || "").toLowerCase();

  // Multipart form-data (with or without files)
  if (contentType.includes("multipart/form-data")) {
    return upload.none()(req, res, next);
  }

  // URL-encoded form data
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return urlencodedParser(req, res, next);
  }

  // JSON or other — let app.js handle it
  next();
};
