import React, { useEffect, useState, useRef } from 'react';
import CelebrationManager from '../utils/CelebrationManager';

const LevelUpAnimation = ({
  currentLevel,
  newLevel,
  currentXP,
  xpToNextLevel,
  isVisible,
  onComplete,
  benefits = [],
  duration = 5000
}) => {
  const [animationPhase, setAnimationPhase] = useState('hidden');
  const [displayLevel, setDisplayLevel] = useState(currentLevel);
  const [xpProgress, setXpProgress] = useState(0);
  const [showBenefits, setShowBenefits] = useState(false);
  const [burstEffect, setBurstEffect] = useState(false);
  const levelRef = useRef(null);
  const xpBarRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      setAnimationPhase('entering');

      setTimeout(() => {
        setAnimationPhase('xpFilling');
        animateXPBar();
      }, 500);

      setTimeout(() => {
        setAnimationPhase('levelUp');
        animateLevelIncrease();
      }, 2000);

      setTimeout(() => {
        setAnimationPhase('benefits');
        setShowBenefits(true);
      }, 3500);

      timeoutRef.current = setTimeout(() => {
        setAnimationPhase('exiting');
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }, duration);

      CelebrationManager.triggerConfetti('levelUp');
      CelebrationManager.triggerHapticFeedback('heavy');
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, duration, onComplete]);

  const animateXPBar = () => {
    const startTime = Date.now();
    const animationDuration = 1500;
    const targetProgress = 100;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentProgress = easeOutQuart * targetProgress;

      setXpProgress(currentProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setBurstEffect(true);
          if (xpBarRef.current) {
            CelebrationManager.createSparkles(xpBarRef.current, 8);
          }
        }, 200);
      }
    };

    requestAnimationFrame(animate);
  };

  const animateLevelIncrease = () => {
    setBurstEffect(true);

    const startTime = Date.now();
    const animationDuration = 800;
    const levelDiff = newLevel - currentLevel;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      const easeOutBounce = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentLevelFloat = currentLevel + (levelDiff * easeOutBounce);
      setDisplayLevel(Math.floor(currentLevelFloat));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayLevel(newLevel);

        CelebrationManager.triggerFireworks(2000);

        if (levelRef.current) {
          levelRef.current.style.animation = 'levelUpBurst 1s ease-out';
          setTimeout(() => {
            if (levelRef.current) {
              levelRef.current.style.animation = '';
            }
          }, 1000);
        }
      }
    };

    requestAnimationFrame(animate);
  };

  const handleClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setAnimationPhase('exiting');
    setTimeout(() => {
      onComplete?.();
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className={`
          relative transform transition-all duration-700 ease-out
          ${animationPhase === 'entering' ? 'scale-100 opacity-100' : ''}
          ${animationPhase === 'hidden' ? 'scale-0 opacity-0' : ''}
          ${animationPhase === 'exiting' ? 'scale-95 opacity-0' : ''}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-xl" />

        <div className="relative bg-gray-900/95 backdrop-blur-md rounded-3xl p-8 border border-white/10 min-w-[350px] max-w-md">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🚀</div>

            <h2 className="text-3xl font-bold text-yellow-400 mb-6">
              LEVEL UP!
            </h2>

            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <span className="text-2xl text-gray-400">Lv.{currentLevel}</span>
                <div className="text-3xl text-yellow-400">→</div>
                <div
                  ref={levelRef}
                  className={`
                    text-4xl font-bold text-yellow-300 transition-all duration-300
                    ${burstEffect ? 'animate-pulse' : ''}
                  `}
                >
                  Lv.{displayLevel}
                </div>
              </div>

              <div className="relative">
                <div
                  ref={xpBarRef}
                  className="w-full bg-gray-700 rounded-full h-4 overflow-hidden border border-yellow-500/30"
                >
                  <div
                    className={`
                      h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600
                      transition-all duration-1000 ease-out relative
                      ${burstEffect ? 'animate-pulse' : ''}
                    `}
                    style={{ width: `${xpProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </div>
                </div>

                <div className="flex justify-between mt-2 text-sm text-gray-400">
                  <span>{currentXP} XP</span>
                  <span>{xpToNextLevel} XP</span>
                </div>
              </div>
            </div>

            {burstEffect && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 bg-yellow-400/20 rounded-full animate-ping" />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-48 h-48 bg-orange-500/10 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            )}

            <div
              className={`
                transition-all duration-500 transform
                ${showBenefits ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
            >
              {benefits.length > 0 && (
                <div className="bg-gray-800/80 rounded-xl p-6 mb-6 backdrop-blur-sm border border-white/5">
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">
                    New Privileges Unlocked:
                  </h3>
                  <ul className="text-sm text-gray-300 space-y-2">
                    {benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className={`
                          flex items-center opacity-0 animate-fadeInLeft
                        `}
                        style={{ animationDelay: `${index * 0.2}s`, animationFillMode: 'forwards' }}
                      >
                        <span className="text-green-400 mr-3 text-lg">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={handleClose}
              className={`
                w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700
                text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105
                shadow-lg hover:shadow-xl
                ${showBenefits ? 'opacity-100' : 'opacity-50 pointer-events-none'}
              `}
            >
              Continue Your Journey
            </button>
          </div>
        </div>

        <div className="absolute -top-6 -right-6 text-yellow-400 text-4xl animate-ping">⭐</div>
        <div className="absolute -bottom-6 -left-6 text-orange-400 text-3xl animate-ping" style={{ animationDelay: '0.3s' }}>🔥</div>
        <div className="absolute top-1/4 -right-8 text-purple-400 text-2xl animate-bounce" style={{ animationDelay: '0.6s' }}>💫</div>
        <div className="absolute top-3/4 -left-8 text-pink-400 text-2xl animate-bounce" style={{ animationDelay: '0.9s' }}>🎊</div>
      </div>

      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.6s ease-out;
        }

        @keyframes levelUpBurst {
          0% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.3);
            filter: brightness(1.5);
          }
          100% {
            transform: scale(1);
            filter: brightness(1);
          }
        }
      `}</style>
    </div>
  );
};

export default LevelUpAnimation;
