"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function KeyboardShortcuts({ onPauseToggle, isPaused }) {
    const focusedIndexRef = useRef(-1);
    const [showHelp, setShowHelp] = useState(true);

    // Get all interactive answer buttons for the current question
    const getAnswerButtons = () => {
        const nodes = Array.from(
            document.querySelectorAll('[data-quiz-answer="true"]'),
        );
        // Only include visible and enabled buttons
        return nodes.filter((btn) => {
            const style = window.getComputedStyle(btn);
            return (
                style.display !== "none" &&
                style.visibility !== "hidden" &&
                !btn.disabled
            );
        });
    };

    const focusButtonAt = useCallback((i) => {
        const buttons = getAnswerButtons();
        if (!buttons.length) return;
        const idx = ((i % buttons.length) + buttons.length) % buttons.length;
        focusedIndexRef.current = idx;
        buttons[idx].focus();
    }, []);

    const clickButtonAt = useCallback((i) => {
        const buttons = getAnswerButtons();
        if (!buttons.length) return;
        const idx = ((i % buttons.length) + buttons.length) % buttons.length;
        buttons[idx].click();
    }, []);

    useEffect(() => {
        const onKeyDown = (e) => {
            // If user is typing in an input/textarea, ignore
            const tag = (e.target?.tagName || "").toLowerCase();
            if (tag === "input" || tag === "textarea") return;

            const buttons = getAnswerButtons();

            // Spacebar to pause/resume quiz
            if (e.key === " " && onPauseToggle) {
                // Only handle spacebar if not focused on a button or other interactive element
                const activeElement = document.activeElement;
                if (
                    !activeElement ||
                    activeElement.tagName === "BODY" ||
                    !activeElement.matches(
                        "button, input, textarea, select, [contenteditable]",
                    )
                ) {
                    e.preventDefault();
                    onPauseToggle();
                    return;
                }
            }

            // Number keys 1-9 select answer index-1
            if (e.key >= "1" && e.key <= "9") {
                const n = Number(e.key);
                if (buttons.length >= n) {
                    e.preventDefault();
                    clickButtonAt(n - 1);
                    return;
                }
            }

            // Arrow navigation among answers
            if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                if (buttons.length > 0) {
                    e.preventDefault();
                    const next = focusedIndexRef.current + 1;
                    focusButtonAt(next);
                }
                return;
            }
            if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                if (buttons.length > 0) {
                    e.preventDefault();
                    const prev = focusedIndexRef.current - 1;
                    focusButtonAt(prev);
                }
                return;
            }

            // Enter / Space to select the currently focused answer
            if (e.key === "Enter" || e.key === " ") {
                if (buttons.length > 0 && focusedIndexRef.current >= 0) {
                    e.preventDefault();
                    clickButtonAt(focusedIndexRef.current);
                }
                return;
            }

            // 'r' to restart from results screen
            if (e.key === "r" || e.key === "R") {
                const restartBtn = document.querySelector(
                    '[data-quiz-restart="true"]',
                );
                if (restartBtn) {
                    e.preventDefault();
                    restartBtn.click();
                }
                return;
            }

            // Escape toggles help overlay
            if (e.key === "Escape") {
                e.preventDefault();
                setShowHelp((s) => !s);
                return;
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onPauseToggle, clickButtonAt, focusButtonAt]);

    // Minimal, self-contained help overlay
    return showHelp ? (
        <div
            role="dialog"
            aria-label="Keyboard shortcuts help"
            style={{
                position: "fixed",
                right: "1rem",
                bottom: "1rem",
                zIndex: 50,
                background: "rgba(255,255,255,0.98)",
                boxShadow:
                    "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
                borderRadius: "0.75rem",
                padding: "1rem",
                width: "18rem",
                color: "#1f2937",
                fontFamily:
                    "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
            }}
        >
            <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                Keyboard Shortcuts
            </div>
            <ul style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
                <li>1–4: Select an answer</li>
                <li>Arrow keys: Move focus between answers</li>
                <li>Enter/Space: Confirm focused answer</li>
                <li>Spacebar: {isPaused ? "Resume" : "Pause"} quiz</li>
                <li>R: Restart on results screen</li>
                <li>Esc: Toggle this help</li>
            </ul>
        </div>
    ) : null;
}
