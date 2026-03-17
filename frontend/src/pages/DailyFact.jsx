import React, { useEffect, useState } from "react";
import { studentLinks, teacherLinks } from "../constants/navLinks";
import FactCard from "../components/FactCard";
import Navbar from "../components/Navbar";
import { addDailyFact, getDailyFact } from "../services/factService";
import { getUser } from "../services/session";

const DailyFact = () => {
  const user = getUser();
  const isTeacher = user?.role === "teacher";
  const [fact, setFact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ factText: "", category: "general" });

  const loadFact = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await getDailyFact();
      setFact(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFact();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await addDailyFact(form);
      setForm({ factText: "", category: "general" });
      setMessage("Fact added successfully.");
      loadFact();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="page-shell">
      <Navbar title="Daily Fact" links={isTeacher ? teacherLinks : studentLinks} />
      <main className="page-main stack-4">
        <section className="hero">
          <h1 className="hero-title">One sharp fact every day.</h1>
          <p className="hero-subtitle">
            Build curiosity with quick science, environment, and general knowledge insights.
          </p>
        </section>

        {message && (
          <p className={`status ${message.toLowerCase().includes("added") ? "status-ok" : "status-error"}`}>
            {message}
          </p>
        )}

        {loading ? <p className="status status-info">Loading daily fact...</p> : <FactCard fact={fact} />}

        {isTeacher && (
          <section className="panel panel-pad">
            <h2 className="panel-title">Publish New Fact</h2>
            <form onSubmit={handleSubmit} className="stack-3 mt-4">
              <textarea
                value={form.factText}
                onChange={(event) => setForm((prev) => ({ ...prev, factText: event.target.value }))}
                placeholder="Fact text"
                rows={3}
                required
                className="textarea-field"
              />
              <input
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                placeholder="Category"
                className="field"
              />
              <button type="submit" className="btn btn-primary">
                Save Fact
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};

export default DailyFact;
