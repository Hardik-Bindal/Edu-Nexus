import Result from "../models/Result.js";
import Quiz from "../models/Quiz.js";
import User from "../models/User.js";

const POINTS_PER_LEVEL = 50;

const recalculateStudentProgress = async (studentId) => {
  const [aggregate] = await Result.aggregate([
    { $match: { student: studentId } },
    { $group: { _id: null, total: { $sum: "$score" } } },
  ]);

  const ecoPoints = aggregate ? aggregate.total : 0;
  const level = Math.max(1, Math.floor(ecoPoints / POINTS_PER_LEVEL) + 1);

  return User.findByIdAndUpdate(
    studentId,
    { ecoPoints, level },
    { new: true }
  ).select("ecoPoints level");
};

const buildResultWithQuestionMeta = async (resultDoc) => {
  const result = resultDoc.toObject();
  const quizId = resultDoc.quiz?._id || resultDoc.quiz;
  const quizDoc = await Quiz.findById(quizId).select("title questions");

  if (quizDoc && (!result.quiz || typeof result.quiz === "string")) {
    result.quiz = { _id: quizDoc._id, title: quizDoc.title };
  }

  const questionMap = new Map(
    (quizDoc?.questions || []).map((q) => [String(q._id), q])
  );

  result.answers = (result.answers || []).map((ans) => {
    const question = questionMap.get(String(ans.questionId));
    return {
      ...ans,
      questionText: question?.questionText || null,
      correctAnswer: question?.correctAnswer || null,
      explanation: question?.explanation || null,
      maxMarks: question?.marks ?? 0,
    };
  });

  return result;
};

// 📌 Student submits quiz
export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    if (!quizId || !Array.isArray(answers)) {
      return res.status(400).json({ message: "quizId and answers are required" });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    const evaluatedAnswers = quiz.questions.map((q) => {
      const studentAnswer = answers.find((a) => String(a.questionId) === String(q._id));
      let isCorrect = false;
      let obtainedMarks = 0;

      if (studentAnswer) {
        if (studentAnswer.selectedAnswer === q.correctAnswer) {
          isCorrect = true;
          obtainedMarks = q.marks; // ✅ full marks
          score += q.marks;
        } else {
          obtainedMarks = 0; // teacher can later edit for partial marks
        }
      }

      return {
        questionId: q._id,
        selectedAnswer: studentAnswer ? studentAnswer.selectedAnswer : null,
        reasoning: studentAnswer ? studentAnswer.reasoning : "",
        isCorrect,
        obtainedMarks,
      };
    });

    // ✅ Save result
    const result = await Result.create({
      student: req.user._id,
      quiz: quizId,
      answers: evaluatedAnswers,
      score,
      total: quiz.questions.reduce((sum, q) => sum + q.marks, 0),
    });

    const user = await recalculateStudentProgress(req.user._id);
    const enrichedResult = await buildResultWithQuestionMeta(result);

    res.status(201).json({
      message: "Quiz submitted",
      result: enrichedResult,
      ecoPoints: user?.ecoPoints || 0,
      level: user?.level || 1,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Teacher updates partial marks
export const reviewResult = async (req, res) => {
  try {
    const { resultId, updates } = req.body;
    if (!resultId || !Array.isArray(updates)) {
      return res.status(400).json({ message: "resultId and updates are required" });
    }

    const result = await Result.findById(resultId);

    if (!result) return res.status(404).json({ message: "Result not found" });

    const quiz = await Quiz.findById(result.quiz).select("questions");
    const marksMap = new Map(
      (quiz?.questions || []).map((q) => [String(q._id), q.marks ?? 0])
    );

    updates.forEach((update) => {
      const ans = result.answers.id(update.answerId);
      if (ans) {
        const maxMarks = marksMap.get(String(ans.questionId)) ?? 0;
        const parsed = Number(update.newMarks);
        ans.obtainedMarks = Number.isNaN(parsed)
          ? ans.obtainedMarks
          : Math.max(0, Math.min(parsed, maxMarks));
      }
    });

    result.score = result.answers.reduce((sum, a) => sum + (a.obtainedMarks || 0), 0);
    result.reviewed = true;
    await result.save();

    await recalculateStudentProgress(result.student);
    const enrichedResult = await buildResultWithQuestionMeta(result);

    res.json({ message: "Result reviewed & updated", result: enrichedResult });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Get a single result by id
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.resultId)
      .populate("student", "name email ecoPoints level")
      .populate("quiz", "title topic difficulty level");

    if (!result) return res.status(404).json({ message: "Result not found" });

    const studentId = String(result.student?._id || result.student);
    const requesterId = String(req.user._id);
    const isTeacher = req.user.role === "teacher";
    const isOwner = studentId === requesterId;

    if (!isTeacher && !isOwner) {
      return res.status(403).json({ message: "Not authorized to view this result" });
    }

    const enrichedResult = await buildResultWithQuestionMeta(result);
    res.json(enrichedResult);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Get my results (Student)
export const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id })
      .populate("quiz", "title topic difficulty level")
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Teacher fetch results for quiz
export const getQuizResults = async (req, res) => {
  try {
    const results = await Result.find({ quiz: req.params.quizId })
      .populate("student", "name email ecoPoints level")
      .populate("quiz", "title topic difficulty level")
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
