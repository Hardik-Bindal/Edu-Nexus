// src/controllers/quizController.js
import Quiz from "../models/Quiz.js";
import { generateQuizWithAI } from "../utils/aiHelper.js";

// 📌 Teacher creates manual quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, description, topic, difficulty, level, questions } = req.body;

    const quiz = await Quiz.create({
      title,
      description,
      topic,
      difficulty,
      level,
      questions,
      createdBy: req.user.id
    });

    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: "Error creating quiz", error: error.message });
  }
};

// 📌 AI-generated quiz
//import Quiz from "../models/Quiz.js";
//import { generateQuizWithAI } from "../utils/aiHelper.js";

export const createQuizWithAI = async (req, res) => {
  try {
    const { topic, difficulty, numQuestions, level, timeLimit } = req.body;

    // Call your AI utility to generate questions
    const questions = await generateQuizWithAI(topic, difficulty, numQuestions);

    // Create quiz in DB
    const quiz = await Quiz.create({
      title: `${topic} - AI Quiz`,
      topic,
      difficulty,
      level,
      questions,
      timeLimit: timeLimit || 0, // default no time limit
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "✅ AI Quiz created successfully",
      quiz
    });
  } catch (error) {
    console.error("AI quiz error:", error);
    res.status(500).json({
      message: "❌ AI quiz generation failed",
      error: error.message
    });
  }
};

// quizController.js
export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find(
      {},
      "title topic difficulty level timeLimit createdBy createdAt"
    ).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Get all quizzes
/*export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "name email");
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes", error: error.message });
  }
};*/

// 📌 Get quiz by ID
export const getQuizById = async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id).populate("createdBy", "name email");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // If user is a student, hide correct answers and explanations
    if (req.user.role === "student") {
      quiz = quiz.toObject(); // convert Mongoose doc → plain JS object
      quiz.questions = quiz.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        marks: q.marks
      }));
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error: error.message });
  }
};

// 📌 Update quiz
export const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this quiz" });
    }

    Object.assign(quiz, req.body);
    await quiz.save();
    res.json({ message: "Quiz updated successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: "Error updating quiz", error: error.message });
  }
};

// 📌 Delete quiz
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this quiz" });
    }

    await quiz.deleteOne();
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz", error: error.message });
  }
};
