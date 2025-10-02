import { useEffect } from "react";
import { FaPlay, FaClock, FaPause } from "react-icons/fa";

const PauseOverlay = ({
    isVisible,
    onResume,
    currentQuestionNumber,
    totalQuestions,
    timeRemaining,
    score,
    onBackToSetup,
}) => {
    // Prevent scrolling when overlay is visible
    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isVisible]);

    // Handle keyboard events for resume
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isVisible && (e.key === " " || e.key === "Enter")) {
                e.preventDefault();
                onResume();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isVisible, onResume]);

    if (!isVisible) return null;

    const formatTime = (seconds) => {
        if (seconds >= 60) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${seconds}s`;
    };

    const motivationalMessages = [
        "Take a deep breath and come back stronger! 🌟",
        "Your progress is safe. Ready to continue? 💪",
        "Knowledge awaits! Resume when you're ready 🧠",
        "Great job so far! Take your time and resume when ready ⭐",
        "Learning never stops. Continue your journey! 🚀",
        "You're doing amazing! Ready for the next challenge? 🎯",
    ];

    const randomMessage =
        motivationalMessages[
            Math.floor(Math.random() * motivationalMessages.length)
        ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pause-title"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Overlay Content */}
            <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center border border-white/20">
                {/* Pause Icon */}
                <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <FaPause className="text-3xl text-white" />
                    </div>
                    <h2
                        id="pause-title"
                        className="text-2xl font-bold text-gray-800"
                    >
                        Quiz Paused
                    </h2>
                </div>

                {/* Motivational Message */}
                <p className="text-gray-600 text-lg mb-6">{randomMessage}</p>

                {/* Progress Info */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 mb-6 space-y-3 border border-purple-100">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Progress:</span>
                        <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {currentQuestionNumber} of {totalQuestions}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Current Score:</span>
                        <span className="font-semibold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                            {score} correct
                        </span>
                    </div>

                    {timeRemaining !== null && (
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 flex items-center gap-1">
                                <FaClock className="text-sm" />
                                Time Left:
                            </span>
                            <span className="font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                                {formatTime(timeRemaining)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={onResume}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
                       text-white font-bold py-4 px-6 rounded-lg
                       transition-all duration-300 transform hover:scale-105
                       focus:outline-none focus:ring-4 focus:ring-green-300
                       shadow-lg hover:shadow-xl
                       flex items-center justify-center gap-3"
                        autoFocus
                    >
                        <FaPlay className="text-lg" />
                        <span className="text-lg">Resume Quiz</span>
                    </button>

                    {onBackToSetup && (
                        <button
                            onClick={() => {
                                if (
                                    window.confirm(
                                        "Are you sure you want to go back to setup? Your current progress will be lost.",
                                    )
                                ) {
                                    onBackToSetup();
                                }
                            }}
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600
                           text-black font-bold py-3 px-6 rounded-lg
                           transition-all duration-300 transform hover:scale-105
                           focus:outline-none focus:ring-4 focus:ring-yellow-300
                           shadow-lg hover:shadow-xl
                           flex items-center justify-center gap-3"
                        >
                            <span className="text-lg">⚙️</span>
                            <span className="text-lg">Back to Setup</span>
                        </button>
                    )}
                </div>

                {/* Keyboard Hint */}
                <p className="text-sm text-gray-500 mt-4">
                    Press{" "}
                    <kbd className="bg-gradient-to-r from-purple-100 to-blue-100 px-2 py-1 rounded text-xs border border-purple-200">
                        Spacebar
                    </kbd>{" "}
                    or{" "}
                    <kbd className="bg-gradient-to-r from-purple-100 to-blue-100 px-2 py-1 rounded text-xs border border-purple-200">
                        Enter
                    </kbd>{" "}
                    to resume
                </p>
            </div>
        </div>
    );
};

export default PauseOverlay;
