import React, { useEffect, useState } from "react";
import { studentLinks, teacherLinks } from "../constants/navLinks";
import GameCard from "../components/GameCard";
import Navbar from "../components/Navbar";
import { getDailyGame } from "../services/gameService";
import { getUser } from "../services/session";

const Games = () => {
  const user = getUser();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadGame = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await getDailyGame();
      setGame(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGame();
  }, []);

  return (
    <div className="page-shell">
      <Navbar title="Daily Games" links={user?.role === "teacher" ? teacherLinks : studentLinks} />
      <main className="page-main stack-4">
        <section className="hero hero-grid">
          <div>
            <h1 className="hero-title">Daily brain challenge.</h1>
            <p className="hero-subtitle">Play a rotating puzzle to keep cognitive momentum high.</p>
          </div>
          <button type="button" onClick={loadGame} className="btn btn-secondary">
            Reload Puzzle
          </button>
        </section>

        {message && <p className="status status-error">{message}</p>}

        {loading ? <p className="status status-info">Loading daily game...</p> : <GameCard game={game} />}
      </main>
    </div>
  );
};

export default Games;
