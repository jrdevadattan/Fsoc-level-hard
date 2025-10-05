import React, { useEffect, useState, useRef } from "react";
import CelebrationManager from "../utils/CelebrationManager";

const CelebrationOverlay = ({
    type,
    isVisible,
    onComplete,
    data = {},
    duration = 3000,
}) => {
    const [animationPhase, setAnimationPhase] = useState("enter");
    const overlayRef = useRef(null);
    const timeoutRef = useRef(null);

    const triggerCelebration = () => {
        switch (type) {
            case "perfectScore":
                CelebrationManager.triggerConfetti("perfect");
                CelebrationManager.triggerHapticFeedback("success");
                break;
            case "highScore":
                CelebrationManager.triggerConfetti("achievement");
                CelebrationManager.triggerHapticFeedback("medium");
                break;
            case "levelUp":
                CelebrationManager.celebrateLevel(data.level);
                break;
            case "streak":
                CelebrationManager.celebrateStreak(data.count);
                break;
            case "badge":
                CelebrationManager.celebrateBadge();
                break;
            case "fireworks":
                CelebrationManager.triggerFireworks(duration);
                break;
            default:
                CelebrationManager.triggerConfetti();
        }
    };

    useEffect(() => {
        if (isVisible) {
            setAnimationPhase("enter");

            setTimeout(() => {
                setAnimationPhase("celebrate");
                triggerCelebration();
            }, 100);

            timeoutRef.current = setTimeout(() => {
                setAnimationPhase("exit");
                setTimeout(() => {
                    onComplete?.();
                }, 500);
            }, duration);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isVisible, duration, onComplete, type, data]);

    const handleOverlayClick = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setAnimationPhase("exit");
        setTimeout(() => {
            onComplete?.();
        }, 500);
    };

    if (!isVisible) return null;

    const renderContent = () => {
        switch (type) {
            case "perfectScore":
                return (
                    <div className="text-center">
                        <div className="text-8xl mb-4 animate-bounce">🏆</div>
                        <h2 className="text-4xl font-bold text-yellow-400 mb-2">
                            PERFECT SCORE!
                        </h2>
                        <p className="text-xl text-white">
                            Outstanding performance! 100% accuracy!
                        </p>
                        <div className="text-6xl font-bold text-yellow-300 mt-4">
                            100%
                        </div>
                    </div>
                );

            case "highScore":
                return (
                    <div className="text-center">
                        <div className="text-8xl mb-4 animate-pulse">⭐</div>
                        <h2 className="text-4xl font-bold text-blue-400 mb-2">
                            EXCELLENT!
                        </h2>
                        <p className="text-xl text-white">
                            Amazing performance!
                        </p>
                        <div className="text-5xl font-bold text-blue-300 mt-4">
                            {data.percentage}%
                        </div>
                    </div>
                );

            case "levelUp":
                return (
                    <div className="text-center">
                        <div className="text-8xl mb-4 animate-bounce">🚀</div>
                        <h2 className="text-4xl font-bold text-purple-400 mb-2">
                            LEVEL UP!
                        </h2>
                        <p className="text-xl text-white mb-4">
                            You've reached level {data.level}!
                        </p>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-purple-300 mb-2">
                                New Privileges Unlocked:
                            </h3>
                            <ul className="text-sm text-gray-300 space-y-1">
                                {data.benefits?.map((benefit, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <span className="text-green-400 mr-2">
                                            ✓
                                        </span>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );

            case "streak": {
                const getStreakEmoji = (count) => {
                    if (count >= 50) return "🌟";
                    if (count >= 25) return "⚡";
                    if (count >= 10) return "🔥";
                    return "✨";
                };

                return (
                    <div className="text-center">
                        <div className="text-8xl mb-4 animate-pulse">
                            {getStreakEmoji(data.count)}
                        </div>
                        <h2 className="text-4xl font-bold text-orange-400 mb-2">
                            STREAK!
                        </h2>
                        <p className="text-xl text-white mb-4">
                            {data.count} consecutive correct answers!
                        </p>
                        {data.count >= 25 && (
                            <div className="text-lg text-yellow-300">
                                🎉 Legendary streak achieved! 🎉
                            </div>
                        )}
                    </div>
                );
            }

            case "badge":
                return (
                    <div className="text-center">
                        <div className="text-8xl mb-4 animate-bounce">
                            {data.icon}
                        </div>
                        <h2 className="text-3xl font-bold text-green-400 mb-2">
                            Badge Unlocked!
                        </h2>
                        <div className="bg-gray-800 rounded-lg p-6 max-w-sm mx-auto">
                            <h3 className="text-xl font-bold text-white mb-2">
                                {data.name}
                            </h3>
                            <p className="text-gray-300 text-sm">
                                {data.description}
                            </p>
                        </div>
                    </div>
                );

            case "fireworks":
                return (
                    <div className="text-center">
                        <div className="text-8xl mb-4 animate-pulse">🎆</div>
                        <h2 className="text-4xl font-bold text-pink-400 mb-2">
                            EXTRAORDINARY!
                        </h2>
                        <p className="text-xl text-white">
                            Rare achievement unlocked!
                        </p>
                    </div>
                );

            default:
                return (
                    <div className="text-center">
                        <div className="text-8xl mb-4 animate-bounce">🎉</div>
                        <h2 className="text-4xl font-bold text-blue-400 mb-2">
                            Celebration!
                        </h2>
                        <p className="text-xl text-white">Great job!</p>
                    </div>
                );
        }
    };

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className={`
        fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer
        transition-all duration-500 ease-out
        ${animationPhase === "enter" ? "bg-black/0" : "bg-black/70 backdrop-blur-sm"}
        ${animationPhase === "exit" ? "bg-black/0" : ""}
      `}
        >
            <div
                className={`
          relative transform transition-all duration-500 ease-out
          ${animationPhase === "enter" ? "scale-0 opacity-0 rotate-180" : ""}
          ${animationPhase === "celebrate" ? "scale-100 opacity-100 rotate-0" : ""}
          ${animationPhase === "exit" ? "scale-0 opacity-0 rotate-180" : ""}
        `}
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 rounded-3xl blur-xl" />
                    <div className="relative bg-gray-900/90 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        {renderContent()}

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-400">
                                Click anywhere to continue
                            </p>
                        </div>
                    </div>
                </div>

                <div className="absolute -top-4 -right-4 text-yellow-400 text-3xl animate-ping">
                    ✨
                </div>
                <div
                    className="absolute -bottom-4 -left-4 text-pink-400 text-2xl animate-ping"
                    style={{ animationDelay: "0.3s" }}
                >
                    ⭐
                </div>
                <div
                    className="absolute top-1/4 -right-6 text-blue-400 text-xl animate-ping"
                    style={{ animationDelay: "0.6s" }}
                >
                    💫
                </div>
                <div
                    className="absolute top-3/4 -left-6 text-green-400 text-lg animate-bounce"
                    style={{ animationDelay: "0.9s" }}
                >
                    🎉
                </div>
            </div>

            <style jsx>{`
                @keyframes celebrationGlow {
                    0%,
                    100% {
                        box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
                    }
                    50% {
                        box-shadow:
                            0 0 40px rgba(139, 92, 246, 0.6),
                            0 0 60px rgba(59, 130, 246, 0.4);
                    }
                }
            `}</style>
        </div>
    );
};

export default CelebrationOverlay;
