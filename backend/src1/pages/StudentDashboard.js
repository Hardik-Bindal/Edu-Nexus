import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
    loadQuizzes();
    loadLeaderboard();
  }, []);

  const loadQuizzes = async () => {
    try {
      const res = await api.get("/quiz");
      setQuizzes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const res = await api.get("/leaderboard");
      setLeaderboard(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-green-400 font-bold">👩‍🎓 Welcome {user?.name}</h2>

      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Quizzes */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow">
          <h3 className="text-xl text-white mb-4">📝 Available Quizzes</h3>
          {quizzes.length === 0 ? (
            <p className="text-gray-400">No quizzes yet.</p>
          ) : (
            quizzes.map((q) => (
              <div key={q._id} className="bg-gray-800 p-4 rounded mb-3">
                <h4 className="text-green-300">{q.title}</h4>
                <p className="text-sm text-gray-400">{q.topic} • {q.difficulty}</p>
                <button className="mt-2 bg-green-500 px-3 py-1 rounded text-white">
                  Attempt
                </button>
              </div>
            ))
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow">
          <h3 className="text-xl text-white mb-4">🏆 Leaderboard</h3>
          <ol className="list-decimal pl-5 text-gray-300">
            {leaderboard.map((s, i) => (
              <li key={i}>{s.name} — {s.ecoPoints} pts</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
