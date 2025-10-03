import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizApp from "./components/QuizApp";
import BookmarkedQuestions from "./components/BookmarkedQuestions";
import BadgesPage from "./components/BadgesPage";
import FAQPage from "./components/FAQPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<QuizApp />} />
                <Route path="/bookmarks" element={<BookmarkedQuestions />} />
                <Route path="/badges" element={<BadgesPage />} />
                <Route path="/faq" element={<FAQPage />} />
            </Routes>
        </Router>
    );
}

export default App;
