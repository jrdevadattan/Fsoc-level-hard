import confetti from "canvas-confetti";

class CelebrationManager {
    static animationSettings = {
        enableAnimations: true,
        enableSound: false,
        respectReducedMotion: true,
    };

    static init() {
        this.loadSettings();
        this.setupReducedMotionListener();
    }

    static loadSettings() {
        try {
            const saved = localStorage.getItem("celebrationSettings");
            if (saved) {
                this.animationSettings = {
                    ...this.animationSettings,
                    ...JSON.parse(saved),
                };
            }
        } catch (error) {
            console.error("Failed to load celebration settings:", error);
        }
    }

    static saveSettings() {
        try {
            localStorage.setItem(
                "celebrationSettings",
                JSON.stringify(this.animationSettings),
            );
        } catch (error) {
            console.error("Failed to save celebration settings:", error);
        }
    }

    static setupReducedMotionListener() {
        if (typeof window !== "undefined" && window.matchMedia) {
            const mediaQuery = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            );
            const handleChange = (e) => {
                if (this.animationSettings.respectReducedMotion) {
                    this.animationSettings.enableAnimations = !e.matches;
                }
            };
            mediaQuery.addEventListener("change", handleChange);
            handleChange(mediaQuery);
        }
    }

    static shouldAnimate() {
        return this.animationSettings.enableAnimations;
    }

    static triggerConfetti(type = "default", options = {}) {
        if (!this.shouldAnimate()) return;

        const defaults = {
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: [
                "#FFD700",
                "#FF6B6B",
                "#4ECDC4",
                "#45B7D1",
                "#96CEB4",
                "#FFEAA7",
            ],
        };

        const configs = {
            default: defaults,
            perfect: {
                ...defaults,
                particleCount: 150,
                spread: 120,
                colors: ["#FFD700", "#FFA500", "#FF4500", "#FFB347"],
                shapes: ["star"],
                scalar: 1.2,
            },
            achievement: {
                ...defaults,
                particleCount: 80,
                spread: 60,
                colors: ["#9B59B6", "#E74C3C", "#3498DB", "#2ECC71"],
                origin: { y: 0.7 },
            },
            levelUp: {
                ...defaults,
                particleCount: 120,
                spread: 90,
                colors: ["#F39C12", "#E67E22", "#D35400"],
                gravity: 0.8,
            },
            streak: {
                ...defaults,
                particleCount: 60,
                spread: 45,
                colors: ["#E74C3C", "#C0392B", "#A93226"],
                origin: { x: 0.1, y: 0.8 },
            },
        };

        const config = { ...configs[type], ...options };
        confetti(config);

        if (type === "perfect") {
            setTimeout(() => confetti(config), 300);
            setTimeout(() => confetti(config), 600);
        }
    }

    static triggerFireworks(duration = 5000) {
        if (!this.shouldAnimate()) return;

        const end = Date.now() + duration;
        const colors = [
            "#FF6B6B",
            "#4ECDC4",
            "#45B7D1",
            "#FFD700",
            "#96CEB4",
            "#E74C3C",
            "#9B59B6",
        ];

        const frame = () => {
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.8 },
                colors: colors,
                shapes: ["star", "circle"],
                scalar: 1.2,
                gravity: 0.8,
                drift: 0.2,
            });
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.8 },
                colors: colors,
                shapes: ["star", "circle"],
                scalar: 1.2,
                gravity: 0.8,
                drift: -0.2,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();

        const centerBurst = () => {
            confetti({
                particleCount: 80,
                spread: 360,
                origin: { x: 0.5, y: 0.5 },
                colors: colors,
                shapes: ["star"],
                scalar: 2,
                gravity: 0.5,
                decay: 0.95,
            });
        };

        setTimeout(centerBurst, 800);
        setTimeout(centerBurst, 2000);
        setTimeout(centerBurst, 3500);

        const trailBurst = () => {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    confetti({
                        particleCount: 30,
                        angle: 90,
                        spread: 45,
                        origin: { x: 0.2 + i * 0.15, y: 0.3 },
                        colors: colors,
                        shapes: ["circle"],
                        scalar: 1.5,
                        gravity: 1,
                        decay: 0.9,
                    });
                }, i * 200);
            }
        };

        setTimeout(trailBurst, 1500);
    }

    static animateScoreReveal(element, finalScore, duration = 2000) {
        if (!this.shouldAnimate() || !element) return;

        const startTime = Date.now();
        const startScore = 0;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentScore = Math.round(
                startScore + (finalScore - startScore) * easeOutQuart,
            );

            element.textContent = currentScore;

            if (
                currentScore >= 80 &&
                currentScore < 90 &&
                !element.dataset.triggered80
            ) {
                element.dataset.triggered80 = "true";
                element.style.transform = "scale(1.1)";
                element.style.color = "#3498DB";
                setTimeout(() => {
                    element.style.transform = "scale(1)";
                }, 200);
            }

            if (
                currentScore >= 90 &&
                currentScore < 100 &&
                !element.dataset.triggered90
            ) {
                element.dataset.triggered90 = "true";
                element.style.transform = "scale(1.2)";
                element.style.color = "#2ECC71";
                setTimeout(() => {
                    element.style.transform = "scale(1)";
                }, 300);
            }

            if (currentScore === 100 && !element.dataset.triggered100) {
                element.dataset.triggered100 = "true";
                element.style.transform = "scale(1.3)";
                element.style.color = "#FFD700";
                this.triggerConfetti("perfect");
                setTimeout(() => {
                    element.style.transform = "scale(1)";
                }, 400);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        element.style.transition = "transform 0.3s ease, color 0.3s ease";
        animate();
    }

    static celebrateBadge() {
        if (!this.shouldAnimate()) return;

        this.triggerConfetti("achievement");
        this.triggerHapticFeedback("medium");
    }

    static celebrateLevel() {
        if (!this.shouldAnimate()) return;

        this.triggerConfetti("levelUp");

        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 90,
                spread: 45,
                origin: { x: 0.5, y: 0.3 },
                colors: ["#F39C12", "#E67E22"],
                shapes: ["circle"],
                scalar: 0.8,
            });
        }, 500);

        this.triggerHapticFeedback("heavy");
    }

    static celebrateStreak(count) {
        if (!this.shouldAnimate()) return;

        if (count === 5) {
            this.triggerConfetti("streak", { particleCount: 30 });
        } else if (count === 10) {
            this.triggerConfetti("streak", { particleCount: 50 });
        } else if (count >= 25) {
            this.triggerFireworks(3000);
        } else if (count % 5 === 0) {
            this.triggerConfetti("streak");
        }

        this.triggerHapticFeedback("light");
    }

    static createRippleEffect(
        element,
        color = "rgba(255, 255, 255, 0.6)",
        event = null,
    ) {
        if (!this.shouldAnimate() || !element) return;

        const rect = element.getBoundingClientRect();
        const ripple = document.createElement("span");
        const size = Math.max(rect.width, rect.height) * 2;

        let x, y;
        if (event) {
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        } else {
            x = rect.width / 2;
            y = rect.height / 2;
        }

        ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      background: radial-gradient(circle, ${color} 0%, transparent 70%);
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
      z-index: 1000;
    `;

        const rippleContainer =
            element.querySelector(".ripple-container") || element;
        if (getComputedStyle(rippleContainer).position === "static") {
            rippleContainer.style.position = "relative";
        }
        rippleContainer.style.overflow = "hidden";
        rippleContainer.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 800);
    }

    static animateCorrectAnswer(element) {
        if (!this.shouldAnimate() || !element) return;

        element.style.cssText += `
      animation: correctPulse 0.6s ease-out;
      box-shadow: 0 0 20px rgba(46, 204, 113, 0.6);
    `;

        setTimeout(() => {
            element.style.animation = "";
            element.style.boxShadow = "";
        }, 600);
    }

    static animateIncorrectAnswer(element) {
        if (!this.shouldAnimate() || !element) return;

        element.style.cssText += `
      animation: incorrectShake 0.5s ease-in-out;
      box-shadow: 0 0 20px rgba(231, 76, 60, 0.6);
    `;

        setTimeout(() => {
            element.style.animation = "";
            element.style.boxShadow = "";
        }, 500);
    }

    static showToast(message, type = "success", duration = 3000) {
        if (!this.shouldAnimate()) return;

        const toast = document.createElement("div");
        const colors = {
            success: "bg-green-500",
            error: "bg-red-500",
            info: "bg-blue-500",
            warning: "bg-yellow-500",
        };

        toast.className = `
      fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium
      transform translate-x-full transition-transform duration-300 ease-out
      ${colors[type] || colors.success}
    `;
        toast.textContent = message;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.transform = "translateX(0)";
        });

        setTimeout(() => {
            toast.style.transform = "translateX(full)";
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    static triggerHapticFeedback(intensity = "light") {
        if (!this.shouldAnimate()) return;

        if (navigator.vibrate) {
            const patterns = {
                light: [10],
                medium: [20],
                heavy: [30],
                success: [10, 10, 10],
                error: [50, 10, 50],
            };
            navigator.vibrate(patterns[intensity] || patterns.light);
        }
    }

    static addHoverEffect(element, scale = 1.05, options = {}) {
        if (!this.shouldAnimate() || !element) return;

        const {
            shadowColor = "rgba(139, 92, 246, 0.3)",
            duration = "0.3s",
            easing = "cubic-bezier(0.4, 0, 0.2, 1)",
        } = options;

        element.style.transition = `transform ${duration} ${easing}, box-shadow ${duration} ${easing}, filter ${duration} ${easing}`;

        const handleMouseEnter = () => {
            element.style.transform = `scale(${scale}) translateY(-2px)`;
            element.style.boxShadow = `0 8px 25px ${shadowColor}, 0 4px 12px rgba(0, 0, 0, 0.15)`;
            element.style.filter = "brightness(1.05)";
        };

        const handleMouseLeave = () => {
            element.style.transform = "scale(1) translateY(0)";
            element.style.boxShadow = "none";
            element.style.filter = "brightness(1)";
        };

        const handleClick = (e) => {
            this.createRippleEffect(element, "rgba(255, 255, 255, 0.4)", e);
        };

        element.addEventListener("mouseenter", handleMouseEnter);
        element.addEventListener("mouseleave", handleMouseLeave);
        element.addEventListener("click", handleClick);

        element._celebrationCleanup = () => {
            element.removeEventListener("mouseenter", handleMouseEnter);
            element.removeEventListener("mouseleave", handleMouseLeave);
            element.removeEventListener("click", handleClick);
        };
    }

    static bounceElement(element, intensity = "medium") {
        if (!this.shouldAnimate() || !element) return;

        const intensities = {
            light: "bounceLight 0.5s ease",
            medium: "bounceMedium 0.6s ease",
            heavy: "bounceHeavy 0.8s ease",
        };

        element.style.animation = intensities[intensity] || intensities.medium;

        setTimeout(() => {
            element.style.animation = "";
        }, 800);
    }

    static createSparkles(container, count = 5) {
        if (!this.shouldAnimate() || !container) return;

        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement("div");
            sparkle.innerHTML = "✨";
            sparkle.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 20 + 10}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: sparkle ${Math.random() * 2 + 1}s ease-out forwards;
        pointer-events: none;
        z-index: 1000;
      `;

            container.appendChild(sparkle);

            setTimeout(() => {
                sparkle.remove();
            }, 3000);
        }
    }

    static updateSettings(newSettings) {
        this.animationSettings = { ...this.animationSettings, ...newSettings };
        this.saveSettings();
    }

    static getSettings() {
        return { ...this.animationSettings };
    }

    static injectStyles() {
        if (typeof document === "undefined") return;

        const styleId = "celebration-styles";
        if (document.getElementById(styleId)) return;

        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }

      @keyframes correctPulse {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 rgba(46, 204, 113, 0);
        }
        50% {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(46, 204, 113, 0.6);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 0 0 rgba(46, 204, 113, 0);
        }
      }

      @keyframes incorrectShake {
        0%, 100% {
          transform: translateX(0);
          box-shadow: 0 0 0 rgba(231, 76, 60, 0);
        }
        10%, 30%, 50%, 70%, 90% {
          transform: translateX(-8px);
          box-shadow: 0 0 15px rgba(231, 76, 60, 0.5);
        }
        20%, 40%, 60%, 80% {
          transform: translateX(8px);
          box-shadow: 0 0 15px rgba(231, 76, 60, 0.5);
        }
      }

      @keyframes bounceLight {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-10px) scale(1.02); }
      }

      @keyframes bounceMedium {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-20px) scale(1.05); }
      }

      @keyframes bounceHeavy {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-30px) scale(1.1); }
      }

      @keyframes sparkle {
        0% {
          transform: scale(0) rotate(0deg);
          opacity: 1;
        }
        50% {
          transform: scale(1) rotate(180deg);
          opacity: 1;
        }
        100% {
          transform: scale(0) rotate(360deg);
          opacity: 0;
        }
      }

      @keyframes levelUpBurst {
        0% {
          transform: scale(0) rotate(0deg);
          opacity: 1;
          filter: brightness(1);
        }
        50% {
          transform: scale(1.5) rotate(180deg);
          opacity: 0.8;
          filter: brightness(1.5);
        }
        100% {
          transform: scale(3) rotate(360deg);
          opacity: 0;
          filter: brightness(2);
        }
      }

      @keyframes badgeShine {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }

      @keyframes streakPulse {
        0%, 100% {
          transform: scale(1);
          filter: brightness(1);
        }
        50% {
          transform: scale(1.15);
          filter: brightness(1.3);
        }
      }

      @keyframes scoreCountUp {
        0% {
          transform: scale(0.8);
          opacity: 0.5;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      .ripple-container {
        position: relative;
        overflow: hidden;
      }

      .celebration-glow {
        animation: celebrationGlow 2s ease-in-out infinite;
      }

      @keyframes celebrationGlow {
        0%, 100% {
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
        }
        50% {
          box-shadow: 0 0 25px rgba(139, 92, 246, 0.8), 0 0 35px rgba(59, 130, 246, 0.4);
        }
      }

      .badge-shine {
        position: relative;
        overflow: hidden;
      }

      .badge-shine::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        animation: badgeShine 2s ease-in-out;
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;

        document.head.appendChild(style);
    }
}

if (typeof window !== "undefined") {
    CelebrationManager.init();
    CelebrationManager.injectStyles();
}

export default CelebrationManager;
