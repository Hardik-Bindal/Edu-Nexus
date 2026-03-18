import React, { useMemo, useState } from "react";

const RenderSudoku = ({ puzzle, solution, showAnswer }) => {
  // Parse the string into a 9x9 grid, ignoring grid borders like "---" and "|"
  const parseGrid = (str) => {
    return str
      .split("\n")
      .filter((line) => !line.includes("---"))
      .map((line) =>
        line
          .replace(/\|/g, "")
          .trim()
          .split(/\s+/)
          .map((char) => (char === "." ? "" : char))
      );
  };

  const initialGrid = useMemo(() => parseGrid(puzzle), [puzzle]);
  const solutionGrid = useMemo(() => parseGrid(solution), [solution]);
  const [grid, setGrid] = useState(initialGrid);

  const handleChange = (r, c, val) => {
    if (val.length > 1) val = val.slice(-1); // Only allow 1 char
    if (val && !/^[1-9]$/.test(val)) return; // Only 1-9 allowed
    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = val;
    setGrid(newGrid);
  };

  const checkWin = () => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = grid[r][c] || "";
        const expected = solutionGrid[r][c] || "";
        if (val !== expected) return false;
      }
    }
    return true;
  };

  const isWin = checkWin();

  return (
    <div className="sudoku-container mt-4">
      {isWin && (
        <div className="status status-ok mb-4 animate-pulse">
          🎉 Brilliant! You solved the Sudoku completely!
        </div>
      )}
      <div className="sudoku-board">
        {grid.map((row, rIndex) => (
          <div key={rIndex} className="sudoku-row">
            {row.map((cell, cIndex) => {
              const isInitial = initialGrid[rIndex][cIndex] !== "";
              const val = showAnswer ? solutionGrid[rIndex][cIndex] : cell;
              const isError =
                !showAnswer &&
                !isInitial &&
                val !== "" &&
                val !== solutionGrid[rIndex][cIndex];

              return (
                <input
                  key={cIndex}
                  type="text"
                  value={val}
                  disabled={isInitial || showAnswer || isWin}
                  onChange={(e) => handleChange(rIndex, cIndex, e.target.value)}
                  className={`sudoku-cell ${
                    isInitial ? "sudoku-cell-initial" : "sudoku-cell-input"
                  } ${isError ? "sudoku-cell-error" : ""}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

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
          <RenderSudoku
            puzzle={game.content.puzzle}
            solution={game.content.solution}
            showAnswer={showAnswer}
          />
          <div className="flex justify-start mt-4">
            <button
              type="button"
              onClick={() => setShowAnswer((prev) => !prev)}
              className="btn btn-secondary btn-sm"
            >
              {showAnswer ? "Hide Solution" : "Give Up & Show Solution"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

export default GameCard;
