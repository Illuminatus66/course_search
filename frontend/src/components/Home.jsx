import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearList, searchQuery } from "../actions/index";
import "./Home.css";
import ResultList from "./ResultList";
import CurrentSearchAnalysis from "./CurrentSearchAnalysis";

const Home = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
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
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
        <button
          onClick={handleClear}
          disabled={!list || list.length === 0}
          className="clear-button"
        >
          Clear List
        </button>
      </div>

      {list?.length > 0 && <CurrentSearchAnalysis />}

      <ResultList results={list} />
    </div>
  );
};

export default Home;
