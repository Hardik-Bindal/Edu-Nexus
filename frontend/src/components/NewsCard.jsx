import React from "react";

const NewsCard = ({ article }) => {
  return (
    <article className="panel panel-pad fade-up news-card">
      <div className="flex items-start justify-between gap-3">
        <h3 className="panel-title leading-snug">{article.title}</h3>
        <span className="badge">{article.category || "general"}</span>
      </div>

      <p className="panel-muted mt-2">{article.description || "No description available."}</p>

      <div className="news-footer">
        <span className="panel-muted">
          {new Date(article.publishedAt || article.createdAt).toLocaleString()}
        </span>
        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-sm"
          >
            Open Source
          </a>
        )}
      </div>
    </article>
  );
};

export default NewsCard;
