import React, { useEffect, useState, useRef } from 'react';
import CelebrationManager from '../utils/CelebrationManager';

const StreakCelebration = ({
  streakCount,
  isVisible,
  onComplete,
  position = 'center'
}) => {
  const [animationPhase, setAnimationPhase] = useState('hidden');
  const [fireScale, setFireScale] = useState(1);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isVisible && streakCount > 0) {
      setAnimationPhase('entering');

      setTimeout(() => {
        setAnimationPhase('celebrating');
        triggerStreakCelebration();
      }, 200);

      timeoutRef.current = setTimeout(() => {
        setAnimationPhase('exiting');
        setTimeout(() => {
          setAnimationPhase('hidden');
          onComplete?.();
        }, 500);
      }, 2500);

      const pulseInterval = setInterval(() => {
        setFireScale(prev => prev === 1 ? 1.2 : 1);
      }, 600);

      return () => {
        clearInterval(pulseInterval);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [isVisible, streakCount, onComplete]);

  const triggerStreakCelebration = () => {
    if (streakCount >= 50) {
      CelebrationManager.triggerFireworks(2000);
      CelebrationManager.triggerHapticFeedback('heavy');
    } else if (streakCount >= 25) {
      CelebrationManager.triggerConfetti('streak', { particleCount: 100, spread: 120 });
      CelebrationManager.triggerHapticFeedback('medium');
    } else if (streakCount >= 10) {
      CelebrationManager.triggerConfetti('streak', { particleCount: 60 });
      CelebrationManager.triggerHapticFeedback('light');
    } else if (streakCount >= 5) {
      CelebrationManager.triggerConfetti('streak', { particleCount: 30 });
      CelebrationManager.triggerHapticFeedback('light');
    }

    if (containerRef.current) {
      CelebrationManager.createSparkles(containerRef.current, 3);
    }
  };

  const getStreakData = () => {
    if (streakCount >= 50) {
      return {
        emoji: '🌟',
        title: 'LEGENDARY STREAK!',
        subtitle: `${streakCount} consecutive correct answers!`,
        color: 'text-yellow-400',
        bgColor: 'from-yellow-500/20 to-orange-500/20',
        message: 'You are unstoppable!'
      };
    } else if (streakCount >= 25) {
      return {
        emoji: '⚡',
        title: 'UNSTOPPABLE!',
        subtitle: `${streakCount} in a row!`,
        color: 'text-purple-400',
        bgColor: 'from-purple-500/20 to-pink-500/20',
        message: 'Amazing consistency!'
      };
    } else if (streakCount >= 10) {
      return {
        emoji: '🔥',
        title: 'ON FIRE!',
        subtitle: `${streakCount} correct answers!`,
        color: 'text-orange-400',
        bgColor: 'from-orange-500/20 to-red-500/20',
        message: 'Keep it going!'
      };
    } else if (streakCount >= 5) {
      return {
        emoji: '✨',
        title: 'STREAK!',
        subtitle: `${streakCount} in a row!`,
        color: 'text-blue-400',
        bgColor: 'from-blue-500/20 to-cyan-500/20',
        message: 'Great momentum!'
      };
    }
    return null;
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'left-4 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'right-4 top-1/2 transform -translate-y-1/2';
      default:
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
  };

  if (animationPhase === 'hidden' || !isVisible) return null;

  const streakData = getStreakData();
  if (!streakData) return null;

  return (
    <div
      ref={containerRef}
      className={`
        fixed z-40 ${getPositionClasses()}
        transition-all duration-500 ease-out
        ${animationPhase === 'entering' ? 'scale-0 opacity-0 rotate-12' : ''}
        ${animationPhase === 'celebrating' ? 'scale-100 opacity-100 rotate-0' : ''}
        ${animationPhase === 'exiting' ? 'scale-0 opacity-0 -rotate-12' : ''}
      `}
    >
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${streakData.bgColor} rounded-2xl blur-xl`} />

        <div className="relative bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 border border-white/10 min-w-[280px]">
          <div className="text-center">
            <div
              className="text-6xl mb-3 transition-transform duration-300"
              style={{ transform: `scale(${fireScale})` }}
            >
              {streakData.emoji}
            </div>

            <h3 className={`text-2xl font-bold ${streakData.color} mb-1`}>
              {streakData.title}
            </h3>

            <p className="text-lg text-white mb-2">
              {streakData.subtitle}
            </p>

            <p className="text-sm text-gray-300">
              {streakData.message}
            </p>

            {streakCount >= 10 && (
              <div className="mt-4 flex justify-center space-x-1">
                {Array.from({ length: Math.min(streakCount, 20) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 50}ms` }}
                  />
                ))}
                {streakCount > 20 && (
                  <div className="text-orange-400 text-sm font-bold ml-2">
                    +{streakCount - 20}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="absolute -top-2 -right-2 text-yellow-400 text-2xl animate-ping">✨</div>
        <div className="absolute -bottom-2 -left-2 text-orange-400 text-xl animate-ping" style={{ animationDelay: '0.3s' }}>🎉</div>

        {streakCount >= 25 && (
          <>
            <div className="absolute top-1/4 -right-4 text-purple-400 text-lg animate-bounce" style={{ animationDelay: '0.6s' }}>💫</div>
            <div className="absolute bottom-1/4 -left-4 text-pink-400 text-lg animate-bounce" style={{ animationDelay: '0.9s' }}>⭐</div>
          </>
        )}
      </div>
    </div>
  );
};

export default StreakCelebration;
