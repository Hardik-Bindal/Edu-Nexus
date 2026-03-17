import React from "react";

const FactCard = ({ fact }) => {
  if (!fact) {
    return <div className="status status-info">No fact available right now.</div>;
  }

  return (
    <article className="panel panel-pad fade-up fact-card">
      <div className="flex items-center justify-between gap-3">
        <h3 className="panel-title">Did You Know?</h3>
        <span className="badge">{fact.category || "general"}</span>
      </div>

      <p className="fact-text">{fact.factText}</p>

      <p className="panel-muted mt-4">
        Added on {new Date(fact.createdAt).toLocaleString()}
      </p>
    </article>
  );
};

export default FactCard;
