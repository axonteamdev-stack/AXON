import express from "express";
import * as admin from "../Controllers/AdminController.js";
import { protect, restrictTo } from "../Middlewares/AuthMiddleware.js";
import uploadMiddleware from "../Middlewares/UploadMiddleware.js";

const router = express.Router();

// All following operations require admin login
router.use(protect);
router.use(restrictTo("admin"));

router.post("/users",  admin.addUser);
router.patch("/activate-doctor/:id", admin.activateDoctor);

router
  .route("/users/:id")
  .patch( admin.updateUser)
  .delete(admin.deleteUser);

export default router;
