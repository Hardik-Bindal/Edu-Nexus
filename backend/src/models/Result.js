import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz.questions" },
  selectedAnswer: { type: String },
  reasoning: { type: String }, // student’s reasoning/explanation
  isCorrect: { type: Boolean },
  obtainedMarks: { type: Number, default: 0 }, // supports partial marking
});

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: [answerSchema],
    score: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    reviewed: { type: Boolean, default: false }, // teacher can review for partial marking
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);
