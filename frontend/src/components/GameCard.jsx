import React, { useMemo, useState } from "react";

const GameCard = ({ game }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [guess, setGuess] = useState("");

  const feedback = useMemo(() => {
    if (!game || game.type !== "scramble" || !guess) return "";
    return guess.trim().toLowerCase() === game.content.answer.toLowerCase()
      ? "Perfect. You solved it."
      : "Not quite. Try another guess.";
  }, [game, guess]);

  if (!game) {
    return <div className="status status-info">No game available right now.</div>;
  }

  return (
    <article className="panel panel-pad fade-up game-card">
      <div className="flex items-center justify-between">
        <h3 className="panel-title capitalize">{game.type} Challenge</h3>
        <span className="badge">Daily Puzzle</span>
      </div>

      {game.type === "riddle" && (
        <div className="mt-4 stack-3">
          <p className="game-prompt">{game.content.q}</p>
          {showAnswer && (
            <p className="status status-ok">Answer: {game.content.a}</p>
          )}
          <button
            type="button"
            onClick={() => setShowAnswer((prev) => !prev)}
            className="btn btn-secondary btn-sm"
          >
            {showAnswer ? "Hide Answer" : "Reveal Answer"}
          </button>
        </div>
      )}

      {game.type === "scramble" && (
        <div className="mt-4 stack-3">
          <p className="game-prompt">Unscramble this word: {game.content.scrambled}</p>
          <input
            value={guess}
            onChange={(event) => setGuess(event.target.value)}
            placeholder="Type your guess"
            className="field"
          />
          {feedback && (
            <p className={`status ${feedback.startsWith("Perfect") ? "status-ok" : "status-info"}`}>
              {feedback}
            </p>
          )}
        </div>
      )}

      {game.type === "sudoku" && (
        <div className="mt-4 stack-3">
          <p className="panel-muted break-all">{game.content.puzzle}</p>
          <button
            type="button"
            onClick={() => setShowAnswer((prev) => !prev)}
            className="btn btn-secondary btn-sm"
          >
            {showAnswer ? "Hide Solution" : "Show Solution"}
          </button>
          {showAnswer && (
            <p className="game-answer">{game.content.solution}</p>
          )}
        </div>
      )}
    </article>
  );
};

export default GameCard;
