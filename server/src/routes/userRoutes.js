import { Router } from "express";
import { getUsers } from "../controllers/userController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/", protect, adminOnly, getUsers);

export default router;
