import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { studentLinks } from "../constants/navLinks";
import Navbar from "../components/Navbar";
import { getQuizById, submitQuiz } from "../services/attemptService";

const AttemptQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
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
    loadQuiz();
  }, [quizId]);

  const progress = useMemo(() => {
    if (!quiz) return 0;
    const answered = quiz.questions.filter((question) => answers[question._id]?.selectedAnswer).length;
    return Math.round((answered / quiz.questions.length) * 100);
  }, [answers, quiz]);

  const setAnswer = (questionId, selectedAnswer, reasoning = "") => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { selectedAnswer, reasoning },
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    const unanswered = quiz.questions.filter((question) => !answers[question._id]?.selectedAnswer);
    if (unanswered.length) {
      setMessage("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      const payload = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        selectedAnswer: value.selectedAnswer,
        reasoning: value.reasoning || "",
      }));

      const data = await submitQuiz(quiz._id, payload);
      navigate(`/student/results/${data.result._id}`);
    } catch (err) {
      setMessage(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar title="Attempt Quiz" links={studentLinks} />
      <main className="page-main stack-4">
        {loading ? (
          <p className="status status-info">Loading quiz...</p>
        ) : !quiz ? (
          <p className="status status-error">{message || "Quiz not found."}</p>
        ) : (
          <>
            <section className="hero">
              <div className="hero-grid">
                <div>
                  <h1 className="hero-title">{quiz.title}</h1>
                  <p className="hero-subtitle">
                    {quiz.topic} · {quiz.difficulty} · {quiz.questions.length} question(s)
                  </p>
                </div>
                <span className="badge">Progress: {progress}%</span>
              </div>
              <div className="progress-shell">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
            </section>

            <section className="stack-3">
              {quiz.questions.map((question, index) => (
                <article key={question._id} className="panel panel-pad fade-up">
                  <h2 className="panel-title">
                    Q{index + 1}. {question.questionText}
                  </h2>

                  <div className="stack-3 mt-3">
                    {question.options.map((option) => (
                      <label
                        key={option}
                        className={`answer-option ${
                          answers[question._id]?.selectedAnswer === option
                            ? "answer-option-active"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={question._id}
                          checked={answers[question._id]?.selectedAnswer === option}
                          onChange={() =>
                            setAnswer(
                              question._id,
                              option,
                              answers[question._id]?.reasoning || ""
                            )
                          }
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Optional reasoning"
                    value={answers[question._id]?.reasoning || ""}
                    onChange={(event) =>
                      setAnswer(
                        question._id,
                        answers[question._id]?.selectedAnswer,
                        event.target.value
                      )
                    }
                    className="textarea-field mt-3"
                  />
                </article>
              ))}
            </section>

            {message && <p className="status status-error">{message}</p>}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AttemptQuiz;
