import { useState, useEffect, useCallback } from "react";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";
import LoadingSpinner from "./LoadingSpinner";
import CountdownTimer from "./CountdownTimer";
import TimerSettings from "./TimerSettings";

const QuizApp = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const [timerDuration, setTimerDuration] = useState(30);
    const [isTimerEnabled, setIsTimerEnabled] = useState(true);
    const [isTimerPaused, setIsTimerPaused] = useState(false);

    const fetchQuestions = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(
                "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple",
            );

            if (!response.ok) {
                throw new Error("Failed to fetch questions");
            }

            const data = await response.json();

            if (data.response_code !== 0) {
                throw new Error("No questions available");
            }

            // Process questions to decode HTML entities and shuffle answers
            const processedQuestions = data.results.map((question) => {
                const answers = [
                    ...question.incorrect_answers,
                    question.correct_answer,
                ];
                // Shuffle answers
                const shuffledAnswers = answers.sort(() => Math.random() - 0.5);

                return {
                    ...question,
                    question: decodeHtmlEntities(question.question),
                    correct_answer: decodeHtmlEntities(question.correct_answer),
                    answers: shuffledAnswers.map((answer) =>
                        decodeHtmlEntities(answer),
                    ),
                };
            });

            setQuestions(processedQuestions);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const decodeHtmlEntities = (text) => {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = text;
        return textarea.value;
    };

    const handleAnswerSelect = (selectedAnswer) => {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.correct_answer;

        const answerData = {
            questionIndex: currentQuestionIndex,
            selectedAnswer,
            correctAnswer: currentQuestion.correct_answer,
            isCorrect,
        };

        setSelectedAnswers([...selectedAnswers, answerData]);

        if (isCorrect) {
            setScore(score + 1);
        }

        // Pause timer when answer is selected
        setIsTimerPaused(true);

        // Move to next question or complete quiz
        if (currentQuestionIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setIsTimerPaused(false);
            }, 1000);
        } else {
            setTimeout(() => {
                setQuizCompleted(true);
            }, 1000);
        }
    };

    const handleTimerExpired = () => {
        // Auto-advance to next question when timer expires
        handleAnswerSelect(null, 0);
    };

    const handleTimerWarning = () => {
        // Optional: Could add sound notification here
        console.log("Timer warning: 10 seconds remaining");
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setQuizCompleted(false);
        setScore(0);
        setIsTimerPaused(false);
        fetchQuestions();
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Oops! Something went wrong
                    </h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchQuestions}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (quizCompleted) {
        return (
            <QuizResults
                score={score}
                totalQuestions={questions.length}
                onRestart={restartQuiz}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 relative">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        Quiz Challenge
                    </h1>
                    <p className="text-purple-200 text-lg">
                        Test your knowledge with these Computer Science
                        questions!
                    </p>
                    <div className="absolute top-0 right-0">
                        <TimerSettings
                            currentDuration={timerDuration}
                            onDurationChange={setTimerDuration}
                            isTimerEnabled={isTimerEnabled}
                            onTimerToggle={setIsTimerEnabled}
                        />
                    </div>
                </div>

                <div className="bg-white/20 rounded-full h-3 mb-8 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                        }}
                    ></div>
                </div>

                <div className="mb-6">
                    {isTimerEnabled && timerDuration > 0 && (
                        <div className="mb-6">
                            <CountdownTimer
                                duration={timerDuration}
                                onTimeUp={handleTimerExpired}
                                isActive={!quizCompleted}
                                isPaused={isTimerPaused}
                                onWarning={handleTimerWarning}
                                showWarningAt={10}
                                key={`timer-${currentQuestionIndex}`}
                            />
                        </div>
                    )}

                    <div className="text-center">
                        <span className="bg-white/20 text-white px-4 py-2 rounded-full text-lg font-semibold">
                            Question {currentQuestionIndex + 1} of{" "}
                            {questions.length}
                        </span>
                    </div>
                </div>

                {questions.length > 0 && (
                    <QuizQuestion
                        question={questions[currentQuestionIndex]}
                        onAnswerSelect={handleAnswerSelect}
                        selectedAnswer={
                            selectedAnswers[currentQuestionIndex]
                                ?.selectedAnswer
                        }
                        isTimerEnabled={isTimerEnabled}
                    />
                )}
            </div>
        </div>
    );
};

export default QuizApp;
