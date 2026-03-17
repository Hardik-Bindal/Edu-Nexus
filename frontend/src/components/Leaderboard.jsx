import React from "react";

const Leaderboard = ({ entries = [] }) => {
  if (!entries.length) {
    return <div className="status status-info">No leaderboard data yet.</div>;
  }

  return (
    <section className="panel panel-pad fade-up">
      <h3 className="panel-title">Leaderboard</h3>
      <p className="panel-muted mt-1">Top learners by eco points</p>

      <ol className="leaderboard-list">
        {entries.map((entry, index) => (
          <li key={entry._id || `${entry.name}-${index}`} className="leaderboard-row">
            <div className="leaderboard-person">
              <span className="leaderboard-rank">#{index + 1}</span>
              <span className="font-medium">{entry.name}</span>
            </div>
            <span className="leaderboard-points">
              {entry.ecoPoints} pts · L{entry.level || 1}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default Leaderboard;
