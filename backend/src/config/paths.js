import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UPLOADS_ROOT = path.resolve(process.cwd(), "Uploads");

export const UPLOAD_DIRS = Object.freeze([
  "Certificates",
  "PersonalPhoto",
  "Radiology",
  "LabTests",
  "Posts",
].map((d) => path.join(UPLOADS_ROOT, d)));
