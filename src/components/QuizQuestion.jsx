"use client";

import { useState, useEffect } from "react";
import BookmarkManager from "../utils/BookmarkManager";
import VoiceControls from "./VoiceControls";
import VoiceSettings from "./VoiceSettings";
import { useVoice } from "../hooks/useVoice";

const QuizQuestion = ({
  question,
  onAnswerSelect,
  selectedAnswer,
  onSkip,
  isTimerEnabled,
  onResultAnnounced,
}) => {
  // Component-local state for clicks, bookmarks, timers and TTS
  const [clickedAnswer, setClickedAnswer] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isAnnouncingResult, setIsAnnouncingResult] = useState(false);
  const [hasResultBeenAnnounced, setHasResultBeenAnnounced] = useState(false);

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

  // Reset transient UI state when a new question loads
  useEffect(() => {
    setClickedAnswer(null);
    setIsTimedOut(false);
    setShowResult(false);
    setIsAnnouncingResult(false);
    setHasResultBeenAnnounced(false);
    stopSpeaking();
    setTranscript("");

    const questionId = question.id || BookmarkManager.generateQuestionId(question);
    setIsBookmarked(BookmarkManager.isBookmarked(questionId));
  }, [question]);

  // Reveal feedback when an answer is selected or time runs out
  useEffect(() => {
    if ((selectedAnswer || clickedAnswer || isTimedOut) && !showResult) {
      setShowResult(true);
    }
  }, [selectedAnswer, clickedAnswer, isTimedOut]);

  // Handle user clicking an answer
  const handleAnswerClick = (answer) => {
    if (selectedAnswer || isAnnouncingResult) return;
    setClickedAnswer(answer);
    onAnswerSelect(answer);
  };

  // Called when the per-question timer expires
  const handleTimeOut = () => {
    if (!selectedAnswer && !clickedAnswer) {
      setIsTimedOut(true);
      onAnswerSelect(null);
    }
  };

  // Toggle bookmark for this question
  const handleBookmarkToggle = () => {
    const result = BookmarkManager.toggleBookmark(question);
    if (result.success) setIsBookmarked(!isBookmarked);
  };

  // Announce result via TTS (voice) and notify parent when done
  useEffect(() => {
    if (showResult && question && !hasResultBeenAnnounced) {
      const isCorrect = selectedAnswer === question.correct_answer;
      const correctIndex = question.answers.indexOf(question.correct_answer);
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
  }, [showResult, selectedAnswer, isTimedOut, question, hasResultBeenAnnounced]);

  // Compute CSS classes for answer buttons based on state
  const getButtonClass = (answer) => {
    const base = "w-full p-4 text-left rounded-lg font-medium transition-all duration-300 transform ";
    if (!selectedAnswer && !clickedAnswer && !isTimedOut) {
      return base + "bg-white hover:bg-purple-50 hover:scale-105 hover:shadow-lg text-gray-800 border-2 border-transparent hover:border-purple-300";
    }
    if (selectedAnswer || clickedAnswer || isTimedOut) {
      if (answer === question.correct_answer) return base + "bg-green-500 text-white border-2 border-green-600 scale-105 shadow-lg";
      if (answer === (selectedAnswer || clickedAnswer)) return base + "bg-red-500 text-white border-2 border-red-600 scale-105 shadow-lg";
      return base + "bg-gray-300 text-gray-600 border-2 border-gray-400";
    }
    return base;
  };

  // Small helper to show ✓/✗ icons next to answers
  const getAnswerIcon = (answer) => {
    if (!selectedAnswer && !clickedAnswer && !isTimedOut) return null;
    if (answer === question.correct_answer) return <span className="text-2xl">✓</span>;
    if (answer === (selectedAnswer || clickedAnswer)) return <span className="text-2xl">✗</span>;
    return null;
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl mx-auto relative" data-quiz-question="true">
        {/* Skip badge */}
        {question && question.isSkipped && (
          <div className="absolute top-4 left-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
            ⏭️ Skipped
          </div>
        )}
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
            isAnnouncingResult={isAnnouncingResult}
          />
        </div>

        {/* Header */}
        <div className="mb-8 pr-48 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <span className="text-2xl">🤔</span>
              </div>
              <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">{question.category}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">{question.question}</h2>

            {/* Badges */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{question.difficulty}</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">{question.type}</span>
              {isTimerEnabled && <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">⏱️ Timed</span>}
              {isAnnouncingResult && <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium animate-pulse">🔊 Announcing Result...</span>}
            </div>
          </div>

          {/* Bookmark */}
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isBookmarked ? "text-orange-500 hover:text-orange-600" : "text-gray-400 hover:text-orange-500"}`}
            title={isBookmarked ? "Remove bookmark" : "Bookmark this question"}
          >
            <svg className="w-6 h-6 transition-all duration-300" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Answers */}
        <div className="space-y-4">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(answer)}
              disabled={selectedAnswer || clickedAnswer || isTimedOut || isAnnouncingResult}
              className={getButtonClass(answer)}
              data-quiz-answer="true"
              data-answer-index={index}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">{String.fromCharCode(65 + index)}</div>
                  <span className="text-lg">{answer}</span>
                </div>
                {getAnswerIcon(answer)}
              </div>
            </button>
          ))}
        </div>

        {/* Result */}
        {(selectedAnswer || clickedAnswer || isTimedOut) && (
          <div className="mt-6 p-4 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 flex-wrap">
              {isTimedOut && !selectedAnswer && !clickedAnswer ? (
                <>
                  <span className="text-2xl">⏱️</span>
                  <span className="text-orange-600 font-semibold text-lg">
                    Time's up! The correct answer was: {question.correct_answer} (Option {String.fromCharCode(65 + question.answers.indexOf(question.correct_answer))})
                  </span>
                </>
              ) : (selectedAnswer || clickedAnswer) === question.correct_answer ? (
                <>
                  <span className="text-2xl">🎉</span>
                  <span className="text-green-600 font-semibold text-lg">Correct!</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">😔</span>
                  <span className="text-red-600 font-semibold text-lg">
                    Incorrect. The correct answer is: {question.correct_answer} (Option {String.fromCharCode(65 + question.answers.indexOf(question.correct_answer))})
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Footer actions: Skip */}
        <div className="max-w-3xl mx-auto mt-4 flex justify-end gap-3 pr-4">
          <button
            onClick={() => onSkip && onSkip()}
            disabled={selectedAnswer || clickedAnswer || isTimedOut || isAnnouncingResult}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Skip this question and return later"
          >
            ⏭️ Skip
          </button>
        </div>
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
