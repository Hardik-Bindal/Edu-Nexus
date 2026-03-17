import express from "express";
import { getNewsByInterest, fetchAndStoreNews } from "../controllers/newsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get news by user interests
router.get("/", protect, getNewsByInterest);

// ✅ Fetch fresh news and return it directly
router.get("/fetch", async (req, res) => {
  try {
    const newArticles = await fetchAndStoreNews(true); // pass flag for returning data
    res.json(newArticles); // directly return newly fetched news
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
