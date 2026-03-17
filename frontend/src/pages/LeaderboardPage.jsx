import React, { useEffect, useState } from "react";
import { studentLinks, teacherLinks } from "../constants/navLinks";
import Leaderboard from "../components/Leaderboard";
import Navbar from "../components/Navbar";
import { getLeaderboard } from "../services/quizService";
import { getUser } from "../services/session";

const LeaderboardPage = () => {
  const user = getUser();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getLeaderboard();
        setEntries(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page-shell">
      <Navbar title="Leaderboard" links={user?.role === "teacher" ? teacherLinks : studentLinks} />
      <main className="page-main stack-4">
        <section className="hero">
          <h1 className="hero-title">Performance leaderboard</h1>
          <p className="hero-subtitle">
            Live ranking based on eco points earned through quiz performance.
          </p>
        </section>

        {error && <p className="status status-error">{error}</p>}
        {loading ? <p className="status status-info">Loading leaderboard...</p> : <Leaderboard entries={entries} />}
      </main>
    </div>
  );
};

export default LeaderboardPage;
