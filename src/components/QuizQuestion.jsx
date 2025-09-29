import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../App'

// This component shows quiz questions one by one
const QuizQuestion = () => {
  const navigate = useNavigate()
  const { numQuestions, score, setScore, questions, loading, error } = useQuiz()
  
  // Keep track of which question we're on (starts at 1)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  // Keep track of which answer the user selected
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  // Show if the answer was correct or wrong
  const [showResult, setShowResult] = useState(false)

  // If no questions are loaded, redirect back to setup
  if (!loading && (!questions || questions.length === 0)) {
    navigate('/')
    return null
  }

  // Show loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Loading Questions...</h2>
        <p>Please wait while we fetch your quiz questions.</p>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Error Loading Questions</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Back to Setup
        </button>
      </div>
    )
  }

  // Get the current question from the fetched questions
  const currentQuestionData = questions[currentQuestion - 1]

  // When user clicks an answer
  const handleAnswerClick = (answerIndex) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex)
    }
  }

  // When user submits their answer
  const handleSubmitAnswer = () => {
    setShowResult(true)
    
    // Check if answer is correct and update score
    if (selectedAnswer === currentQuestionData.correctAnswer) {
      setScore(score + 1)
    }
  }

  // Go to next question or finish quiz
  const handleNextQuestion = () => {
    if (currentQuestion >= numQuestions) {
      navigate('/results') // Go to results page
    } else {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  return (
    <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            backgroundColor: '#ddd',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Back to Setup
        </button>
        
        <div>
          <h2 style={{ margin: '0', fontSize: '24px', color: '#333' }}>Quiz Question</h2>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Question {currentQuestion} of {numQuestions}
          </p>
        </div>
        
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
          Score: {score}
        </div>
      </div>

      {/* Question Box */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '25px' }}>
          {currentQuestionData.question}
        </h3>

        {/* Answer Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {currentQuestionData.options.map((option, index) => {
            let backgroundColor = '#f5f5f5'
            let color = '#333'
            
            if (showResult) {
              if (index === currentQuestionData.correctAnswer) {
                backgroundColor = '#4CAF50' // Green for correct answer
                color = 'white'
              } else if (selectedAnswer === index) {
                backgroundColor = '#f44336' // Red for wrong selected answer
                color = 'white'
              }
            } else if (selectedAnswer === index) {
              backgroundColor = '#2196F3' // Blue for selected answer
              color = 'white'
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={showResult}
                style={{ 
                  backgroundColor,
                  color,
                  padding: '15px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: showResult ? 'default' : 'pointer',
                  fontSize: '16px',
                  textAlign: 'left'
                }}
              >
                {option}
              </button>
            )
          })}
        </div>

        {/* Show result after answering */}
        {showResult && (
          <div style={{ marginTop: '20px' }}>
            <p style={{ 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: selectedAnswer === currentQuestionData.correctAnswer ? '#4CAF50' : '#f44336'
            }}>
              {selectedAnswer === currentQuestionData.correctAnswer ? '✅ Correct!' : '❌ Wrong!'}
            </p>
            {selectedAnswer !== currentQuestionData.correctAnswer && (
              <p style={{ color: '#666', marginTop: '10px' }}>
                The correct answer was: {currentQuestionData.options[currentQuestionData.correctAnswer]}
              </p>
            )}
            <button
              onClick={handleNextQuestion}
              style={{ 
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '15px'
              }}
            >
              {currentQuestion >= numQuestions ? 'See Results' : 'Next Question'} →
            </button>
          </div>
        )}

        {/* Submit button (only show if answer selected but not submitted yet) */}
        {selectedAnswer !== null && !showResult && (
          <button
            onClick={handleSubmitAnswer}
            style={{ 
              backgroundColor: '#2196F3',
              color: 'white',
              padding: '12px 25px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '20px'
            }}
          >
            Submit Answer
          </button>
        )}
      </div>
    </div>
  )
}

export default QuizQuestion