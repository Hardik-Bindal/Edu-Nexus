// src/models/DailyFact.js
import mongoose from "mongoose";

const dailyFactSchema = new mongoose.Schema(
  {
    factText: { type: String, required: true },
    category: { type: String }, // e.g., Science, Environment
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const DailyFact = mongoose.model("DailyFact", dailyFactSchema);
export default DailyFact;
