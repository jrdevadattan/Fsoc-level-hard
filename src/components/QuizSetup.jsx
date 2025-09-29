import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../App'

// This component lets users set up their quiz before starting
const QuizSetup = () => {
  // useNavigate hook lets us move to different pages
  const navigate = useNavigate()
  
  // Get quiz data from context (shared between all components)
  const { numQuestions, setNumQuestions, resetQuiz, fetchQuestions, loading, error } = useQuiz()

  // Function to start the quiz
  const startQuiz = async () => {
    resetQuiz() // Reset score to 0
    await fetchQuestions() // Fetch questions from API
    navigate('/quiz') // Go to the quiz page
  }

  return (
    <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
      {/* Title */}
      <h1 style={{ fontSize: '36px', color: '#333', marginBottom: '20px' }}>
        Simple Quiz App
      </h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '40px' }}>
        Test your knowledge with some fun questions!
      </p>

      {/* Quiz Settings Box */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>
          Quiz Setup
        </h2>

        {/* Number of Questions */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', fontSize: '16px', color: '#333', marginBottom: '10px' }}>
            How many questions would you like? ({numQuestions} questions)
          </label>
          <input
            type="range"
            min="3"
            max="10"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            style={{ width: '100%', height: '10px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666', marginTop: '5px' }}>
            <span>3</span>
            <span>10</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            color: '#c62828', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            Error: {error}. Please try again.
          </div>
        )}

        {/* Start Quiz Button */}
        <button
          onClick={startQuiz}
          disabled={loading}
          style={{ 
            backgroundColor: loading ? '#ccc' : '#4CAF50',
            color: 'white', 
            fontSize: '18px',
            padding: '12px 30px',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
          onMouseOver={(e) => {
            if (!loading) e.target.style.backgroundColor = '#45a049'
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.backgroundColor = '#4CAF50'
          }}
        >
          {loading ? 'Loading Questions...' : 'Start Quiz ▶️'}
        </button>
      </div>
    </div>
  )
}

export default QuizSetup