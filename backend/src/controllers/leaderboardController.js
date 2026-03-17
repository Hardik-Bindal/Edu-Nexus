// src/controllers/leaderboardController.js
import User from "../models/User.js";

export const getLeaderboard = async (req, res) => {
  try {
    const topStudents = await User.find({ role: "student" })
      .sort({ ecoPoints: -1 })
      .limit(10)
      .select("name ecoPoints level badges");

    res.json(topStudents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard", error: error.message });
  }
};
