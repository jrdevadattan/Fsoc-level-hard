import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../App'

// This component shows the final results after completing the quiz
const QuizComplete = () => {
  const navigate = useNavigate()
  const { score, numQuestions, resetQuiz } = useQuiz()

  // Calculate percentage score
  const percentage = Math.round((score / numQuestions) * 100)

  // Function to get a letter grade based on percentage
  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'F'
  }

  // Function to get encouraging message based on score
  const getMessage = (percentage) => {
    if (percentage >= 90) return "Excellent work! You're a quiz master! 🌟"
    if (percentage >= 80) return "Great job! You really know your stuff! 🎯"
    if (percentage >= 70) return "Good work! Keep practicing! 👍"
    if (percentage >= 60) return "Not bad! You can do better next time! 📈"
    return "Don't give up! Practice makes perfect! 💪"
  }

  // Function to play again
  const playAgain = () => {
    resetQuiz()
    navigate('/')
  }

  return (
    <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
      {/* Trophy */}
      <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏆</div>

      {/* Results Box */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '32px', color: '#333', marginBottom: '20px' }}>
          Quiz Complete!
        </h1>

        {/* Score Display */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#4CAF50', marginBottom: '10px' }}>
            {score}/{numQuestions}
          </div>
          <div style={{ fontSize: '16px', color: '#666' }}>Questions Correct</div>
        </div>

        {/* Percentage */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2196F3' }}>
            {percentage}%
          </div>
          <div style={{ fontSize: '16px', color: '#666' }}>Accuracy</div>
        </div>

        {/* Grade */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: getGrade(percentage) === 'F' ? '#f44336' : '#4CAF50'
          }}>
            Grade: {getGrade(percentage)}
          </div>
        </div>

        {/* Encouraging Message */}
        <div style={{ 
          backgroundColor: '#f5f5f5',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <p style={{ fontSize: '16px', color: '#333', margin: '0' }}>
            {getMessage(percentage)}
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={playAgain}
            style={{ 
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '12px 25px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
          >
            🔄 Play Again
          </button>
          
          <button
            onClick={() => navigate('/')}
            style={{ 
              backgroundColor: '#2196F3',
              color: 'white',
              padding: '12px 25px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1976D2'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2196F3'}
          >
            � Back to Setup
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizComplete