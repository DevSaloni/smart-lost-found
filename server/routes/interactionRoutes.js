import express from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/authMiddleware.js";
import { 
    sendMessage, 
    getMessages, 
    generateHandoffCode, 
    verifyHandoffCode 
} from "../controllers/interactionController.js";

const router = express.Router();

// Multer config for chat attachments
const storage = multer.diskStorage({
    destination: "uploads/chat_files/",
    filename: (req, file, cb) => {
        cb(null, `chat_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

router.post("/messages", protect, upload.single("file"), sendMessage);
router.get("/messages/:match_id", protect, getMessages);
router.post("/handoff/generate", protect, generateHandoffCode);
router.post("/handoff/verify", protect, verifyHandoffCode);

export default router;
