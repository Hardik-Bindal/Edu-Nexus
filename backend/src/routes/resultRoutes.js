import express from "express";
import { protect, teacherOnly } from "../middleware/authMiddleware.js";
import {
  submitQuiz,
  getMyResults,
  getQuizResults,
  reviewResult,
  getResultById,
} from "../controllers/resultController.js";

const router = express.Router();

// Student submits a quiz
router.post("/submit", protect, submitQuiz);

// Student gets their results
router.get("/my", protect, getMyResults);

// Student/teacher fetches a single result by id
router.get("/detail/:resultId", protect, getResultById);

// Teacher fetches results for a quiz
router.get("/:quizId", protect, teacherOnly, getQuizResults);

// Teacher reviews & updates partial marks
router.put("/review", protect, teacherOnly, reviewResult);

export default router;
