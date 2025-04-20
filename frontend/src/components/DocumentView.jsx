import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchDocument } from "../actions";
import { useDispatch } from "react-redux";

function highlightMatches(text, queryTerms) {
  if (!queryTerms || queryTerms.length === 0) return text;

  const pattern = new RegExp(`(${queryTerms.join("|")})`, "gi");
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

function DocumentView() {
  const { filename } = useParams();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const location = useLocation();

  const queryTerms = location.state?.queryTerms || [];

  const [document, setDocument] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchdocument = async () => {
      try {
        const data = await dispatch(fetchDocument(filename));
        setDocument(data.content);
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
  }, [dispatch, filename, navigate]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          width: "85%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
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
        <div style={{ width: "120px" }} /> {/* Dummy for button space symmetry */}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            width: "85%",
            height: "60vh",
            overflowY: "scroll",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
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
