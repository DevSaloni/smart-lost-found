import express from "express";

import { signup, verifyEmail, login, googleLogin, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/verify/:token", verifyEmail);
router.get("/profile", protect, getProfile);

export default router;

