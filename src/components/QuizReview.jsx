import React, { useState } from 'react';
import './QuizReview.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';


const QuizReview = ({ questions, userAnswers, onBack }) => {
  const [current, setCurrent] = useState(0);

  const goTo = (idx) => setCurrent(idx);
  const next = () => setCurrent((c) => Math.min(c + 1, questions.length - 1));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  const isCorrect = userAnswers[current] === questions[current].correctAnswer;

  return (
    <div className="quiz-review-container">
      <div className="review-header">
        <button onClick={onBack} className="back-btn">Back to Results</button>
        <div className="progress-indicator">
          Question {current + 1} / {questions.length}
        </div>
      </div>
      <div className="question-nav">
        {questions.map((q, idx) => {
          const correct = userAnswers[idx] === q.correctAnswer;
          return (
            <button
              key={idx}
              className={`nav-dot ${current === idx ? 'active' : ''} ${correct ? 'correct' : 'incorrect'}`}
              onClick={() => goTo(idx)}
              aria-label={`Go to question ${idx + 1} (${correct ? 'correct' : 'incorrect'})`}
            >
              {idx + 1}
              {correct ? <FaCheckCircle className="icon-correct" /> : <FaTimesCircle className="icon-incorrect" />}
            </button>
          );
        })}
      </div>
      <div className="review-question-block">
        <div className="review-question">{questions[current].question}</div>
        <ul className="review-options">
          {questions[current].options.map((opt, i) => {
            const isUser = userAnswers[current] === opt;
            const isRight = questions[current].correctAnswer === opt;
            let className = 'option';
            let icon = null;
            if (isRight) {
              className += ' correct';
              icon = <FaCheckCircle className="icon-correct" title="Correct answer" />;
            }
            if (isUser && !isRight) {
              className += ' incorrect';
              icon = <FaTimesCircle className="icon-incorrect" title="Your answer (incorrect)" />;
            }
            return (
              <li key={i} className={className} aria-current={isUser ? 'true' : undefined}>
                <span>{opt}</span> {icon}
                {isUser && !isRight && <span className="user-label">Your answer</span>}
                {isRight && <span className="correct-label">Correct</span>}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="review-controls">
        <button onClick={prev} disabled={current === 0} className="nav-btn">Previous</button>
        <button onClick={next} disabled={current === questions.length - 1} className="nav-btn">Next</button>
      </div>
    </div>
  );
};

export default QuizReview;
