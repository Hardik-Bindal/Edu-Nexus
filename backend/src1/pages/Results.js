import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

export default function Result() {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadResult();
  }, []);

  const loadResult = async () => {
    try {
      const res = await api.get(`/results/${resultId}`);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!result) return <p className="text-gray-400">Loading result...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl text-green-400 font-bold">📊 Result</h2>
      <p className="text-gray-300 mb-4">
        {result.quiz?.title} — {result.score}/{result.total}
      </p>

      <div className="space-y-4">
        {result.answers.map((a, i) => (
          <div key={a._id} className="bg-gray-900 p-4 rounded-2xl">
            <p className="text-white font-semibold">Q{i + 1}</p>
            <p className="text-sm text-gray-400">Selected: {a.selectedAnswer || "—"}</p>
            <p className="text-sm text-gray-400">Correct: {a.isCorrect ? "✅ Yes" : "❌ No"}</p>
            {a.reasoning && (
              <p className="text-sm text-blue-300 mt-1">
                Reasoning: {a.reasoning}
              </p>
            )}
            {!a.isCorrect && (
              <p className="text-sm text-red-400 mt-1">
                Explanation: {a.explanation || "N/A"}
              </p>
            )}
            <p className="text-sm text-yellow-300 mt-1">Marks: {a.obtainedMarks}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
