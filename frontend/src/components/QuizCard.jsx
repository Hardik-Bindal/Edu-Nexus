import React from "react";

const difficultyClass = (difficulty) => {
  if (difficulty === "easy") return "badge badge-easy";
  if (difficulty === "hard") return "badge badge-hard";
  return "badge badge-medium";
};

const QuizCard = ({
  quiz,
  onAttempt,
  onEdit,
  onDelete,
  onViewResults,
  showTeacherActions = false,
}) => {
  const questionCount = Array.isArray(quiz.questions) ? quiz.questions.length : null;

  return (
    <article className="panel panel-pad fade-up quiz-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="panel-title">{quiz.title}</h3>
          <p className="quiz-card-subtitle">
            {quiz.topic || "General"} · {quiz.level || "Unspecified level"}
          </p>
        </div>

        <div className="quiz-card-meta">
          <span className={difficultyClass(quiz.difficulty)}>
            {(quiz.difficulty || "medium").toUpperCase()}
          </span>
          <span className="badge">{quiz.timeLimit || 0} min</span>
          {questionCount !== null && <span className="badge">{questionCount} Q</span>}
        </div>
      </div>

      <div className="quiz-card-actions">
        {onAttempt && (
          <button type="button" onClick={() => onAttempt(quiz._id)} className="btn btn-primary btn-sm">
            Attempt Quiz
          </button>
        )}

        {showTeacherActions && onEdit && (
          <button type="button" onClick={() => onEdit(quiz._id)} className="btn btn-warning btn-sm">
            Edit
          </button>
        )}

        {showTeacherActions && onViewResults && (
          <button
            type="button"
            onClick={() => onViewResults(quiz._id)}
            className="btn btn-secondary btn-sm"
          >
            Results
          </button>
        )}

        {showTeacherActions && onDelete && (
          <button type="button" onClick={() => onDelete(quiz._id)} className="btn btn-danger btn-sm">
            Delete
          </button>
        )}
      </div>
    </article>
  );
};

export default QuizCard;
