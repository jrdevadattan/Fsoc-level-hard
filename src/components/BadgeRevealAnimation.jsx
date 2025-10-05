import React, { useEffect, useState, useRef } from 'react';
import CelebrationManager from '../utils/CelebrationManager';

const BadgeRevealAnimation = ({
  badge,
  isVisible,
  onComplete,
  duration = 4000,
  showShareButton = true
}) => {
  const [animationPhase, setAnimationPhase] = useState('hidden');
  const [showBadgeDetails, setShowBadgeDetails] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const badgeRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isVisible && badge) {
      setAnimationPhase('scaleIn');

      const sequence = [
        { phase: 'shine', delay: 800 },
        { phase: 'details', delay: 1500 },
        { phase: 'share', delay: 2500 },
        { phase: 'complete', delay: duration }
      ];

      sequence.forEach(({ phase, delay }) => {
        setTimeout(() => {
          if (phase === 'shine') {
            triggerShineEffect();
          } else if (phase === 'details') {
            setShowBadgeDetails(true);
          } else if (phase === 'share' && showShareButton) {
            setShowShareOptions(true);
          } else if (phase === 'complete') {
            handleComplete();
          }
        }, delay);
      });

      CelebrationManager.triggerConfetti('achievement', {
        particleCount: 60,
        spread: 80,
        origin: { y: 0.7 }
      });
      CelebrationManager.triggerHapticFeedback('medium');

      if (badgeRef.current) {
        CelebrationManager.createSparkles(badgeRef.current, 5);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, badge, duration, showShareButton]);

  const triggerShineEffect = () => {
    if (badgeRef.current) {
      const shineElement = badgeRef.current.querySelector('.badge-shine-effect');
      if (shineElement) {
        shineElement.style.animation = 'badgeShine 1.5s ease-in-out';
        setTimeout(() => {
          if (shineElement) {
            shineElement.style.animation = '';
          }
        }, 1500);
      }
    }
  };

  const handleComplete = () => {
    setAnimationPhase('fadeOut');
    setTimeout(() => {
      onComplete?.();
    }, 500);
  };

  const handleShare = (platform) => {
    const shareText = `I just earned the "${badge.name}" badge! ${badge.description}`;
    const shareUrl = window.location.origin;

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'copy':
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
          CelebrationManager.showToast('Badge achievement copied to clipboard!', 'success');
        });
        break;
    }
  };

  const handleContinue = () => {
    handleComplete();
  };

  if (!isVisible || !badge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className={`
          relative transform transition-all duration-700 ease-out
          ${animationPhase === 'scaleIn' ? 'scale-100 opacity-100' : ''}
          ${animationPhase === 'hidden' ? 'scale-0 opacity-0' : ''}
          ${animationPhase === 'fadeOut' ? 'scale-95 opacity-0' : ''}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 rounded-3xl blur-xl" />

        <div className="relative bg-gray-900/95 backdrop-blur-md rounded-3xl p-8 border border-white/10 min-w-[320px] max-w-md">
          <div className="text-center">
            <div
              ref={badgeRef}
              className={`
                relative inline-block mb-6 transform transition-all duration-500
                ${animationPhase === 'scaleIn' ? 'scale-100 animate-pulse' : 'scale-75'}
              `}
            >
              <div className="relative badge-shine overflow-hidden rounded-full">
                <div className="text-8xl transform transition-transform duration-300 hover:scale-110">
                  {badge.icon}
                </div>
                <div className="badge-shine-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>

              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-yellow-400/20 via-purple-500/20 to-pink-500/20 animate-spin" style={{ animationDuration: '3s' }} />
            </div>

            <h2 className="text-2xl font-bold text-yellow-400 mb-2 animate-fadeInUp">
              Badge Unlocked!
            </h2>

            <div
              className={`
                transition-all duration-500 transform
                ${showBadgeDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
            >
              <div className="bg-gray-800/80 rounded-xl p-6 mb-4 backdrop-blur-sm border border-white/5">
                <h3 className="text-xl font-bold text-white mb-2">{badge.name}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{badge.description}</p>

                {badge.rarity && (
                  <div className="mt-3 flex items-center justify-center">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${badge.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                        badge.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                        badge.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'}
                    `}>
                      {badge.rarity.toUpperCase()} BADGE
                    </span>
                  </div>
                )}
              </div>
            </div>

            {showShareButton && (
              <div
                className={`
                  transition-all duration-500 transform
                  ${showShareOptions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
              >
                <p className="text-sm text-gray-400 mb-3">Share your achievement:</p>
                <div className="flex justify-center space-x-3 mb-4">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
                    title="Share on Twitter"
                  >
                    🐦
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
                    title="Share on Facebook"
                  >
                    📘
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleContinue}
              className={`
                w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700
                text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105
                shadow-lg hover:shadow-xl
                ${showBadgeDetails ? 'opacity-100' : 'opacity-50 pointer-events-none'}
              `}
            >
              Tap to Continue
            </button>
          </div>
        </div>

        <div className="absolute -top-4 -right-4 text-yellow-400 text-3xl animate-ping">✨</div>
        <div className="absolute -bottom-4 -left-4 text-pink-400 text-2xl animate-ping" style={{ animationDelay: '0.3s' }}>⭐</div>
        <div className="absolute top-1/4 -right-6 text-blue-400 text-xl animate-ping" style={{ animationDelay: '0.6s' }}>💫</div>
        <div className="absolute top-3/4 -left-6 text-green-400 text-lg animate-bounce" style={{ animationDelay: '0.9s' }}>🎉</div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .badge-shine-effect {
          transform: translateX(-100%);
        }
      `}</style>
    </div>
  );
};

export default BadgeRevealAnimation;
