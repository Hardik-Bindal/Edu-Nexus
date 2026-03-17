// src/index.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cron from "node-cron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { fetchAndStoreNews } from "./controllers/newsController.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import factRoutes from "./routes/factRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(uploadsDir));

// Test route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/facts", factRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/games", gameRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Connect DB + fetch news initially
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // Fetch news once on startup
    await fetchAndStoreNews();

    // Start server only after DB + initial news fetch
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

    // Setup cron to refresh every 12 hours
    cron.schedule("0 */12 * * *", fetchAndStoreNews);
  })
  .catch((err) => console.error("❌ MongoDB Error:", err.message));
