import multer from "multer";

const upload = multer();

export const parseForm = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) {
    return upload.none()(req, res, next);
  }
  next(); // Let JSON pass through untouched
};  
