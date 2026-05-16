import { Router } from "express";
import * as recordController from "../controllers/recordController.js";
import { protect } from "../middlewares/auth.js";
import { parseUniversal } from "../middlewares/parseUniversal.js";

const router = Router();

router.post("/qr/access", parseUniversal(), recordController.getByQR);

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
