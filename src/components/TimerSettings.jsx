import { useState } from "react";

const TimerSettings = ({
    currentDuration,
    onDurationChange,
    isTimerEnabled,
    onTimerToggle,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const timerOptions = [
        { value: 15, label: "15 seconds", icon: "⚡" },
        { value: 30, label: "30 seconds", icon: "🔥" },
        { value: 60, label: "1 minute", icon: "⏰" },
        { value: 90, label: "1.5 minutes", icon: "🕐" },
        { value: 0, label: "No limit", icon: "♾️" },
    ];

    const handleDurationSelect = (duration) => {
        onDurationChange(duration);
        setIsOpen(false);
    };

    const getCurrentOption = () => {
        return (
            timerOptions.find((option) => option.value === currentDuration) ||
            timerOptions[1]
        );
    };

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40 touch-manipulation"
                title="Timer Settings"
                aria-label="Timer Settings"
            >
                <span className="text-lg">⚙️</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 min-w-64 max-w-xs sm:max-w-sm">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">⏱️</span>
                                <span className="font-medium text-gray-800">
                                    Enable Timer
                                </span>
                            </div>
                            <button
                                onClick={() => onTimerToggle(!isTimerEnabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                    isTimerEnabled
                                        ? "bg-purple-600"
                                        : "bg-gray-300"
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                        isTimerEnabled
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {isTimerEnabled && (
                        <div className="p-2">
                            <div className="text-sm font-medium text-gray-600 px-3 py-2">
                                Timer Duration
                            </div>
                            <div className="space-y-1">
                                {timerOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() =>
                                            handleDurationSelect(option.value)
                                        }
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-150 ${
                                            currentDuration === option.value
                                                ? "bg-purple-100 text-purple-800 font-medium"
                                                : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        <span className="text-lg">
                                            {option.icon}
                                        </span>
                                        <span>{option.label}</span>
                                        {currentDuration === option.value && (
                                            <span className="ml-auto text-purple-600">
                                                ✓
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="p-3 bg-gray-50 border-t border-gray-100">
                        <div className="text-sm text-gray-600">
                            Current Setting:
                            <span className="font-medium text-gray-800 ml-1">
                                {isTimerEnabled
                                    ? getCurrentOption().label
                                    : "Timer Disabled"}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default TimerSettings;
