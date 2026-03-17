// src/models/leaderboard.js
import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ecoPoints: { type: Number, default: 0 },
    rank: { type: Number },
  },
  { timestamps: true }
);

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
export default Leaderboard;
