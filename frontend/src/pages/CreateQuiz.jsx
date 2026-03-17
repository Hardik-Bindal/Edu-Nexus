import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { teacherLinks } from "../constants/navLinks";
import Navbar from "../components/Navbar";
import { createQuiz, createQuizWithAI } from "../services/quizService";

const emptyQuestion = () => ({
  questionText: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  explanation: "",
  marks: 1,
});

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [meta, setMeta] = useState({
    title: "",
    topic: "",
    difficulty: "easy",
    level: "",
    timeLimit: 0,
  });
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [aiForm, setAiForm] = useState({
    topic: "",
    difficulty: "easy",
    level: "",
    numQuestions: 5,
    timeLimit: 10,
  });

  const totalMarks = useMemo(
    () => questions.reduce((sum, question) => sum + Number(question.marks || 0), 0),
    [questions]
  );

  const updateQuestion = (index, next) => {
    setQuestions((prev) => prev.map((question, i) => (i === index ? next : question)));
  };

  const handleManualSubmit = async (event) => {
    event.preventDefault();
    setManualLoading(true);
    setMessage("");
    try {
      await createQuiz({ ...meta, questions });
      setMessage("Manual quiz created successfully.");
      setTimeout(() => navigate("/teacher"), 900);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setManualLoading(false);
    }
  };

  const handleAISubmit = async (event) => {
    event.preventDefault();
    setAiLoading(true);
    setMessage("");
    try {
      await createQuizWithAI({
        ...aiForm,
        numQuestions: Number(aiForm.numQuestions),
        timeLimit: Number(aiForm.timeLimit),
      });
      setMessage("AI quiz created successfully.");
      setTimeout(() => navigate("/teacher"), 900);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar title="Create Quiz" links={teacherLinks} />
      <main className="page-main stack-4">
        <section className="hero">
          <div className="hero-grid">
            <div>
              <h1 className="hero-title">Build assessment content with precision or AI speed.</h1>
              <p className="hero-subtitle">
                Create fully custom quizzes or generate structured question sets instantly.
              </p>
            </div>
            <span className="badge">Total Marks: {totalMarks}</span>
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

        <section className="panel panel-pad">
          <h2 className="panel-title">Manual Quiz Builder</h2>
          <p className="panel-muted mt-1">Define metadata and enter every question manually.</p>

          <form onSubmit={handleManualSubmit} className="stack-4 mt-4">
            <div className="grid-auto grid-auto-2">
              <input
                placeholder="Quiz Title"
                value={meta.title}
                onChange={(event) => setMeta((prev) => ({ ...prev, title: event.target.value }))}
                required
                className="field"
              />
              <input
                placeholder="Topic"
                value={meta.topic}
                onChange={(event) => setMeta((prev) => ({ ...prev, topic: event.target.value }))}
                required
                className="field"
              />
              <select
                value={meta.difficulty}
                onChange={(event) =>
                  setMeta((prev) => ({ ...prev, difficulty: event.target.value }))
                }
                className="select-field"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <input
                placeholder="Level (e.g. Grade 10)"
                value={meta.level}
                onChange={(event) => setMeta((prev) => ({ ...prev, level: event.target.value }))}
                required
                className="field"
              />
              <input
                type="number"
                min={0}
                placeholder="Time Limit (minutes)"
                value={meta.timeLimit}
                onChange={(event) =>
                  setMeta((prev) => ({ ...prev, timeLimit: Number(event.target.value) }))
                }
                className="field"
              />
            </div>

            <div className="stack-3">
              {questions.map((question, index) => (
                <article key={`question-${index}`} className="panel panel-pad">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="panel-title">Question {index + 1}</h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setQuestions((prev) => prev.filter((_, qIndex) => qIndex !== index))
                        }
                        className="btn btn-danger"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="stack-3">
                    <input
                      placeholder="Question text"
                      value={question.questionText}
                      onChange={(event) =>
                        updateQuestion(index, {
                          ...question,
                          questionText: event.target.value,
                        })
                      }
                      className="field"
                      required
                    />

                    <div className="grid-auto grid-auto-2">
                      {question.options.map((option, optionIndex) => (
                        <input
                          key={`question-${index}-option-${optionIndex}`}
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(event) => {
                            const nextOptions = [...question.options];
                            nextOptions[optionIndex] = event.target.value;
                            updateQuestion(index, { ...question, options: nextOptions });
                          }}
                          className="field"
                          required
                        />
                      ))}
                    </div>

                    <input
                      placeholder="Correct answer (must match one option exactly)"
                      value={question.correctAnswer}
                      onChange={(event) =>
                        updateQuestion(index, {
                          ...question,
                          correctAnswer: event.target.value,
                        })
                      }
                      className="field"
                      required
                    />

                    <textarea
                      rows={2}
                      placeholder="Explanation"
                      value={question.explanation}
                      onChange={(event) =>
                        updateQuestion(index, {
                          ...question,
                          explanation: event.target.value,
                        })
                      }
                      className="textarea-field"
                    />

                    <input
                      type="number"
                      min={1}
                      value={question.marks}
                      onChange={(event) =>
                        updateQuestion(index, {
                          ...question,
                          marks: Number(event.target.value),
                        })
                      }
                      className="field"
                    />
                  </div>
                </article>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}
                className="btn btn-ghost"
              >
                Add Question
              </button>
              <button type="submit" disabled={manualLoading} className="btn btn-primary">
                {manualLoading ? "Creating..." : "Create Manual Quiz"}
              </button>
            </div>
          </form>
        </section>

        <section className="panel panel-pad">
          <h2 className="panel-title">AI Quiz Generator</h2>
          <p className="panel-muted mt-1">
            Generate an AI quiz based on topic, difficulty, and question count.
          </p>

          <form onSubmit={handleAISubmit} className="grid-auto grid-auto-2 mt-4">
            <input
              placeholder="Topic"
              value={aiForm.topic}
              onChange={(event) => setAiForm((prev) => ({ ...prev, topic: event.target.value }))}
              className="field"
              required
            />
            <select
              value={aiForm.difficulty}
              onChange={(event) =>
                setAiForm((prev) => ({ ...prev, difficulty: event.target.value }))
              }
              className="select-field"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <input
              placeholder="Level"
              value={aiForm.level}
              onChange={(event) => setAiForm((prev) => ({ ...prev, level: event.target.value }))}
              className="field"
              required
            />
            <input
              type="number"
              min={1}
              max={20}
              value={aiForm.numQuestions}
              onChange={(event) =>
                setAiForm((prev) => ({ ...prev, numQuestions: event.target.value }))
              }
              className="field"
              required
            />
            <input
              type="number"
              min={0}
              value={aiForm.timeLimit}
              onChange={(event) =>
                setAiForm((prev) => ({ ...prev, timeLimit: event.target.value }))
              }
              className="field"
            />
            <button type="submit" disabled={aiLoading} className="btn btn-secondary">
              {aiLoading ? "Generating..." : "Create AI Quiz"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default CreateQuiz;

