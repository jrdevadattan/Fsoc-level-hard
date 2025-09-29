import { createContext, useContext, useState } from 'react'

const QuizContext = createContext()

// Custom hook to use the QuizContext
export const useQuiz = () => {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}

// This component provides quiz data to all child components
export const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    isQuizStarted: false,
    isQuizCompleted: false,
    score: 0
  })

  const startQuiz = (questions) => {
    setQuizData(prev => ({
      ...prev,
      questions,
      isQuizStarted: true,
      currentQuestionIndex: 0,
      userAnswers: [],
      isQuizCompleted: false,
      score: 0
    }))
  }

  const submitAnswer = (answer) => {
    setQuizData(prev => ({
      ...prev,
      userAnswers: [...prev.userAnswers, answer]
    }))
  }

  const nextQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1
    }))
  }

  const completeQuiz = (finalScore) => {
    setQuizData(prev => ({
      ...prev,
      isQuizCompleted: true,
      score: finalScore
    }))
  }

  const resetQuiz = () => {
    setQuizData({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: [],
      isQuizStarted: false,
      isQuizCompleted: false,
      score: 0
    })
  }

  const value = {
    ...quizData,
    startQuiz,
    submitAnswer,
    nextQuestion,
    completeQuiz,
    resetQuiz
  }

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  )
}