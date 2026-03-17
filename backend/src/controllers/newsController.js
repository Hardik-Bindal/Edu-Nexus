import axios from "axios";
import NewsFeed from "../models/NewsFeed.js";

export const fetchAndStoreNews = async (returnArticles = false) => {
  try {
    const { data } = await axios.get(
      `https://newsapi.org/v2/everything?q=education OR environment&sortBy=publishedAt&language=en&apiKey=${process.env.NEWS_API_KEY}`
    );

    // ✅ Only keep last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const articles = data.articles
      .filter(a => new Date(a.publishedAt) >= sevenDaysAgo)  // ✅ only fresh news
      .map(a => ({
        title: a.title,
        description: a.description,
        url: a.url,
        category: "general",
        publishedAt: new Date(a.publishedAt),
      }));

    // ✅ Insert unique articles only
    for (const article of articles) {
      try {
        await NewsFeed.updateOne(
          { url: article.url },  // match by URL
          { $setOnInsert: article },
          { upsert: true }
        );
      } catch (err) {
        if (err.code !== 11000) console.error("❌ Insert error:", err.message);
      }
    }

    // ✅ Also cleanup DB: remove old articles (>7 days)
    await NewsFeed.deleteMany({ publishedAt: { $lt: sevenDaysAgo } });

    console.log("✅ News updated (last 7 days only)");

    if (returnArticles) return articles;
  } catch (err) {
    console.error("❌ News fetch error:", err.message);
    if (returnArticles) throw new Error("News fetch failed");
  }
};

export const getNewsByInterest = async (req, res) => {
  try {
    const interests =
      req.user && req.user.interests && req.user.interests.length > 0
        ? req.user.interests
        : ["general"];

    const news = await NewsFeed.find({ category: { $in: interests } })
      .sort({ publishedAt: -1 })
      .limit(5);

    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
