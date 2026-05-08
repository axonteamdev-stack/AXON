import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.js";
import {
  addUser,
  activateDoctor,
  updateUser,
  deleteUser,
} from "../controllers/adminController.js";
import { validateBody } from "../middlewares/validate.js";
import { addUserSchema } from "../validators/userValidator.js";
import { validateObjectId } from "../middlewares/ValidateObjectId.js";

const router = Router();

router.use(protect, restrictTo("admin"));
router.post("/users", validateBody(addUserSchema), addUser);
router.patch("/doctors/:id/activate", activateDoctor);
router.patch("/users/:id", validateObjectId("id"), updateUser);
router.delete("/users/:id", validateObjectId("id"), deleteUser);

export default router;
