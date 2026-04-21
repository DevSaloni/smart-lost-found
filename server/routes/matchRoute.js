import express from "express";
import { 
    getUserMatchesController, 
    getMatchByIdController 
} from "../controllers/matchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user-matches", protect, getUserMatchesController);
router.get("/:matchId", protect, getMatchByIdController);

export default router;
