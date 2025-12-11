import app from "./app.js";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Define the uploads directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "Uploads", "Certificates");
const personalPhotoDir = path.join(__dirname, "Uploads", "PersonalPhoto");

// Ensure the Uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created uploads directory: ${uploadDir}`);
}

// التأكد من وجود المجلد
if (!fs.existsSync(personalPhotoDir)) {
  fs.mkdirSync(personalPhotoDir, { recursive: true });
  console.log(`Created personal photo directory: ${personalPhotoDir}`);
}

// Connect to database
connectDB();

const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
