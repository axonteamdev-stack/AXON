import app from "./app.js";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "Uploads", "Certificates");
const personalPhotoDir = path.join(__dirname, "Uploads", "PersonalPhoto");
const radiologyDir = path.join(__dirname, "Uploads", "Radiology");

const createDirIfNotExists = (dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  } catch (err) {
    console.error(`Failed to create directory ${dir}:`, err);
  }
};

createDirIfNotExists(uploadDir);
createDirIfNotExists(personalPhotoDir);
createDirIfNotExists(radiologyDir);

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close(() => process.exit(0));
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
