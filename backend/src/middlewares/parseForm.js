import multer from "multer";

const upload = multer();

export const parseForm = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";

  // ── Defense in depth: never parse multipart with upload.none() ──
  // Multipart requests must be handled by the main Multer middleware
  // (uploadMiddleware.patient, uploadMiddleware.doctor, uploadMiddleware.post)
  // parseForm/upload.none() is ONLY for non-multipart form submissions
  if (contentType.includes("multipart/form-data")) {
    return next(); // Skip — let the route's Multer middleware handle it
  }

  // For non-multipart requests (text-only form data), parse as urlencoded
  return upload.none()(req, res, next);
};
