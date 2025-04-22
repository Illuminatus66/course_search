import React from "react";
import { useNavigate } from "react-router-dom";
import "./ResultList.css";

const ResultList = ({ results }) => {
  const navigate = useNavigate();

  if (!results || results.length === 0) return null;

  return (
    <div className="result-list">
      {results.map((result, index) => (
        <div
          key={index}
          className="result-item"
          onClick={() =>
            navigate(`/document/${result.document}`, {
              state: { queryTerms: result.queryTerms },
            })
          }
        >
          <div className="result-header">
            <strong>{result.document}</strong>
            <span> — Score: {result.score.toFixed(3)}</span>
          </div>
          <div className="result-queryterms">
            {Array.isArray(result.queryTerms) && result.queryTerms.length > 0
              ? result.queryTerms.join(", ")
              : "No query terms."}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultList;
