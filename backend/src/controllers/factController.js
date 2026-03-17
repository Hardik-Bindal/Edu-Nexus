// src/controllers/factController.js
import DailyFact from "../models/DailyFact.js";
import { generateFactWithAI } from "../utils/aiHelper.js";

// 📌 Add daily fact manually (Admin/Teacher)
export const addFact = async (req, res) => {
  try {
    const { factText, category } = req.body;
    if (!factText || !factText.trim()) {
      return res.status(400).json({ message: "factText is required" });
    }

    const fact = await DailyFact.create({
      factText: factText.trim(),
      category: category || "general",
      createdBy: req.user.id,
    });
    res.status(201).json(fact);
  } catch (error) {
    res.status(500).json({ message: "Error adding fact", error: error.message });
  }
};

// 📌 Get today's fact (Auto-generate with AI if missing)
export const getFact = async (req, res) => {
  try {
    // Check if today's fact exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let fact = await DailyFact.findOne({ createdAt: { $gte: today } });

    // If no fact exists for today → generate using AI
    if (!fact) {
      const aiFact = await generateFactWithAI();
      fact = await DailyFact.create({
        factText: aiFact,
        category: "general",
        createdBy: null, // system-generated
      });
    }

    res.json(fact);
  } catch (error) {
    res.status(500).json({ message: "Error fetching fact", error: error.message });
  }
};
