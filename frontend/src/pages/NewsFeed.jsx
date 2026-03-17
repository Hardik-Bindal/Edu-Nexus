import React, { useEffect, useState } from "react";
import { studentLinks, teacherLinks } from "../constants/navLinks";
import Navbar from "../components/Navbar";
import NewsCard from "../components/NewsCard";
import { fetchFreshNews, getNews } from "../services/newsService";
import { getUser } from "../services/session";

const NewsFeed = () => {
  const user = getUser();
  const isTeacher = user?.role === "teacher";
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await getNews();
      setArticles(data || []);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    setMessage("");
    try {
      await fetchFreshNews();
      await loadNews();
      setMessage("News feed refreshed.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar title="News Feed" links={isTeacher ? teacherLinks : studentLinks} />
      <main className="page-main stack-4">
        <section className="hero hero-grid">
          <div>
            <h1 className="hero-title">Latest education and environment headlines.</h1>
            <p className="hero-subtitle">
              Stay updated with curated stories relevant to your learning ecosystem.
            </p>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="btn btn-secondary"
          >
            {refreshing ? "Refreshing..." : "Refresh Feed"}
          </button>
        </section>

        {message && (
          <p className={`status ${message.toLowerCase().includes("refreshed") ? "status-ok" : "status-error"}`}>
            {message}
          </p>
        )}

        {loading ? (
          <p className="status status-info">Loading news...</p>
        ) : !articles.length ? (
          <p className="status status-info">No news articles available.</p>
        ) : (
          <section className="grid-auto">
            {articles.map((article, index) => (
              <div key={article._id || article.url} style={{ animationDelay: `${index * 70}ms` }}>
                <NewsCard article={article} />
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default NewsFeed;
