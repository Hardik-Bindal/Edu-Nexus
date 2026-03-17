import express from "express";
import { getDailyGame } from "../controllers/gameController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/daily", protect, getDailyGame);
router.get("/", protect, getDailyGame);
export default router;
