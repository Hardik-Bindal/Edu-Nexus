import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { studentLinks, teacherLinks } from "../constants/navLinks";
import Navbar from "../components/Navbar";
import {
  getMyResults,
  getResultById,
  getResultsByQuiz,
  reviewResult,
} from "../services/resultService";
import { getUser } from "../services/session";

const Result = () => {
  const navigate = useNavigate();
  const { resultId, quizId } = useParams();
  const user = getUser();
  const isTeacher = user?.role === "teacher";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [resultList, setResultList] = useState([]);
  const [editing, setEditing] = useState(false);
  const [marksByAnswerId, setMarksByAnswerId] = useState({});
  const [saving, setSaving] = useState(false);

  const mode = useMemo(() => {
    if (quizId && isTeacher) return "teacher-quiz-results";
    if (resultId) return "detail";
    return "student-results";
  }, [isTeacher, quizId, resultId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        if (mode === "teacher-quiz-results") {
          const data = await getResultsByQuiz(quizId);
          setResultList(data || []);
        } else if (mode === "detail") {
          const data = await getResultById(resultId);
          setResult(data);
          const marks = {};
          (data.answers || []).forEach((answer) => {
            marks[answer._id] = answer.obtainedMarks || 0;
          });
          setMarksByAnswerId(marks);
        } else {
          const data = await getMyResults();
          setResultList(data || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [mode, quizId, resultId]);

  const saveReview = async () => {
    if (!result) return;
    setSaving(true);
    setError("");
    try {
      const updates = (result.answers || []).map((answer) => ({
        answerId: answer._id,
        newMarks: Number(marksByAnswerId[answer._id] ?? answer.obtainedMarks ?? 0),
      }));
      await reviewResult(result._id, updates);
      const refreshed = await getResultById(result._id);
      setResult(refreshed);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar title="Results" links={isTeacher ? teacherLinks : studentLinks} />
      <main className="page-main stack-4">
        <section className="hero">
          <h1 className="hero-title">
            {mode === "teacher-quiz-results"
              ? "Quiz Submission Overview"
              : mode === "detail"
                ? "Result Breakdown"
                : "Your Result History"}
          </h1>
          <p className="hero-subtitle">
            Track scores, inspect answers, and review marks with full transparency.
          </p>
        </section>

        {error && <p className="status status-error">{error}</p>}
        {loading && <p className="status status-info">Loading results...</p>}

        {!loading && mode === "teacher-quiz-results" && (
          <section className="stack-3">
            {!resultList.length ? (
              <p className="status status-info">No submissions found for this quiz.</p>
            ) : (
              resultList.map((item, index) => (
                <article
                  key={item._id}
                  className="panel panel-pad fade-up flex items-center justify-between gap-3"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div>
                    <h3 className="panel-title">{item.student?.name || "Student"}</h3>
                    <p className="panel-muted mt-1">
                      {item.quiz?.title || "Quiz"} · {item.score}/{item.total}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/teacher/result/${item._id}`)}
                    className="btn btn-secondary"
                  >
                    Open
                  </button>
                </article>
              ))
            )}
          </section>
        )}

        {!loading && mode === "student-results" && (
          <section className="stack-3">
            {!resultList.length ? (
              <p className="status status-info">No results available yet.</p>
            ) : (
              resultList.map((item, index) => (
                <article
                  key={item._id}
                  className="panel panel-pad fade-up flex items-center justify-between gap-3"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div>
                    <h3 className="panel-title">{item.quiz?.title || "Quiz"}</h3>
                    <p className="panel-muted mt-1">
                      Score: {item.score}/{item.total} ·{" "}
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Link to={`/student/results/${item._id}`} className="btn btn-secondary">
                    View
                  </Link>
                </article>
              ))
            )}
          </section>
        )}

        {!loading && mode === "detail" && result && (
          <section className="stack-4">
            <article className="panel panel-pad">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="panel-title">{result.quiz?.title || "Result Detail"}</h2>
                  <p className="panel-muted mt-1">
                    Score: {result.score}/{result.total} ·{" "}
                    {new Date(result.createdAt).toLocaleString()}
                  </p>
                  {result.student?.name && (
                    <p className="panel-muted mt-1">Student: {result.student.name}</p>
                  )}
                </div>

                {isTeacher && (
                  <div className="flex flex-wrap gap-2">
                    {!editing ? (
                      <button type="button" onClick={() => setEditing(true)} className="btn btn-warning">
                        Edit Marks
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={saveReview}
                          disabled={saving}
                          className="btn btn-primary"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(false)}
                          className="btn btn-ghost"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </article>

            {(result.answers || []).map((answer, index) => (
              <article key={answer._id} className="panel panel-pad fade-up">
                <h3 className="panel-title">
                  Q{index + 1}. {answer.questionText || "Question"}
                </h3>

                <div className="mt-3 grid-auto grid-auto-2">
                  <p className="panel-muted">
                    <strong className="result-label">Selected:</strong> {answer.selectedAnswer || "No answer"}
                  </p>
                  <p className="panel-muted">
                    <strong className="result-label">Correct:</strong> {answer.correctAnswer || "n/a"}
                  </p>
                </div>

                <p className="panel-muted mt-2">
                  <strong className="result-label">Reasoning:</strong> {answer.reasoning || "-"}
                </p>
                <p className="panel-muted mt-1">
                  <strong className="result-label">Explanation:</strong> {answer.explanation || "-"}
                </p>

                <div className="mt-3">
                  {isTeacher && editing ? (
                    <div className="flex items-center gap-2">
                      <span className="panel-muted">Marks</span>
                      <input
                        type="number"
                        min={0}
                        step={0.5}
                        value={marksByAnswerId[answer._id] ?? 0}
                        onChange={(event) =>
                          setMarksByAnswerId((prev) => ({
                            ...prev,
                            [answer._id]: event.target.value,
                          }))
                        }
                        className="field max-w-[110px]"
                      />
                      <span className="panel-muted">/ {answer.maxMarks ?? 0}</span>
                    </div>
                  ) : (
                    <p className="badge">
                      Marks: {answer.obtainedMarks ?? 0} / {answer.maxMarks ?? 0}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default Result;
