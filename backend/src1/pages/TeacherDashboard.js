import React, { useState, useEffect } from "react";
import api from "../utils/api";

export default function TeacherDashboard() {
  const [form, setForm] = useState({ title: "", topic: "", difficulty: "medium", level: "", timeLimit: 0 });
  const [quizzes, setQuizzes] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/quiz", form);
      setMsg("✅ Quiz created!");
      loadQuizzes();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Error"));
    }
  };

  const loadQuizzes = async () => {
    try {
      const res = await api.get("/quiz");
      setQuizzes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-green-400 font-bold">🌍 Teacher Dashboard</h2>

      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-2xl shadow mt-6 space-y-4 w-96">
        <input type="text" name="title" placeholder="Quiz Title"
          onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" required />

        <input type="text" name="topic" placeholder="Topic"
          onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" required />

        <select name="difficulty" onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <input type="text" name="level" placeholder="e.g. 10th grade"
          onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" />

        <input type="number" name="timeLimit" placeholder="Time limit (mins)"
          onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" />

        <button type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded">
          Create Quiz
        </button>
      </form>

      <p className="text-sm text-gray-400 mt-2">{msg}</p>

      <div className="mt-8">
        <h3 className="text-xl text-white mb-4">📜 My Quizzes</h3>
        {quizzes.map((q) => (
          <div key={q._id} className="bg-gray-800 p-4 rounded mb-3">
            <h4 className="text-green-300">{q.title}</h4>
            <p className="text-sm text-gray-400">{q.topic} • {q.difficulty}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
