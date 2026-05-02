import express from "express";
import { 
    getUserNotificationsController, 
    markNotificationsAsReadController, 
    clearNotificationsController 
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUserNotificationsController);
router.put("/read", protect, markNotificationsAsReadController);
router.delete("/clear", protect, clearNotificationsController);

export default router;
