import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearList, searchQuery } from "../actions/index";
import "./Home.css";

const Home = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const list = useSelector((state) => state.list.list);

  const handleSearch = async () => {
    if (!query) return;
    dispatch(searchQuery(query));
  };

  const handleClear = () => {
    dispatch(clearList());
  };

  return (
    <div className="home-container">
      <div className="search-area">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the database..."
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleClear} disabled={!list || list.length === 0}>
          Clear List
        </button>
      </div>

      {list && list.length > 0 && (
        <div className="result-list">
          {list.map((result, index) => (
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
                {Array.isArray(result.queryTerms) &&
                result.queryTerms.length > 0
                  ? result.queryTerms.join(", ")
                  : "No query terms."}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
