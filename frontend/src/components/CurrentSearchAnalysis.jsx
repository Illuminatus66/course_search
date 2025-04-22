import React from "react";
import "./CurrentSearchAnalysis.css";
import { useSelector } from "react-redux";

const CurrentSearchAnalysis = () => {
  const analysis = useSelector((state) => state.list.analysis);
  if (!analysis) return null;

  return (
    <div className="analysis-box">
      <h3>Current Search Analysis</h3>
      <p><strong>Query:</strong> {analysis.query}</p>
      <p><strong>Terms:</strong> {analysis.query_length}</p>
      <p><strong>Matches Found:</strong> {analysis.total_documents_matched}</p>
      <p><strong>Exact Phrase In:</strong> {analysis.exact_phrase_found_in} document(s)</p>
      <p><strong>Highest Score:</strong> {analysis.highest_score}</p>
      <p><strong>Search Time:</strong> {analysis.search_duration}s</p>
    </div>
  );
};

export default CurrentSearchAnalysis;
