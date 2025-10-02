"use client";

import { useState, useEffect } from "react";
import BonusSpinWheel from "./BonusSpinWheel";

const QuizResults = ({ score, totalQuestions, onRestart, onBackToSetup }) => {
  const [showWheel, setShowWheel] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [finalScore, setFinalScore] = useState(score);
  const [hasSpunWheel, setHasSpunWheel] = useState(false);

  useEffect(() => {
    // Check if wheel has been spun for this quiz session
    const wheelSpun = sessionStorage.getItem('wheelSpun');
    if (wheelSpun === 'true') {
      setHasSpunWheel(true);
      // Load saved bonus if exists
      const savedBonus = sessionStorage.getItem('lastBonus');
      if (savedBonus) {
        setBonusPoints(parseInt(savedBonus, 10));
        setFinalScore(score + parseInt(savedBonus, 10));
      }
    }
  }, [score]);

  const percentage = Math.round((finalScore / totalQuestions) * 100);

  const getResultMessage = () => {
    if (percentage >= 90)
      return {
        message: "Outstanding! 🏆",
        emoji: "🎯",
        color: "text-yellow-600",
      };
    if (percentage >= 80)
      return {
        message: "Excellent! 🌟",
        emoji: "⭐",
        color: "text-green-600",
      };
    if (percentage >= 70)
      return {
        message: "Great Job! 👏",
        emoji: "👍",
        color: "text-blue-600",
      };
    if (percentage >= 50)
      return {
        message: "Good Effort! 💪",
        emoji: "👌",
        color: "text-purple-600",
      };
    return {
      message: "Keep Trying! 📚",
      emoji: "💪",
      color: "text-red-600",
    };
  };

  const result = getResultMessage();

  const handleRewardWon = (reward) => {
    let bonus = 0;
    if (reward.isMultiplier) {
      bonus = score; // Double the score
      setFinalScore(score + bonus);
    } else {
      bonus = reward.points;
      setFinalScore(score + reward.points);
    }
    
    setBonusPoints(bonus);
    
    // Mark wheel as spun for this session
    sessionStorage.setItem('wheelSpun', 'true');
    sessionStorage.setItem('lastBonus', bonus.toString());
    setHasSpunWheel(true);
    
    // Save to bonus history
    try {
      const history = JSON.parse(localStorage.getItem('bonusHistory') || '[]');
      history.push({
        date: new Date().toISOString(),
        reward: reward,
        originalScore: score,
        finalScore: score + bonus,
        totalQuestions: totalQuestions,
      });
      // Keep only last 10 entries
      localStorage.setItem('bonusHistory', JSON.stringify(history.slice(-10)));
    } catch (e) {
      console.error('Failed to save bonus history:', e);
    }
  };

  const handleRestart = () => {
    // Clear wheel state for new quiz
    sessionStorage.removeItem('wheelSpun');
    sessionStorage.removeItem('lastBonus');
    setBonusPoints(0);
    setFinalScore(score);
    setHasSpunWheel(false);
    onRestart();
  };

  const handleBackToSetup = () => {
    // Clear wheel state
    sessionStorage.removeItem('wheelSpun');
    sessionStorage.removeItem('lastBonus');
    setBonusPoints(0);
    setFinalScore(score);
    setHasSpunWheel(false);
    onBackToSetup();
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-8xl mb-6 animate-bounce">
            {result.emoji}
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Quiz Complete!
          </h2>

          <p className={`text-2xl font-semibold mb-6 ${result.color}`}>
            {result.message}
          </p>

          {/* Bonus Points Display */}
          {bonusPoints > 0 && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 mb-6 animate-pulse">
              <p className="text-white font-bold text-lg">
                🎉 Bonus Points: +{bonusPoints}
              </p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="text-6xl font-bold text-gray-800 mb-2">
              {finalScore}/{totalQuestions}
            </div>
            <div className="text-xl text-gray-600 mb-4">
              {percentage}% Correct
            </div>

            {/* Progress Circle */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg
                className="w-32 h-32 transform -rotate-90"
                viewBox="0 0 120 120"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(percentage / 100) * 314} 314`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">
                  {percentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Correct/Incorrect Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {score}
              </div>
              <div className="text-sm text-green-700">Correct</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {totalQuestions - score}
              </div>
              <div className="text-sm text-red-700">Incorrect</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Spin Wheel Button */}
            {!hasSpunWheel && (
              <button
                onClick={() => setShowWheel(true)}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <span className="text-2xl">✨</span>
                <span>Spin for Bonus!</span>
              </button>
            )}

            <button
              onClick={handleRestart}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              data-quiz-restart="true"
            >
              🔄 Try Again
            </button>

            <button
              onClick={handleBackToSetup}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              ⚙️ Back to Setup
            </button>

            <button
              onClick={() => window.open("https://opentdb.com/", "_blank")}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🌐 More Quizzes
            </button>
          </div>

          {/* Share Section */}
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-3">
              Share your results:
            </p>
            <button 
              onClick={() => {
                const text = `I scored ${finalScore}/${totalQuestions} (${percentage}%) on the quiz!${bonusPoints > 0 ? ` Plus ${bonusPoints} bonus points! 🎉` : ''}`;
                if (navigator.share) {
                  navigator.share({ text }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(text).then(() => {
                    alert('Score copied to clipboard!');
                  }).catch(() => {});
                }
              }}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              📱 Share Score
            </button>
          </div>
        </div>
      </div>

      {/* Bonus Spin Wheel Modal */}
      <BonusSpinWheel
        isOpen={showWheel}
        onClose={() => setShowWheel(false)}
        onRewardWon={handleRewardWon}
        quizScore={score}
      />
    </>
  );
};

export default QuizResults;