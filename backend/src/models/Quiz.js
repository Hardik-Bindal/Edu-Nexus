import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
  marks: { type: Number, default: 1 }, // per-question marks
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
    level: { type: String, required: true }, // e.g. "10th Grade", "College Year 2"
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    timeLimit: { type: Number, default: 0 }, // in minutes (0 = no limit)
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
