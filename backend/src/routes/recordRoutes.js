import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as recordController from "../controllers/recordController.js";
import { protect } from "../middlewares/auth.js";
import { parseUniversal } from "../middlewares/parseUniversal.js";

const router = Router();

const qrLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: "fail",
      message: "Too many QR access attempts. Please try again later.",
    });
  },
});

router.get("/qr-test", recordController.openViewer);

router.get(
  "/emergency/:token",
  qrLimiter,
  recordController.renderEmergencyPage,
);

router.get("/emergency-data/:token", qrLimiter, recordController.getByQR);

router.get("/qr/access/:patientId", qrLimiter, recordController.getByQR);

router.use(protect);

router.get("/me", recordController.getMyRecord);

router.patch("/me", parseUniversal(), recordController.updateRecord);

router.post(
  "/tests/:type",
  parseUniversal(["radiologyImage", "labImage"]),
  recordController.addTest,
);

router.post("/qr", recordController.generateQR);

export default router;
