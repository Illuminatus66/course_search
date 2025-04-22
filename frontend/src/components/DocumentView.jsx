import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchDocument } from "../actions";
import { useDispatch } from "react-redux";

function highlightMatches(text, queryTerms) {
  if (!queryTerms || queryTerms.length === 0) return text;

  // Escape regex special characters in terms
  const escapedTerms = queryTerms.map((term) =>
    term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  // Word boundary version
  const pattern = new RegExp(`\\b(${escapedTerms.join("|")})\\b`, "gi");

  return text
    .split(pattern)
    .map((part, index) =>
      queryTerms.some((term) => part.toLowerCase() === term.toLowerCase()) ? (
        <mark key={index}>{part}</mark>
      ) : (
        part
      )
    );
}

function countMatches(text, queryTerms) {
  if (!queryTerms || queryTerms.length === 0 || !text) return {};

  const termCounts = {};
  queryTerms.forEach((term) => {
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\\b(${escapedTerm})\\b`, "gi");
    const matches = text.match(pattern);
    termCounts[term] = matches ? matches.length : 0;
  });

  return termCounts;
}

function DocumentView() {
  const { filename } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const queryTerms = useMemo(
    () => location.state?.queryTerms || [],
    [location.state]
  );

  const [document, setDocument] = useState("");
  const [matchSummary, setMatchSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchdocument = async () => {
      try {
        const data = await dispatch(fetchDocument(filename));
        setDocument(data.content);
        setMatchSummary(countMatches(data.content, queryTerms));
      } catch (err) {
        if (err.response && err.response.status === 404) {
          navigate(-1);
        } else {
          setDocument("Error fetching document.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchdocument();
  }, [dispatch, filename, navigate, queryTerms]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "black",
        paddingTop: "2rem",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          width: "85%",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1.5rem",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "0.4rem 0.8rem",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ← Back to Search
          </button>
          <h2 style={{ margin: 0, textAlign: "center", flexGrow: 1 }}>
            {filename}
          </h2>
          <div style={{ width: "120px" }} /> {/* Spacer for alignment */}
        </div>

        {!loading && queryTerms.length > 0 && (
          <div style={{ marginTop: "1rem", fontSize: "1rem" }}>
            <strong>Matched Terms:</strong>
            <ul style={{ marginTop: "0.3rem" }}>
              {queryTerms.map((term) => (
                <li
                  key={term}
                  style={{
                    color: matchSummary[term] > 0 ? "limegreen" : "orangered",
                  }}
                >
                  {term}: {matchSummary[term] || 0} occurrence
                  {(matchSummary[term] || 0) !== 1 ? "s" : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Document Viewer */}
      {loading ? (
        <p style={{ color: "white" }}>Loading...</p>
      ) : (
        <div
          style={{
            width: "85%",
            height: "60vh",
            overflowY: "scroll",
            border: "1px solid rgba(0,0,0,0.3)",
            borderRadius: "8px",
            padding: "1rem",
            backgroundColor: "#f5f5f5",
            color: "black",
            whiteSpace: "pre-wrap",
            textAlign: "left",
          }}
        >
          {highlightMatches(document, queryTerms)}
        </div>
      )}
    </div>
  );
}

export default DocumentView;
