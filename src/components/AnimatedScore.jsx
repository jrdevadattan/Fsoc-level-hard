import React, { useEffect, useRef, useState } from 'react';
import CelebrationManager from '../utils/CelebrationManager';

const AnimatedScore = ({
  score,
  totalQuestions,
  onAnimationComplete,
  duration = 2000,
  showPercentage = true,
  showConfetti = true,
  className = ""
}) => {
  const scoreRef = useRef(null);
  const percentageRef = useRef(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  const finalPercentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    if (!scoreRef.current) return;

    const startTime = Date.now();
    const startScore = 0;
    const startPercentage = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const currentScore = Math.round(startScore + (score - startScore) * easeOutQuart);
      const currentPercentage = Math.round(startPercentage + (finalPercentage - startPercentage) * easeOutQuart);

      setDisplayScore(currentScore);
      setDisplayPercentage(currentPercentage);

      if (showConfetti) {
        if (currentPercentage >= 80 && currentPercentage < 90 && !scoreRef.current.dataset.triggered80) {
          scoreRef.current.dataset.triggered80 = 'true';
          scoreRef.current.style.transform = 'scale(1.1)';
          scoreRef.current.style.color = '#3498DB';
          CelebrationManager.triggerHapticFeedback('light');
          setTimeout(() => {
            if (scoreRef.current) {
              scoreRef.current.style.transform = 'scale(1)';
            }
          }, 200);
        }

        if (currentPercentage >= 90 && currentPercentage < 100 && !scoreRef.current.dataset.triggered90) {
          scoreRef.current.dataset.triggered90 = 'true';
          scoreRef.current.style.transform = 'scale(1.2)';
          scoreRef.current.style.color = '#2ECC71';
          CelebrationManager.triggerConfetti('achievement', { particleCount: 50 });
          CelebrationManager.triggerHapticFeedback('medium');
          setTimeout(() => {
            if (scoreRef.current) {
              scoreRef.current.style.transform = 'scale(1)';
            }
          }, 300);
        }

        if (currentPercentage === 100 && !scoreRef.current.dataset.triggered100) {
          scoreRef.current.dataset.triggered100 = 'true';
          scoreRef.current.style.transform = 'scale(1.3)';
          scoreRef.current.style.color = '#FFD700';
          CelebrationManager.triggerConfetti('perfect');
          CelebrationManager.triggerHapticFeedback('success');
          setTimeout(() => {
            if (scoreRef.current) {
              scoreRef.current.style.transform = 'scale(1)';
            }
          }, 400);
        }
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimationComplete(true);
        onAnimationComplete?.();
      }
    };

    if (scoreRef.current) {
      scoreRef.current.style.transition = 'transform 0.3s ease, color 0.3s ease';
    }
    if (percentageRef.current) {
      percentageRef.current.style.transition = 'transform 0.3s ease, color 0.3s ease';
    }

    requestAnimationFrame(animate);
  }, [score, totalQuestions, duration, finalPercentage, showConfetti, onAnimationComplete]);

  const getScoreColor = () => {
    if (displayPercentage >= 90) return 'text-yellow-400';
    if (displayPercentage >= 80) return 'text-green-400';
    if (displayPercentage >= 70) return 'text-blue-400';
    if (displayPercentage >= 60) return 'text-purple-400';
    return 'text-gray-400';
  };

  const getScoreGlow = () => {
    if (displayPercentage >= 90) return 'drop-shadow-glow-yellow';
    if (displayPercentage >= 80) return 'drop-shadow-glow-green';
    if (displayPercentage >= 70) return 'drop-shadow-glow-blue';
    return '';
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="relative">
        <div
          ref={scoreRef}
          className={`text-6xl font-bold transition-all duration-300 ${getScoreColor()} ${getScoreGlow()}`}
        >
          {displayScore}/{totalQuestions}
        </div>

        {showPercentage && (
          <div
            ref={percentageRef}
            className={`text-4xl font-semibold mt-2 transition-all duration-300 ${getScoreColor()}`}
          >
            {displayPercentage}%
          </div>
        )}

        {animationComplete && displayPercentage === 100 && (
          <div className="absolute -top-2 -right-2 text-yellow-400 text-2xl animate-ping">
            ⭐
          </div>
        )}

        {animationComplete && displayPercentage >= 90 && displayPercentage < 100 && (
          <div className="absolute -top-2 -right-2 text-green-400 text-xl animate-bounce">
            🎯
          </div>
        )}

        {animationComplete && displayPercentage >= 80 && displayPercentage < 90 && (
          <div className="absolute -top-2 -right-2 text-blue-400 text-lg animate-pulse">
            👏
          </div>
        )}
      </div>

      <style jsx>{`
        .drop-shadow-glow-yellow {
          filter: drop-shadow(0 0 10px rgba(255, 212, 0, 0.6));
        }
        .drop-shadow-glow-green {
          filter: drop-shadow(0 0 10px rgba(46, 204, 113, 0.6));
        }
        .drop-shadow-glow-blue {
          filter: drop-shadow(0 0 10px rgba(52, 152, 219, 0.6));
        }
      `}</style>
    </div>
  );
};

export default AnimatedScore;
