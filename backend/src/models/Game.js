import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  type: { type: String, enum: ["sudoku", "riddle", "scramble"], required: true },
  content: mongoose.Schema.Types.Mixed, // JSON for puzzles
  date: { type: String, required: true }, // store "YYYY-MM-DD"
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Game", gameSchema);
