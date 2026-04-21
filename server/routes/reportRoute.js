import express from "express";
import multer from "multer";
import { createReportController, getUserReportsController, getReportByIdController } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Image upload config
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// CREATE REPORT
router.post("/", protect, upload.single("image"), createReportController);

// GET USER REPORTS
router.get("/my-reports", protect, getUserReportsController);

// GET REPORT BY ID
router.get("/:id", getReportByIdController);

export default router;