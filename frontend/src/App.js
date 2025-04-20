import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import DocumentView from "./components/DocumentView";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/document/:filename" element={<DocumentView />} />
      </Routes>
    </Router>
  );
};

export default App;
