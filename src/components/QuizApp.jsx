"use client";

import { useState, useEffect, useCallback } from "react";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";
import LoadingSpinner from "./LoadingSpinner";
import QuizSetupPage from "./QuizSetupPage";
import CountdownTimer from "./CountdownTimer";
import TimerSettings from "./TimerSettings";
import KeyboardShortcuts from "./KeyboardShortcuts";

const QuizApp = () => {
  // core quiz state
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // setup state
  const [showSetup, setShowSetup] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  // timer state
  const [timerDuration, setTimerDuration] = useState(30);
  const [isTimerEnabled, setIsTimerEnabled] = useState(true);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const decodeHtmlEntities = (text) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // read preferences from localStorage (if any)
      const prefRaw = localStorage.getItem("quizPreferences");
      let prefs = null;
      if (prefRaw) {
        try {
          prefs = JSON.parse(prefRaw);
        } catch {
          prefs = null;
        }
      }

      const amount = prefs?.numQuestions || 10;
      const categoryId = prefs?.category?.id || null;
      const difficulty = prefs?.difficulty?.toLowerCase() || null;
      const type = prefs?.questionType || null;

      if (prefs?.category?.name) setSelectedCategory(prefs.category.name);

      const params = new URLSearchParams();
      params.append("amount", amount);
      if (categoryId) params.append("category", categoryId);
      if (difficulty) params.append("difficulty", difficulty);
      if (type) params.append("type", type);

      const url = `https://opentdb.com/api.php?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed to fetch questions");

      const data = await response.json();
      if (data.response_code !== 0) {
        throw new Error(
          "No questions available for the selected options. Try changing the number/category/difficulty/type."
        );
      }

      // prepare questions: decode HTML and shuffle answers
      const processedQuestions = data.results.map((question) => {
        const answers = [
          ...question.incorrect_answers,
          question.correct_answer,
        ];
        const shuffledAnswers = answers.sort(() => Math.random() - 0.5);

        return {
          ...question,
          question: decodeHtmlEntities(question.question),
          correct_answer: decodeHtmlEntities(question.correct_answer),
          answers: shuffledAnswers.map((a) => decodeHtmlEntities(a)),
        };
      });

      setQuestions(processedQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswers([]);
      setQuizCompleted(false);
      setScore(0);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // load questions after user finishes setup
  useEffect(() => {
    if (!showSetup) {
      fetchQuestions();
    }
  }, [showSetup, fetchQuestions]);

  const handleAnswerSelect = (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion?.correct_answer;

    const answerData = {
      questionIndex: currentQuestionIndex,
      selectedAnswer,
      correctAnswer: currentQuestion?.correct_answer ?? null,
      isCorrect: Boolean(isCorrect),
    };

    setSelectedAnswers((prev) => [...prev, answerData]);
    if (isCorrect) setScore((prev) => prev + 1);

    // pause timer while moving to next
    setIsTimerPaused(true);

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsTimerPaused(false);
      }, 1000);
    } else {
      setTimeout(() => setQuizCompleted(true), 1000);
    }
  };

  const handleTimerExpired = () => {
    // treat expiration like selecting no answer
    handleAnswerSelect(null);
  };

  const handleTimerWarning = () => {
    // optional: sound or visual warning
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

  // show setup page until user starts quiz
  if (showSetup) {
    return <QuizSetupPage onStart={() => setShowSetup(false)} />;
  }

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
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
      <>
        <KeyboardShortcuts />
        <QuizResults
          score={score}
          totalQuestions={questions.length}
          onRestart={restartQuiz}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <KeyboardShortcuts />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Quiz Challenge
          </h1>
          <p className="text-purple-200 text-lg">
            Test your knowledge with {selectedCategory || "this topic"}{" "}
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
            className="bg-gradient-to-r from-pink-400 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${
                questions.length
                  ? ((currentQuestionIndex + 1) / questions.length) * 100
                  : 0
              }%`,
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
              Question {currentQuestionIndex + 1} of {questions.length || 0}
            </span>
          </div>
        </div>

        {questions.length > 0 && (
          <QuizQuestion
            question={questions[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={
              selectedAnswers[currentQuestionIndex]?.selectedAnswer
            }
            isTimerEnabled={isTimerEnabled}
          />
        )}
      </div>
    </div>
  );
};

export default QuizApp;
