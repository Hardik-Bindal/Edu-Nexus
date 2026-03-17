// src/routes/aiRoutes.js
import express from "express";
import { generateAIQuiz } from "../controllers/aiController.js";
import { protect, teacherOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/quiz", protect, teacherOnly, generateAIQuiz);

export default router;
