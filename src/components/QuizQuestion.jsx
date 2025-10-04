"use client";

import { useState, useEffect } from "react";
import BookmarkManager from "../utils/BookmarkManager";
import BadgeManager from "../utils/BadgeManager";
import VoiceControls from "./VoiceControls";
import VoiceSettings from "./VoiceSettings";
import { useVoice } from "../hooks/useVoice";

const QuizQuestion = ({
    question,
    onAnswerSelect,
    selectedAnswer,
    isTimerEnabled,
    onResultAnnounced,
    hintsRemaining, // centralized remaining hints
    onRequestHint, // centralized hint request
    timeRemaining, // timer value for shuffle synchronization
    isTimerPaused, // pause state for shuffle control
}) => {
    // Local state
    const [clickedAnswer, setClickedAnswer] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isTimedOut, setIsTimedOut] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [isAnnouncingResult, setIsAnnouncingResult] = useState(false);
    const [hasResultBeenAnnounced, setHasResultBeenAnnounced] = useState(false);
    const [questionStartTime, setQuestionStartTime] = useState(null);
    const [hintsUsed, setHintsUsed] = useState(0); // per-question usage
    const [showHint, setShowHint] = useState(false);
    const [eliminatedIndices, setEliminatedIndices] = useState(new Set());
    const [shuffledIndices, setShuffledIndices] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);
    const [lastShuffleTime, setLastShuffleTime] = useState(null);
    const [shuffleCounter, setShuffleCounter] = useState(0);

    const {
        isListening,
        isSpeaking,
        transcript,
        voiceSettings,
        availableVoices,
        microphonePermission,
        speak,
        stopSpeaking,
        startListening,
        stopListening,
        parseVoiceAnswer,
        updateVoiceSettings,
        setTranscript,
    } = useVoice();

    // Reset state when question changes
    useEffect(() => {
        setClickedAnswer(null);
        setIsTimedOut(false);
        setShowResult(false);
        setIsAnnouncingResult(false);
        setHasResultBeenAnnounced(false);
        setQuestionStartTime(Date.now());
        stopSpeaking();
        setTranscript("");
        setHintsUsed(0);
        setEliminatedIndices(new Set());
        // FIX: Initialize indices based on the actual number of answers
        setShuffledIndices(
            Array.from({ length: question.answers.length }, (_, i) => i).sort(
                () => Math.random() - 0.5
            )
        );
        setIsShuffling(false);
        setLastShuffleTime(null);
        setShuffleCounter(0);

        const questionId =
            question.id || BookmarkManager.generateQuestionId(question);
        setIsBookmarked(BookmarkManager.isBookmarked(questionId));
        setShowHint(false);
    }, [question]);

    // Show result when answer selected or timed out
    useEffect(() => {
        if ((selectedAnswer || clickedAnswer || isTimedOut) && !showResult) {
            setShowResult(true);
        }
    }, [selectedAnswer, clickedAnswer, isTimedOut]);

    // Timer-synchronized shuffle effect (every 3 seconds)
    useEffect(() => {
        if (
            isTimerEnabled &&
            timeRemaining !== null &&
            timeRemaining !== lastShuffleTime &&
            !selectedAnswer &&
            !clickedAnswer &&
            !isTimedOut &&
            !isTimerPaused &&
            !isAnnouncingResult &&
            timeRemaining > 0 &&
            question.answers.length > 2 // Only shuffle multiple choice
        ) {
            setLastShuffleTime(timeRemaining);
            setShuffleCounter((prev) => prev + 1);

            // Only shuffle every 3 seconds
            if (shuffleCounter % 3 === 0) {
                setIsShuffling(true);

                // FIX: Create new shuffled order based on actual answer count
                const newIndices = Array.from({ length: question.answers.length }, (_, i) => i).sort(
                    () => Math.random() - 0.5
                );

                setTimeout(() => {
                    setShuffledIndices(newIndices);
                    setTimeout(() => setIsShuffling(false), 150);
                }, 100);
            }
        }
    }, [
        timeRemaining,
        selectedAnswer,
        clickedAnswer,
        isTimedOut,
        isTimerPaused,
        isAnnouncingResult,
        isTimerEnabled,
        lastShuffleTime,
        shuffleCounter,
        question.answers.length,
    ]);

    // Handle answer click
    const handleAnswerClick = (answer) => {
        if (selectedAnswer || isAnnouncingResult) return;

        const answerTime = questionStartTime
            ? (Date.now() - questionStartTime) / 1000
            : 0;
        const isCorrect = answer === question.correct_answer;

        BadgeManager.onAnswerSubmitted(isCorrect, answerTime);

        setClickedAnswer(answer);
        onAnswerSelect(answer);
    };

    // Hint system
    const handleHintRequest = () => {
        if (
            hintsUsed >= 1 ||
            hintsRemaining <= 0 ||
            selectedAnswer ||
            clickedAnswer ||
            isTimedOut ||
            question.answers.length <= 2 // Can't use 50/50 on True/False
        ) {
            return;
        }
        if (typeof onRequestHint === "function" && onRequestHint()) {
            setHintsUsed(1);
            setShowHint(true);
            eliminateTwoWrongAnswers();
            BadgeManager.onHintUsed();
        }
    };

    const getHintText = () => {
        if (hintsUsed === 1 && eliminatedIndices.size > 0) {
            const letters = Array.from(eliminatedIndices)
                .sort((a, b) => a - b)
                .map((i) => String.fromCharCode(65 + i));
            return `50/50 used: Eliminated options ${letters.join(" and ")}.`;
        }
        return "";
    };

    // Bookmark toggle
    const handleBookmarkToggle = () => {
        const result = BookmarkManager.toggleBookmark(question);
        if (result.success) {
            setIsBookmarked(!isBookmarked);
            if (result.action === "added") {
                BadgeManager.onBookmarkAdded();
            }
        }
    };

    // Speak result
    useEffect(() => {
        if (showResult && question && !hasResultBeenAnnounced) {
            const isCorrect = selectedAnswer === question.correct_answer;
            const correctIndex = question.answers.indexOf(
                question.correct_answer,
            );
            const correctOption = String.fromCharCode(65 + correctIndex);

            let resultText = "";
            if (isTimedOut) {
                resultText = `Time's up! The correct answer was "${question.correct_answer}", option ${correctOption}.`;
            } else if (isCorrect) {
                resultText = "Correct! Well done!";
            } else {
                resultText = `Incorrect. The correct answer was "${question.correct_answer}", option ${correctOption}.`;
            }

            setIsAnnouncingResult(true);
            speak(resultText, () => {
                setIsAnnouncingResult(false);
                setHasResultBeenAnnounced(true);
                if (onResultAnnounced) onResultAnnounced();
            });
        }
    }, [
        showResult,
        selectedAnswer,
        isTimedOut,
        question,
        hasResultBeenAnnounced,
        speak,
        onResultAnnounced
    ]);

    // Button classes
    const getButtonClass = (answer) => {
        const base =
            "w-full p-4 text-left rounded-lg font-medium transition-all duration-300 transform ";
        if (!selectedAnswer && !clickedAnswer && !isTimedOut) {
            return (
                base +
                "bg-white hover:bg-purple-50 hover:scale-105 hover:shadow-lg text-gray-800 border-2 border-transparent hover:border-purple-300"
            );
        }
        if (selectedAnswer || clickedAnswer || isTimedOut) {
            if (answer === question.correct_answer)
                return (
                    base +
                    "bg-green-500 text-white border-2 border-green-600 scale-105 shadow-lg"
                );
            if (answer === (selectedAnswer || clickedAnswer))
                return (
                    base +
                    "bg-red-500 text-white border-2 border-red-600 scale-105 shadow-lg"
                );
            return base + "bg-gray-300 text-gray-600 border-2 border-gray-400";
        }
        return base;
    };

    const getAnswerIcon = (answer) => {
        if (!selectedAnswer && !clickedAnswer && !isTimedOut) return null;
        if (answer === question.correct_answer)
            return <span className="text-2xl">✓</span>;
        if (answer === (selectedAnswer || clickedAnswer))
            return <span className="text-2xl">✗</span>;
        return null;
    };

    const eliminateTwoWrongAnswers = () => {
        const wrong = question.answers
            .map((ans, idx) => ({ ans, idx }))
            .filter((x) => x.ans !== question.correct_answer);
        const shuffled = [...wrong].sort(() => Math.random() - 0.5);
        const toRemove = shuffled
            .slice(0, Math.min(2, wrong.length))
            .map((x) => x.idx);
        setEliminatedIndices(new Set(toRemove));
    };
    
    return (
        <>
            <div
                className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl mx-auto relative"
                data-quiz-question="true"
            >
                {/* Voice Controls */}
                <div className="absolute top-4 right-4 z-10">
                    <VoiceControls
                        question={question}
                        onAnswerSelect={handleAnswerClick}
                        selectedAnswer={selectedAnswer || clickedAnswer}
                        isListening={isListening}
                        isSpeaking={isSpeaking}
                        transcript={transcript}
                        microphonePermission={microphonePermission}
                        onSpeak={speak}
                        onStopSpeaking={stopSpeaking}
                        onStartListening={startListening}
                        onStopListening={stopListening}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                        parseVoiceAnswer={parseVoiceAnswer}
                        setTranscript={setTranscript}
                        isTimedOut={isTimedOut}
                        showResult={showResult}
                    />
                </div>

                {/* Header */}
                <div className="mb-8 pr-48 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <span className="text-2xl">🤔</span>
                            </div>
                            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                                {question.category}
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
                            {question.question}
                        </h2>

                        {/* Badges */}
                        <div className="flex items-center gap-2 mt-4 flex-wrap">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {question.difficulty}
                            </span>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                {question.type}
                            </span>
                            {isTimerEnabled && (
                                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                                    ⏱️ Timed
                                </span>
                            )}
                            {isAnnouncingResult && (
                                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                                    🔊 Announcing Result...
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Bookmark and Hint */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleHintRequest}
                            disabled={
                                hintsUsed >= 1 ||
                                hintsRemaining <= 0 ||
                                selectedAnswer ||
                                clickedAnswer ||
                                isTimedOut ||
                                question.answers.length <= 2
                            }
                            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                                hintsUsed >= 1 ||
                                hintsRemaining <= 0 ||
                                selectedAnswer ||
                                clickedAnswer ||
                                isTimedOut ||
                                question.answers.length <= 2
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-yellow-500 hover:text-yellow-600"
                            }`}
                            title={
                                hintsRemaining <= 0
                                    ? "No hints remaining"
                                    : "Use 50/50 hint"
                            }
                            aria-label="Use 50/50 hint"
                        >
                            <svg
                                className="w-6 h-6 transition-all duration-300"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        <div
                            className="px-2 py-1 rounded-md text-sm font-semibold bg-yellow-100 text-yellow-800"
                            aria-live="polite"
                        >
                            {hintsRemaining} left
                        </div>

                        <button
                            onClick={handleBookmarkToggle}
                            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isBookmarked ? "text-orange-500 hover:text-orange-600" : "text-gray-400 hover:text-orange-500"}`}
                            title={
                                isBookmarked
                                    ? "Remove bookmark"
                                    : "Bookmark this question"
                            }
                        >
                            <svg
                                className="w-6 h-6 transition-all duration-300"
                                fill={isBookmarked ? "currentColor" : "none"}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Hint Display */}
                {showHint && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg animate-fadeInUp">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-yellow-600">💡</div>
                            <span className="font-semibold text-yellow-800">
                                Hint:
                            </span>
                        </div>
                        <p className="text-yellow-700">{getHintText()}</p>
                    </div>
                )}

                {/* Answers */}
                <div className="space-y-4">
                    {shuffledIndices.map((originalIndex, displayPosition) => {
                        const answer = question.answers[originalIndex];
                        const isEliminated =
                            eliminatedIndices.has(originalIndex);
                        return (
                            <button
                                key={`${originalIndex}-${displayPosition}`}
                                onClick={() => handleAnswerClick(answer)}
                                disabled={
                                    selectedAnswer ||
                                    clickedAnswer ||
                                    isTimedOut ||
                                    isAnnouncingResult ||
                                    isEliminated ||
                                    isShuffling
                                }
                                className={`${getButtonClass(answer)} ${
                                    isEliminated
                                        ? "opacity-0 scale-95 pointer-events-none h-0 py-0 my-0 overflow-hidden transition-all duration-300"
                                        : isShuffling
                                        ? "transition-all duration-200 transform scale-98 opacity-80"
                                        : "transition-all duration-300 transform scale-100 opacity-100"
                                }`}
                                data-quiz-answer="true"
                                data-answer-index={originalIndex}
                                aria-hidden={isEliminated ? "true" : "false"}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold transition-all duration-200 ${
                                                isShuffling
                                                    ? "animate-pulse"
                                                    : ""
                                            }`}
                                        >
                                            {String.fromCharCode(
                                                65 + displayPosition,
                                            )}
                                        </div>
                                        <span className="text-lg">
                                            {answer}
                                        </span>
                                    </div>
                                    {getAnswerIcon(answer)}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Result */}
                {(selectedAnswer || clickedAnswer || isTimedOut) && (
                    <div className="mt-6 p-4 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-2 flex-wrap">
                            {isTimedOut && !selectedAnswer && !clickedAnswer ? (
                                <>
                                    <span className="text-2xl">⏱️</span>
                                    <span className="text-orange-600 font-semibold text-lg">
                                        Time's up! The correct answer was:{" "}
                                        {question.correct_answer}
                                    </span>
                                </>
                            ) : (selectedAnswer || clickedAnswer) ===
                              question.correct_answer ? (
                                <>
                                    <span className="text-2xl">🎉</span>
                                    <span className="text-green-600 font-semibold text-lg">
                                        Correct!
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-2xl">😔</span>
                                    <span className="text-red-600 font-semibold text-lg">
                                        Incorrect. The correct answer is:{" "}
                                        {question.correct_answer}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Voice Settings Modal */}
            <VoiceSettings
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                voiceSettings={voiceSettings}
                availableVoices={availableVoices}
                onUpdateSettings={updateVoiceSettings}
            />
        </>
    );
};

export default QuizQuestion;