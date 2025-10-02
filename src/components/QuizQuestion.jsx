// QuizQuestion.jsx - Updated with delayed navigation and repositioned voice controls
"use client"

import { useState, useEffect } from "react"
import VoiceControls from "./VoiceControls"
import VoiceSettings from "./VoiceSettings"
import { useVoice } from "../hooks/useVoice"

const QuizQuestion = ({ question, onAnswerSelect, selectedAnswer, isTimerEnabled, onResultAnnounced }) => {
  const [clickedAnswer, setClickedAnswer] = useState(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isAnnouncingResult, setIsAnnouncingResult] = useState(false)

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
    setTranscript
  } = useVoice()

  // Reset states when question changes
  useEffect(() => {
    setClickedAnswer(null)
    setIsTimedOut(false)
    setShowResult(false)
    setIsAnnouncingResult(false)
    stopSpeaking()
    setTranscript('')
  }, [question])

  // Show result when answer is selected or timed out
  useEffect(() => {
    if (selectedAnswer || clickedAnswer || isTimedOut) {
      setShowResult(true)
    }
  }, [selectedAnswer, clickedAnswer, isTimedOut])

  const handleAnswerClick = (answer) => {
    if (selectedAnswer || isAnnouncingResult) return // Prevent multiple selections

    setClickedAnswer(answer)
    onAnswerSelect(answer)
  }

  // This function can be called by the timer component when time runs out
  const handleTimeOut = () => {
    setIsTimedOut(true)
    if (!selectedAnswer && !clickedAnswer) {
      setClickedAnswer(null) // Mark as no answer selected
    }
  }

  // Expose handleTimeOut to parent if needed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.quizQuestionHandleTimeOut = handleTimeOut
    }
  }, [selectedAnswer, clickedAnswer])

  const getButtonClass = (answer) => {
    const baseClass = "w-full p-4 text-left rounded-lg font-medium transition-all duration-300 transform "

    if (!selectedAnswer && !clickedAnswer && !isTimedOut) {
      return (
        baseClass +
        "bg-white hover:bg-purple-50 hover:scale-105 hover:shadow-lg text-gray-800 border-2 border-transparent hover:border-purple-300"
      )
    }

    if (selectedAnswer || clickedAnswer || isTimedOut) {
      if (answer === question.correct_answer) {
        return baseClass + "bg-green-500 text-white border-2 border-green-600 scale-105 shadow-lg"
      } else if (answer === (selectedAnswer || clickedAnswer)) {
        return baseClass + "bg-red-500 text-white border-2 border-red-600 scale-105 shadow-lg"
      } else {
        return baseClass + "bg-gray-300 text-gray-600 border-2 border-gray-400"
      }
    }

    return baseClass
  }

  const getAnswerIcon = (answer) => {
    if (!selectedAnswer && !clickedAnswer && !isTimedOut) return null

    if (answer === question.correct_answer) {
      return <span className="text-2xl">✓</span>
    } else if (answer === (selectedAnswer || clickedAnswer)) {
      return <span className="text-2xl">✗</span>
    }

    return null
  }

  // Handler for when result announcement is complete
  const handleResultAnnouncementComplete = () => {
    setIsAnnouncingResult(false)
    // Notify parent that announcement is complete
    if (onResultAnnounced) {
      onResultAnnounced()
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl mx-auto relative" data-quiz-question="true">
        {/* Voice Controls - Positioned at top right */}
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
            onResultAnnouncementStart={() => setIsAnnouncingResult(true)}
            onResultAnnouncementComplete={handleResultAnnouncementComplete}
          />
        </div>

        <div className="mb-8 pr-48">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <span className="text-2xl">🤔</span>
            </div>
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">{question.category}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">{question.question}</h2>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {question.difficulty}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {question.type}
            </span>
            {isTimerEnabled && (
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">⏱️ Timed</span>
            )}
            {isAnnouncingResult && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                🔊 Announcing...
              </span>
            )}
          </div>
        </div>

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
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg">{answer}</span>
                </div>
                {getAnswerIcon(answer)}
              </div>
            </button>
          ))}
        </div>

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
  )
}

export default QuizQuestion