import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { teacherLinks } from "../constants/navLinks";
import Navbar from "../components/Navbar";
import { getQuizById, updateQuiz } from "../services/quizService";

const UpdateQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMessage("");
      try {
        const data = await getQuizById(quizId);
        setQuiz(data);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [quizId]);

  const save = async (event) => {
    event.preventDefault();
    if (!quiz) return;

    setSaving(true);
    setMessage("");
    try {
      const payload = {
        title: quiz.title,
        topic: quiz.topic,
        difficulty: quiz.difficulty,
        level: quiz.level,
        timeLimit: Number(quiz.timeLimit || 0),
        questions: (quiz.questions || []).map((question) => ({
          questionText: question.questionText,
          options: question.options || [],
          correctAnswer: question.correctAnswer,
          explanation: question.explanation || "",
          marks: Number(question.marks || 1),
        })),
      };

      await updateQuiz(quizId, payload);
      setMessage("Quiz updated successfully.");
      setTimeout(() => navigate("/teacher"), 900);
    } catch (err) {
      setMessage(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar title="Update Quiz" links={teacherLinks} />
      <main className="page-main stack-4">
        <section className="hero">
          <div className="hero-grid">
            <div>
              <h1 className="hero-title">Refine quiz content and improve question quality.</h1>
              <p className="hero-subtitle">
                Update metadata, options, explanations, and marks from one editing screen.
              </p>
            </div>
          </div>
        </section>

        {message && (
          <p
            className={`status ${
              message.toLowerCase().includes("success") ? "status-ok" : "status-error"
            }`}
          >
            {message}
          </p>
        )}

        {loading ? (
          <p className="status status-info">Loading quiz data...</p>
        ) : !quiz ? (
          <p className="status status-error">Quiz not found.</p>
        ) : (
          <form onSubmit={save} className="panel panel-pad stack-4">
            <h2 className="panel-title">Quiz Metadata</h2>

            <div className="grid-auto grid-auto-2">
              <input
                value={quiz.title}
                onChange={(event) => setQuiz((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Title"
                className="field"
                required
              />
              <input
                value={quiz.topic}
                onChange={(event) => setQuiz((prev) => ({ ...prev, topic: event.target.value }))}
                placeholder="Topic"
                className="field"
                required
              />
              <select
                value={quiz.difficulty}
                onChange={(event) =>
                  setQuiz((prev) => ({ ...prev, difficulty: event.target.value }))
                }
                className="select-field"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <input
                value={quiz.level}
                onChange={(event) => setQuiz((prev) => ({ ...prev, level: event.target.value }))}
                placeholder="Level"
                className="field"
                required
              />
              <input
                type="number"
                min={0}
                value={quiz.timeLimit || 0}
                onChange={(event) =>
                  setQuiz((prev) => ({ ...prev, timeLimit: Number(event.target.value) }))
                }
                placeholder="Time limit (minutes)"
                className="field"
              />
            </div>

            <h2 className="panel-title">Questions</h2>

            {(quiz.questions || []).map((question, index) => (
              <article key={question._id || index} className="panel panel-pad stack-3">
                <h3 className="panel-title">Question {index + 1}</h3>

                <input
                  value={question.questionText}
                  onChange={(event) => {
                    const nextQuestions = [...quiz.questions];
                    nextQuestions[index] = {
                      ...question,
                      questionText: event.target.value,
                    };
                    setQuiz((prev) => ({ ...prev, questions: nextQuestions }));
                  }}
                  className="field"
                />

                <div className="grid-auto grid-auto-2">
                  {(question.options || []).map((option, optionIndex) => (
                    <input
                      key={`${question._id || index}-${optionIndex}`}
                      value={option}
                      onChange={(event) => {
                        const nextQuestions = [...quiz.questions];
                        const nextOptions = [...question.options];
                        nextOptions[optionIndex] = event.target.value;
                        nextQuestions[index] = {
                          ...question,
                          options: nextOptions,
                        };
                        setQuiz((prev) => ({ ...prev, questions: nextQuestions }));
                      }}
                      className="field"
                    />
                  ))}
                </div>

                <input
                  value={question.correctAnswer}
                  onChange={(event) => {
                    const nextQuestions = [...quiz.questions];
                    nextQuestions[index] = {
                      ...question,
                      correctAnswer: event.target.value,
                    };
                    setQuiz((prev) => ({ ...prev, questions: nextQuestions }));
                  }}
                  placeholder="Correct answer"
                  className="field"
                />

                <textarea
                  rows={2}
                  value={question.explanation || ""}
                  onChange={(event) => {
                    const nextQuestions = [...quiz.questions];
                    nextQuestions[index] = {
                      ...question,
                      explanation: event.target.value,
                    };
                    setQuiz((prev) => ({ ...prev, questions: nextQuestions }));
                  }}
                  className="textarea-field"
                />

                <input
                  type="number"
                  min={1}
                  value={question.marks || 1}
                  onChange={(event) => {
                    const nextQuestions = [...quiz.questions];
                    nextQuestions[index] = {
                      ...question,
                      marks: Number(event.target.value),
                    };
                    setQuiz((prev) => ({ ...prev, questions: nextQuestions }));
                  }}
                  className="field"
                />
              </article>
            ))}

            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? "Saving changes..." : "Save Quiz"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
};

export default UpdateQuiz;

