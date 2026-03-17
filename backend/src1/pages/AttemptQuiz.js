import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function AttemptQuiz() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      const res = await api.get(`/quiz/${quizId}`);
      setQuiz(res.data);
    } catch (err) {
      console.error(err);
      setMsg("❌ Could not load quiz");
    }
  };

  const handleChange = (qId, value, reasoning) => {
    setAnswers({
      ...answers,
      [qId]: { selectedAnswer: value, reasoning },
    });
  };

  const handleSubmit = async () => {
    try {
      const formattedAnswers = Object.keys(answers).map((qid) => ({
        questionId: qid,
        selectedAnswer: answers[qid].selectedAnswer,
        reasoning: answers[qid].reasoning,
      }));

      const res = await api.post("/results/submit", {
        quizId,
        answers: formattedAnswers,
      });

      setMsg("✅ Submitted successfully!");
      navigate(`/results/${res.data.result._id}`);
    } catch (err) {
      console.error(err);
      setMsg("❌ " + (err.response?.data?.message || "Submission failed"));
    }
  };

  if (!quiz) return <p className="text-gray-400">{msg || "Loading quiz..."}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl text-green-400 font-bold">{quiz.title}</h2>
      <p className="text-gray-400 mb-6">{quiz.topic} • {quiz.difficulty}</p>

      <div className="space-y-6">
        {quiz.questions.map((q, i) => (
          <div key={q._id} className="bg-gray-900 p-4 rounded-2xl">
            <p className="text-white font-semibold">Q{i + 1}: {q.question}</p>

            <div className="space-y-2 mt-2">
              {q.options.map((opt, j) => (
                <label key={j} className="block text-gray-300">
                  <input
                    type="radio"
                    name={q._id}
                    value={opt}
                    onChange={() => handleChange(q._id, opt, answers[q._id]?.reasoning || "")}
                    checked={answers[q._id]?.selectedAnswer === opt}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>

            <textarea
              placeholder="Reasoning (optional)"
              value={answers[q._id]?.reasoning || ""}
              onChange={(e) =>
                handleChange(q._id, answers[q._id]?.selectedAnswer, e.target.value)
              }
              className="w-full mt-2 p-2 rounded bg-gray-800 text-white"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded">
        Submit Quiz
      </button>

      <p className="text-sm text-gray-400 mt-2">{msg}</p>
    </div>
  );
}
