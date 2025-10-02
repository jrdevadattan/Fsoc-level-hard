import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizApp from "./components/QuizApp";
import BookmarkedQuestions from "./components/BookmarkedQuestions";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<QuizApp />} />
                <Route path="/bookmarks" element={<BookmarkedQuestions />} />
            </Routes>
        </Router>
    );
}

export default App;
