import express from "express";

import { signup, verifyEmail, login, googleLogin, getProfile, updatePhone } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/verify/:token", verifyEmail);
router.get("/profile", protect, getProfile);
router.put("/update-phone", protect, updatePhone);

export default router;

