import { Router } from "express";
import * as recordController from "../controllers/recordController.js";
import { protect } from "../middlewares/auth.js";
import uploadMiddleware from "../middlewares/upload.js";
import { parseForm } from "../middlewares/parseForm.js";

const router = Router();

// Public route — no auth required, but needs token + pin
router.post("/qr/access", parseForm, recordController.getByQR);

// Protected routes
router.use(protect);

router.get("/me", recordController.getMyRecord);
router.patch("/me", recordController.updateRecord);
router.post("/tests/:type", uploadMiddleware.patient, recordController.addTest);
router.post("/qr", recordController.generateQR);

export default router;
