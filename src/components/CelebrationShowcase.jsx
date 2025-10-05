import React, { useState } from "react";
import CelebrationManager from "../utils/CelebrationManager";
import CelebrationOverlay from "./CelebrationOverlay";
import AnimatedScore from "./AnimatedScore";
import StreakCelebration from "./StreakCelebration";
import BadgeRevealAnimation from "./BadgeRevealAnimation";
import LevelUpAnimation from "./LevelUpAnimation";

const CelebrationShowcase = () => {
    const [activeDemo, setActiveDemo] = useState(null);
    const [demoData, setDemoData] = useState({});

    const triggerDemo = (type) => {
        switch (type) {
            case "perfectScore":
                setDemoData({ percentage: 100 });
                setActiveDemo("perfectScore");
                break;
            case "highScore":
                setDemoData({ percentage: 85 });
                setActiveDemo("highScore");
                break;
            case "confetti":
                CelebrationManager.triggerConfetti("default");
                break;
            case "fireworks":
                CelebrationManager.triggerFireworks(3000);
                break;
            case "streak":
                setDemoData({ count: 15 });
                setActiveDemo("streak");
                break;
            case "badge":
                setDemoData({
                    icon: "🏆",
                    name: "Quiz Master",
                    description: "Complete 10 quizzes with perfect scores",
                    rarity: "legendary",
                });
                setActiveDemo("badge");
                break;
            case "levelUp":
                setDemoData({
                    currentLevel: 5,
                    newLevel: 6,
                    currentXP: 850,
                    xpToNextLevel: 1000,
                    benefits: [
                        "Unlock advanced quiz categories",
                        "Extended time bonuses",
                        "Premium statistics dashboard",
                        "Custom avatar unlocked",
                    ],
                });
                setActiveDemo("levelUp");
                break;
            case "animatedScore":
                setActiveDemo("animatedScore");
                break;
            case "ripple": {
                const button = document.querySelector(`[data-demo="${type}"]`);
                if (button) {
                    CelebrationManager.createRippleEffect(
                        button,
                        "rgba(139, 92, 246, 0.6)",
                    );
                }
                break;
            }
            case "bounce": {
                const bounceButton = document.querySelector(
                    `[data-demo="${type}"]`,
                );
                if (bounceButton) {
                    CelebrationManager.bounceElement(bounceButton, "medium");
                }
                break;
            }
            case "sparkles": {
                const sparkleButton = document.querySelector(
                    `[data-demo="${type}"]`,
                );
                if (sparkleButton) {
                    CelebrationManager.createSparkles(sparkleButton, 8);
                }
                break;
            }
        }
    };

    const closeDemo = () => {
        setActiveDemo(null);
        setDemoData({});
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-purple-900 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        🎉 Celebration Effects Showcase
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Experience all the amazing celebration animations and
                        effects
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Confetti Effects */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            🎊 Confetti Effects
                        </h3>
                        <div className="space-y-3">
                            <button
                                data-demo="confetti"
                                onClick={() => triggerDemo("confetti")}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 ripple-container"
                            >
                                Basic Confetti
                            </button>
                            <button
                                onClick={() =>
                                    CelebrationManager.triggerConfetti(
                                        "perfect",
                                    )
                                }
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Perfect Score Confetti
                            </button>
                            <button
                                onClick={() =>
                                    CelebrationManager.triggerConfetti(
                                        "achievement",
                                    )
                                }
                                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Achievement Confetti
                            </button>
                        </div>
                    </div>

                    {/* Fireworks */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            🎆 Fireworks
                        </h3>
                        <div className="space-y-3">
                            <button
                                data-demo="fireworks"
                                onClick={() => triggerDemo("fireworks")}
                                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Fireworks Display
                            </button>
                            <button
                                onClick={() =>
                                    CelebrationManager.triggerFireworks(5000)
                                }
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Extended Fireworks
                            </button>
                        </div>
                    </div>

                    {/* Score Animations */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            📊 Score Animations
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => triggerDemo("animatedScore")}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Animated Score Reveal
                            </button>
                            <button
                                onClick={() => triggerDemo("perfectScore")}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Perfect Score Overlay
                            </button>
                            <button
                                onClick={() => triggerDemo("highScore")}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                High Score Overlay
                            </button>
                        </div>
                    </div>

                    {/* Celebration Overlays */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            🎯 Achievement Overlays
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => triggerDemo("badge")}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Badge Reveal
                            </button>
                            <button
                                onClick={() => triggerDemo("levelUp")}
                                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Level Up Animation
                            </button>
                            <button
                                onClick={() => triggerDemo("streak")}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Streak Celebration
                            </button>
                        </div>
                    </div>

                    {/* Micro-interactions */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            ✨ Micro-interactions
                        </h3>
                        <div className="space-y-3">
                            <button
                                data-demo="ripple"
                                onClick={() => triggerDemo("ripple")}
                                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 ripple-container"
                            >
                                Ripple Effect
                            </button>
                            <button
                                data-demo="bounce"
                                onClick={() => triggerDemo("bounce")}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Bounce Animation
                            </button>
                            <button
                                data-demo="sparkles"
                                onClick={() => triggerDemo("sparkles")}
                                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 relative"
                            >
                                Sparkle Effect
                            </button>
                        </div>
                    </div>

                    {/* Haptic & Sound */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            📳 Haptic & Audio
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() =>
                                    CelebrationManager.triggerHapticFeedback(
                                        "light",
                                    )
                                }
                                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Light Haptic
                            </button>
                            <button
                                onClick={() =>
                                    CelebrationManager.triggerHapticFeedback(
                                        "medium",
                                    )
                                }
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Medium Haptic
                            </button>
                            <button
                                onClick={() =>
                                    CelebrationManager.triggerHapticFeedback(
                                        "heavy",
                                    )
                                }
                                className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Heavy Haptic
                            </button>
                        </div>
                    </div>
                </div>

                {/* Toast Notifications Demo */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        📢 Toast Notifications
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button
                            onClick={() =>
                                CelebrationManager.showToast(
                                    "Success! Great job!",
                                    "success",
                                )
                            }
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                        >
                            Success Toast
                        </button>
                        <button
                            onClick={() =>
                                CelebrationManager.showToast(
                                    "Error occurred!",
                                    "error",
                                )
                            }
                            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                        >
                            Error Toast
                        </button>
                        <button
                            onClick={() =>
                                CelebrationManager.showToast(
                                    "Information message",
                                    "info",
                                )
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                        >
                            Info Toast
                        </button>
                        <button
                            onClick={() =>
                                CelebrationManager.showToast(
                                    "Warning message",
                                    "warning",
                                )
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                        >
                            Warning Toast
                        </button>
                    </div>
                </div>

                {/* Performance Info */}
                <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start">
                        <svg
                            className="w-6 h-6 text-blue-500 mt-1 mr-3 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div>
                            <h4 className="text-lg font-medium text-blue-800 dark:text-blue-200">
                                Performance Optimized
                            </h4>
                            <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                                <li>
                                    • All animations use CSS transforms (GPU
                                    accelerated)
                                </li>
                                <li>
                                    • RequestAnimationFrame for smooth 60fps
                                    animations
                                </li>
                                <li>
                                    • Respects prefers-reduced-motion setting
                                </li>
                                <li>
                                    • No layout thrashing or performance impacts
                                </li>
                                <li>
                                    • Animations can be disabled in settings
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Celebration Overlays */}
            {activeDemo === "perfectScore" && (
                <CelebrationOverlay
                    type="perfectScore"
                    isVisible={true}
                    onComplete={closeDemo}
                    data={demoData}
                    duration={4000}
                />
            )}

            {activeDemo === "highScore" && (
                <CelebrationOverlay
                    type="highScore"
                    isVisible={true}
                    onComplete={closeDemo}
                    data={demoData}
                    duration={3500}
                />
            )}

            {activeDemo === "streak" && (
                <StreakCelebration
                    streakCount={demoData.count}
                    isVisible={true}
                    onComplete={closeDemo}
                    position="center"
                />
            )}

            {activeDemo === "badge" && (
                <BadgeRevealAnimation
                    badge={demoData}
                    isVisible={true}
                    onComplete={closeDemo}
                    showShareButton={true}
                />
            )}

            {activeDemo === "levelUp" && (
                <LevelUpAnimation
                    currentLevel={demoData.currentLevel}
                    newLevel={demoData.newLevel}
                    currentXP={demoData.currentXP}
                    xpToNextLevel={demoData.xpToNextLevel}
                    isVisible={true}
                    onComplete={closeDemo}
                    benefits={demoData.benefits}
                />
            )}

            {activeDemo === "animatedScore" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                            Animated Score Demo
                        </h3>
                        <AnimatedScore
                            score={8}
                            totalQuestions={10}
                            onAnimationComplete={() =>
                                setTimeout(closeDemo, 2000)
                            }
                            duration={3000}
                            showPercentage={true}
                            showConfetti={true}
                            className="mb-6"
                        />
                        <button
                            onClick={closeDemo}
                            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CelebrationShowcase;
