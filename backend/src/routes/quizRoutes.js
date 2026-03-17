// src/routes/quizRoutes.js
import express from "express";
import {
  createQuiz,
  createQuizWithAI,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quizController.js";
import { protect, teacherOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Teacher-only
router.post("/", protect, teacherOnly, createQuiz);
router.post("/create", protect, teacherOnly, createQuiz);
router.post("/ai", protect, teacherOnly, createQuizWithAI);
router.put("/:id", protect, teacherOnly, updateQuiz);
router.delete("/:id", protect, teacherOnly, deleteQuiz);

// Both teacher/student
router.get("/", protect, getQuizzes);
router.get("/:id", protect, getQuizById);

export default router;
