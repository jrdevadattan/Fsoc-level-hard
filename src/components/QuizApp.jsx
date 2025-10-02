"use client";

import { useState, useEffect, useCallback } from "react";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";
import LoadingSpinner from "./LoadingSpinner";
import QuizSetupPage from "./QuizSetupPage";
import CountdownTimer from "./CountdownTimer";
import TimerSettings from "./TimerSettings";
import KeyboardShortcuts from "./KeyboardShortcuts";
import PauseOverlay from "./PauseOverlay";
import QuizStateManager from "../utils/QuizStateManager";
import BookmarkManager from "../utils/BookmarkManager";

const QuizApp = () => {
  // Core quiz state: questions, index, answers and score
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Setup UI: show setup screen and selected category
  const [showSetup, setShowSetup] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Timer state
  const [timerDuration, setTimerDuration] = useState(30);
  const [isTimerEnabled, setIsTimerEnabled] = useState(true);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Pause state and misc UI toggles
  const [isQuizPaused, setIsQuizPaused] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [showSkippedList, setShowSkippedList] = useState(false);

  // TTS/result announcement state (used to auto-advance)
  const [isResultAnnouncementComplete, setIsResultAnnouncementComplete] = useState(false);

  // Helper: decode HTML entities coming from the API
  const decodeHtmlEntities = (text) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  // Save / load quiz state using QuizStateManager
  const saveQuizState = useCallback(() => {
    if (questions.length === 0) return;

    const state = QuizStateManager.createQuizState({
      questions,
      currentQuestionIndex,
      selectedAnswers,
      score,
      timeRemaining,
      timerDuration,
      isTimerEnabled,
      selectedCategory,
      quizStartTime,
    });

    QuizStateManager.saveQuizState(state);
  }, [
    questions,
    currentQuestionIndex,
    selectedAnswers,
    score,
    timeRemaining,
    timerDuration,
    isTimerEnabled,
    selectedCategory,
    quizStartTime,
  ]);

  const loadSavedQuizState = useCallback(() => {
    const savedState = QuizStateManager.loadQuizState();
    if (!savedState) return false;

    setQuestions(savedState.questions);
    setCurrentQuestionIndex(savedState.currentQuestionIndex);
    setSelectedAnswers(savedState.selectedAnswers);
    setScore(savedState.score);
    setTimeRemaining(savedState.timeRemaining);
    setTimerDuration(savedState.timerDuration);
    setIsTimerEnabled(savedState.isTimerEnabled);
    setSelectedCategory(savedState.selectedCategory);
    setQuizStartTime(savedState.quizStartTime);
    setIsQuizPaused(true);

    return true;
  }, []);

  // Pause/resume handling — saves state when pausing
  const handlePauseToggle = useCallback(() => {
    if (quizCompleted || showSetup) return;

    if (isQuizPaused) {
      setIsQuizPaused(false);
      setIsTimerPaused(false);
      QuizStateManager.clearQuizState();
    } else {
      setIsQuizPaused(true);
      setIsTimerPaused(true);
      saveQuizState();
    }
  }, [isQuizPaused, quizCompleted, showSetup, saveQuizState]);

  // Fetch questions from OpenTDB and initialize quiz
  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const prefRaw = localStorage.getItem("quizPreferences");
      let prefs = null;
      if (prefRaw) {
        try { prefs = JSON.parse(prefRaw); } catch { prefs = null; }
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
      if (data.response_code !== 0) throw new Error("No questions available for selected options.");

      const processedQuestions = data.results.map((q) => {
        const answers = [...q.incorrect_answers, q.correct_answer];
        const shuffled = answers.sort(() => Math.random() - 0.5);
        return {
          ...q,
          question: decodeHtmlEntities(q.question),
          correct_answer: decodeHtmlEntities(q.correct_answer),
          answers: shuffled.map((a) => decodeHtmlEntities(a)),
          id: BookmarkManager.generateQuestionId(q),
        };
      });

      setQuestions(processedQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswers([]);
      setQuizCompleted(false);
      setScore(0);
      setTimeRemaining(isTimerEnabled ? timerDuration : null);
      setIsQuizPaused(false);
      setIsTimerPaused(false);
      setIsResultAnnouncementComplete(false);
      setQuizStartTime(Date.now());
      QuizStateManager.clearQuizState();
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [timerDuration, isTimerEnabled]);

  // Auto-save the quiz state periodically while running
  useEffect(() => {
    if (!isQuizPaused && questions.length > 0 && !quizCompleted && !showSetup) {
      const interval = setInterval(saveQuizState, 5000);
      return () => clearInterval(interval);
    }
  }, [isQuizPaused, questions.length, quizCompleted, showSetup, saveQuizState]);

  // After setup: try to load saved state, otherwise fetch new questions
  useEffect(() => {
    if (!showSetup) {
      const hasSavedState = loadSavedQuizState();
      if (!hasSavedState) fetchQuestions();
    }
  }, [showSetup, loadSavedQuizState, fetchQuestions]);

  // Auto-pause when the tab/window becomes hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isQuizPaused && !quizCompleted && !showSetup) {
        handlePauseToggle();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isQuizPaused, quizCompleted, showSetup, handlePauseToggle]);

  // Handle answer selection for the current question
  const handleAnswerSelect = (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion?.correct_answer;
    const answerData = {
      questionIndex: currentQuestionIndex,
      selectedAnswer,
      correctAnswer: currentQuestion?.correct_answer ?? null,
      isCorrect: Boolean(isCorrect),
      isSkipped: false,
    };

    setSelectedAnswers((prev) => {
      const copy = Array.from(prev || []);
      copy[currentQuestionIndex] = answerData;
      return copy;
    });
    if (isCorrect) setScore((prev) => prev + 1);

    // Pause timer until result announcement (TTS)
    setIsTimerPaused(true);
    setIsResultAnnouncementComplete(false);
  };

  // Auto-advance logic runs after result announcement (TTS finishes)
  useEffect(() => {
    if (isResultAnnouncementComplete && selectedAnswers[currentQuestionIndex]) {
      const moveToNext = () => {
        const findNextPending = (from) => {
          // Find next unanswered (no entry) first
          for (let i = from + 1; i < questions.length; i++) {
            const a = selectedAnswers[i];
            if (!a || (a && a.isSkipped)) return i;
          }
          // If none ahead, look from start
          for (let i = 0; i < questions.length; i++) {
            const a = selectedAnswers[i];
            if (!a || (a && a.isSkipped)) return i;
          }
          return -1;
        };

        const next = findNextPending(currentQuestionIndex);
        if (next !== -1 && next !== currentQuestionIndex) {
          setCurrentQuestionIndex(next);
          setIsTimerPaused(false);
          setIsResultAnnouncementComplete(false);
        } else {
          // If no pending (all answered and none skipped), finish quiz
          const anyPending = questions.some((_, idx) => {
            const a = selectedAnswers[idx];
            return !a || (a && a.isSkipped);
          });
          if (anyPending) {
            // go to first pending (could be same index)
            const firstPending = selectedAnswers.findIndex((a, i) => !a || (a && a.isSkipped));
            if (firstPending !== -1) {
              setCurrentQuestionIndex(firstPending);
              setIsTimerPaused(false);
              setIsResultAnnouncementComplete(false);
              return;
            }
          }
          setQuizCompleted(true);
        }
      };
      setTimeout(moveToNext, 300);
    }
  }, [isResultAnnouncementComplete, currentQuestionIndex, questions.length, selectedAnswers]);

  // Mark a question as skipped and advance to the next pending
  const handleSkip = (questionIndex) => {
    const qIndex = typeof questionIndex === 'number' ? questionIndex : currentQuestionIndex;
    const currentQuestion = questions[qIndex];
    if (!currentQuestion) return;

    const skipData = {
      questionIndex: qIndex,
      selectedAnswer: null,
      correctAnswer: currentQuestion.correct_answer || null,
      isCorrect: false,
      isSkipped: true,
    };

    setSelectedAnswers((prev) => {
      const copy = Array.from(prev || []);
      copy[qIndex] = skipData;
      return copy;
    });

    // Move forward to next unanswered/skipped
    const next = (() => {
      for (let i = qIndex + 1; i < questions.length; i++) {
        if (!selectedAnswers[i]) return i;
      }
      for (let i = 0; i < questions.length; i++) {
        if (!selectedAnswers[i]) return i;
      }
      return -1;
    })();

    if (next !== -1) {
      setCurrentQuestionIndex(next);
    } else {
      // If none unanswered, try to go to any skipped question
      const firstSkipped = (selectedAnswers || []).findIndex((a) => a && a.isSkipped);
      if (firstSkipped !== -1) setCurrentQuestionIndex(firstSkipped);
      else setQuizCompleted(true);
    }
  };

  // Timer callbacks forwarded to question/timer components
  const handleTimerExpired = () => handleAnswerSelect(null);
  const handleTimerWarning = () => console.log("Timer warning: 10 seconds remaining");

  const handleResultAnnounced = () => setIsResultAnnouncementComplete(true);

  // Reset everything and go back to setup screen
  const handleBackToSetup = useCallback(() => {
    QuizStateManager.clearQuizState();
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setQuizCompleted(false);
    setScore(0);
    setError(null);
    setIsQuizPaused(false);
    setIsTimerPaused(false);
    setTimeRemaining(null);
    setQuizStartTime(null);
    setShowSetup(true);
  }, []);

  // Restart: fetch a fresh set of questions
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setQuizCompleted(false);
    setScore(0);
    setIsTimerPaused(false);
    setIsResultAnnouncementComplete(false);
    fetchQuestions();
  };

  // Render
  if (showSetup) return <QuizSetupPage onStart={() => setShowSetup(false)} />;
  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchQuestions}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={handleBackToSetup}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              ⚙️ Back to Setup
            </button>
          </div>
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
          onBackToSetup={handleBackToSetup}
          skippedCount={selectedAnswers.filter((a) => a && a.isSkipped).length}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <KeyboardShortcuts onPauseToggle={handlePauseToggle} isPaused={isQuizPaused} />

      <PauseOverlay
        isVisible={isQuizPaused}
        onResume={handlePauseToggle}
        currentQuestionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        timeRemaining={timeRemaining}
        score={score}
        onBackToSetup={handleBackToSetup}
      />

      <div className="max-w-4xl mx-auto pt-4">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Quiz Challenge</h1>
          <p className="text-purple-200 text-lg">
            Test your knowledge with {selectedCategory || "this topic"} questions!
          </p>

          {/* Timer / Settings */}
          <div className="absolute top-0 right-0 flex gap-2">
            <button
              onClick={handlePauseToggle}
              disabled={quizCompleted}
              className={`flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40 ${
                quizCompleted ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              aria-label={isQuizPaused ? "Resume quiz" : "Pause quiz"}
              title={isQuizPaused ? "Resume quiz (Spacebar)" : "Pause quiz (Spacebar)"}
            >
              <span className="text-lg">{isQuizPaused ? "▶️" : "⏸️"}</span>
            </button>
            <TimerSettings
              currentDuration={timerDuration}
              onDurationChange={setTimerDuration}
              isTimerEnabled={isTimerEnabled}
              onTimerToggle={setIsTimerEnabled}
            />
          </div>
        </div>

        {/* Progress Bar (answered vs skipped) */}
        {questions.length > 0 && (
          (() => {
            const answeredCount = selectedAnswers.filter((a) => a && !a.isSkipped).length;
            const skippedCount = selectedAnswers.filter((a) => a && a.isSkipped).length;
            const answeredWidth = ((answeredCount / questions.length) * 100) || 0;
            const skippedWidth = ((skippedCount / questions.length) * 100) || 0;
            return (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-white">Answered: {answeredCount} / {questions.length}</div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-yellow-100">⏭️ Skipped: {skippedCount}</div>
                    <button
                      onClick={() => setShowSkippedList((s) => !s)}
                      className="bg-white/10 text-white px-3 py-1 rounded-full text-sm hover:bg-white/20"
                    >
                      {showSkippedList ? 'Hide Skipped' : 'View Skipped'}
                    </button>
                  </div>
                </div>

                <div className="bg-white/20 rounded-full h-3 mb-2 overflow-hidden relative">
                  <div
                    className="bg-green-400 h-full rounded-l-full transition-all duration-500"
                    style={{ width: `${answeredWidth}%` }}
                  />
                  <div
                    className="bg-yellow-400 h-full transition-all duration-500 absolute left-0"
                    style={{ width: `${answeredWidth + skippedWidth}%`, clipPath: `inset(0 ${100 - (answeredWidth + skippedWidth)}% 0 ${answeredWidth}%)` }}
                  />
                </div>

                {showSkippedList && (
                  <div className="bg-white/10 p-3 rounded-lg text-white">
                    <div className="text-sm font-semibold mb-2">Skipped Questions</div>
                    <div className="flex gap-2 flex-wrap">
                      {selectedAnswers.map((a, idx) => (
                        a && a.isSkipped ? (
                          <button
                            key={idx}
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold"
                          >
                            #{idx + 1}
                          </button>
                        ) : null
                      ))}
                      {selectedAnswers.filter((a) => a && a.isSkipped).length === 0 && (
                        <div className="text-sm text-yellow-100">No skipped questions yet.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        )}

        {/* Countdown Timer */}
        {isTimerEnabled && timerDuration > 0 && (
          <div className="mb-6">
            <CountdownTimer
              duration={timerDuration}
              onTimeUp={handleTimerExpired}
              isActive={!quizCompleted}
              isPaused={isTimerPaused || isQuizPaused}
              onWarning={handleTimerWarning}
              showWarningAt={10}
              initialTimeRemaining={timeRemaining}
              onTimeUpdate={setTimeRemaining}
              key={`timer-${currentQuestionIndex}`}
            />
          </div>
        )}

        {/* Question Counter */}
        <div className="text-center mb-6">
          <span className="bg-white/20 text-white px-4 py-2 rounded-full text-lg font-semibold">
            Question {currentQuestionIndex + 1} of {questions.length || 0}
          </span>
        </div>

        {/* Current Question */}
        {questions.length > 0 && !isQuizPaused && (
          <QuizQuestion
            question={questions[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={selectedAnswers[currentQuestionIndex]?.selectedAnswer}
            isTimerEnabled={isTimerEnabled}
            onResultAnnounced={handleResultAnnounced}
            onSkip={() => handleSkip(currentQuestionIndex)}
            isSkipped={Boolean(selectedAnswers[currentQuestionIndex]?.isSkipped)}
          />
        )}
      </div>
    </div>
  );
};

export default QuizApp;
