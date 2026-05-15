import multer from "multer";

const upload = multer();

export const parseForm = upload.none();
