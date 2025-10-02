import { useState, useEffect, useRef } from "react";

const CountdownTimer = ({
    duration = 30,
    onTimeUp,
    isActive = true,
    isPaused = false,
    showWarningAt = 10,
    onWarning,
    className = "",
}) => {
    const [timeRemaining, setTimeRemaining] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const hasWarningFired = useRef(false);

    // Reset timer when duration changes
    useEffect(() => {
        setTimeRemaining(duration);
        hasWarningFired.current = false;
        if (isActive && !isPaused) {
            setIsRunning(true);
        }
    }, [duration, isActive, isPaused]);

    // Handle pause/resume
    useEffect(() => {
        if (isPaused) {
            setIsRunning(false);
        } else if (isActive && timeRemaining > 0) {
            setIsRunning(true);
        }
    }, [isPaused, isActive, timeRemaining]);

    // Timer logic
    useEffect(() => {
        if (isRunning && timeRemaining > 0) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    const newTime = prev - 1;

                    // Fire warning at specified time
                    if (
                        newTime === showWarningAt &&
                        !hasWarningFired.current &&
                        onWarning
                    ) {
                        hasWarningFired.current = true;
                        onWarning();
                    }

                    // Fire time up when reaching 0
                    if (newTime <= 0) {
                        setIsRunning(false);
                        if (onTimeUp) {
                            onTimeUp();
                        }
                        return 0;
                    }

                    return newTime;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, timeRemaining, onTimeUp, showWarningAt, onWarning]);

    // Calculate progress percentage
    const progressPercentage = (timeRemaining / duration) * 100;

    // Determine color based on time remaining
    const getTimerColor = () => {
        const percentage = (timeRemaining / duration) * 100;
        if (percentage <= 20) return "text-red-500";
        if (percentage <= 40) return "text-yellow-500";
        return "text-green-500";
    };

    const getProgressBarColor = () => {
        const percentage = (timeRemaining / duration) * 100;
        if (percentage <= 20) return "bg-red-500";
        if (percentage <= 40) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getProgressBarGlow = () => {
        const percentage = (timeRemaining / duration) * 100;
        if (percentage <= 20) return "shadow-red-500/50";
        if (percentage <= 40) return "shadow-yellow-500/50";
        return "shadow-green-500/50";
    };

    // Format time display
    const formatTime = (seconds) => {
        if (seconds >= 60) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${seconds}s`;
    };

    if (!isActive) {
        return null;
    }

    return (
        <div className={`w-full ${className}`}>
            {/* Timer Display */}
            <div className="flex items-center justify-center gap-3 mb-4">
                <div
                    className={`text-2xl transition-colors duration-300 ${getTimerColor()}`}
                >
                    ⏱️
                </div>
                <span
                    className={`text-xl font-bold transition-colors duration-300 ${getTimerColor()}`}
                >
                    Time Remaining: {formatTime(timeRemaining)}
                </span>
            </div>

            {/* Progress Bar Container */}
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                {/* Background track */}
                <div className="absolute inset-0 bg-gray-300 rounded-full"></div>

                {/* Progress bar */}
                <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-linear ${getProgressBarColor()} ${getProgressBarGlow()} shadow-lg`}
                    style={{
                        width: `${progressPercentage}%`,
                        transition:
                            "width 1s linear, background-color 0.3s ease",
                    }}
                >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
                </div>

                {/* Warning pulse effect when time is low */}
                {timeRemaining <= showWarningAt && (
                    <div
                        className={`absolute inset-0 rounded-full animate-pulse ${getProgressBarColor()} opacity-30`}
                    ></div>
                )}
            </div>
        </div>
    );
};

export default CountdownTimer;
