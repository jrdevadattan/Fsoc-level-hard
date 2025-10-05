import React, { useState, useEffect } from "react";
import CelebrationManager from "../utils/CelebrationManager";

const CelebrationSettings = ({ isOpen, onClose }) => {
    const [settings, setSettings] = useState({
        enableAnimations: true,
        enableSound: false,
        respectReducedMotion: true,
    });

    useEffect(() => {
        if (isOpen) {
            const currentSettings = CelebrationManager.getSettings();
            setSettings(currentSettings);
        }
    }, [isOpen]);

    const handleSettingChange = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        CelebrationManager.updateSettings(newSettings);
    };

    const handleTestCelebration = (type) => {
        switch (type) {
            case "confetti":
                CelebrationManager.triggerConfetti("default");
                break;
            case "perfect":
                CelebrationManager.triggerConfetti("perfect");
                break;
            case "fireworks":
                CelebrationManager.triggerFireworks(2000);
                break;
            case "haptic":
                CelebrationManager.triggerHapticFeedback("medium");
                break;
            default:
                CelebrationManager.triggerConfetti("default");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        🎉 Celebration Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Enable Animations */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Enable Animations
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Show confetti, fireworks, and other visual
                                effects
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.enableAnimations}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "enableAnimations",
                                        e.target.checked,
                                    )
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    {/* Enable Sound */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Enable Sound Effects
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Play audio feedback for celebrations
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.enableSound}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "enableSound",
                                        e.target.checked,
                                    )
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    {/* Respect Reduced Motion */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Respect Reduced Motion
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Honor system preference for reduced motion
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.respectReducedMotion}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "respectReducedMotion",
                                        e.target.checked,
                                    )
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    {/* Test Celebrations */}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Test Celebrations
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() =>
                                    handleTestCelebration("confetti")
                                }
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                disabled={!settings.enableAnimations}
                            >
                                🎊 Confetti
                            </button>
                            <button
                                onClick={() => handleTestCelebration("perfect")}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                disabled={!settings.enableAnimations}
                            >
                                💯 Perfect Score
                            </button>
                            <button
                                onClick={() =>
                                    handleTestCelebration("fireworks")
                                }
                                className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                disabled={!settings.enableAnimations}
                            >
                                🎆 Fireworks
                            </button>
                            <button
                                onClick={() => handleTestCelebration("haptic")}
                                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                📳 Haptic
                            </button>
                        </div>
                    </div>

                    {/* Info about browser support */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
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
                                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    Browser Support Note
                                </h4>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                    Haptic feedback requires mobile devices.
                                    Sound effects may need user interaction to
                                    work due to browser autoplay policies.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CelebrationSettings;
