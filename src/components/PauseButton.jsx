const PauseButton = ({ isPaused, onTogglePause, disabled = false }) => {
    return (
        <button
            onClick={onTogglePause}
            disabled={disabled}
            className={`
                absolute top-0 left-0 z-50
                flex items-center justify-center
                w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg
                transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                touch-manipulation
            `}
            aria-label={isPaused ? "Resume quiz" : "Pause quiz"}
            title={
                isPaused ? "Resume quiz (Spacebar)" : "Pause quiz (Spacebar)"
            }
        >
            <span className="text-lg">{isPaused ? "▶️" : "⏸️"}</span>
        </button>
    );
};

export default PauseButton;
