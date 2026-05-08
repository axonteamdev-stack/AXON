import path from "path";
import fs from "fs";

class UploadService {
    static saveFile(file, folder, prefix = "") {
        const fileName = `${prefix}-${Date.now()}${path.extname(file.originalname)}`;
        const uploadPath = path.join("uploads", folder, fileName);

        if (!fs.existsSync(path.dirname(uploadPath))) {
            fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
        }

        fs.writeFileSync(uploadPath, file.buffer);
        return uploadPath;
    }

    static cleanupFiles(filePaths) {
        filePaths.forEach(filePath => {
            if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });
    }
}

export default UploadService;
