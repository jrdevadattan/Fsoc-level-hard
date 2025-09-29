import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import QuizSetup from './components/QuizSetup'
import QuizQuestion from './components/QuizQuestion'
import QuizComplete from './components/QuizComplete'
import { QuizProvider } from './context'




function App() {
  return (
    <Router>
      <QuizProvider>
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0', padding: '20px' }}>
          <Routes>
            <Route path="/" element={<QuizSetup />} />
            <Route path="/quiz" element={<QuizQuestion />} />
            <Route path="/results" element={<QuizComplete />} />
          </Routes>
        </div>
      </QuizProvider>
    </Router>
  )
}

export default App
