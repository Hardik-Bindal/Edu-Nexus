// src/controllers/aiController.js
import { generateQuizWithAI } from "../utils/aiHelper.js";

export const generateAIQuiz = async (req, res) => {
  try {
    const { topic, difficulty, numQuestions, level } = req.body;
    const questions = await generateQuizWithAI(topic, difficulty, numQuestions);
    res.json({ message: "AI Quiz generated", questions, level });
  } catch (error) {
    res.status(500).json({ message: "AI Quiz generation failed", error: error.message });
  }
};
