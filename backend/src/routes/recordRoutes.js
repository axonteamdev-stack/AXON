import { Router } from "express";
import * as recordController from "../controllers/recordController.js";
import { protect } from "../middlewares/auth.js";
import uploadMiddleware from "../middlewares/upload.js";

const router = Router();

router.get("/qr/:token", recordController.getByQR);

router.use(protect);

router.get("/me", recordController.getMyRecord);
router.patch("/me", recordController.updateRecord);
router.post("/tests/:type", uploadMiddleware.patient, recordController.addTest);
router.post("/qr", recordController.generateQR);

export default router;
