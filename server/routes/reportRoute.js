import express from "express";
import multer from "multer";
import { createReportController, getUserReportsController, getReportByIdController, getAllReportsController, updateReportController } from "../controllers/reportController.js";
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

// GET ALL REPORTS FOR BROWSE
router.get("/browse", getAllReportsController);

// GET REPORT BY ID
router.get("/:id", getReportByIdController);

// UPDATE REPORT BY ID
router.put("/:id", protect, upload.single("image"), updateReportController);

export default router;