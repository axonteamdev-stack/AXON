
import app from "./app.js";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_PATH =
  process.env.UPLOADS_PATH || path.join(__dirname, "Uploads");

const uploadDir = path.join(UPLOADS_PATH, "Certificates");
const personalPhotoDir = path.join(UPLOADS_PATH, "PersonalPhoto");
const radiologyDir = path.join(UPLOADS_PATH, "Radiology");

const createDirIfNotExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`); // الآن لن تظهر إلا عند الحاجة
  }
};

[uploadDir, personalPhotoDir, radiologyDir].forEach(createDirIfNotExists);

connectDB()
  .then(() => {
    const PORT = process.env.PORT;
    const server = app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close(() => process.exit(0));
    });

    process.on("unhandledRejection", (err) => {
      console.error("Unhandled rejection:", err);
      server.close(() => process.exit(1));
    });

    process.on("uncaughtException", (err) => {
      console.error("Uncaught exception:", err);
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
