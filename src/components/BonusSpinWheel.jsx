"use client";

import { useState } from "react";

const BonusSpinWheel = ({ isOpen, onClose, onRewardWon, quizScore }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonReward, setWonReward] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  const rewards = [
    { id: 1, label: "+50", points: 50, color: "bg-purple-500", probability: 0.3 },
    { id: 2, label: "+150", points: 150, color: "bg-blue-500", probability: 0.25 },
    { id: 3, label: "+15", points: 15, color: "bg-red-500", probability: 0.2 },
    { id: 4, label: "+75", points: 75, color: "bg-yellow-500", probability: 0.15 },
    { id: 5, label: "+200", points: 200, color: "bg-green-500", probability: 0.08 },
    { id: 6, label: "2x", points: quizScore, color: "bg-pink-500", probability: 0.02, isMultiplier: true },
  ];

  const segmentAngle = 360 / rewards.length;

  const selectReward = () => {
    const random = Math.random();
    let cumulativeProbability = 0;
    for (const reward of rewards) {
      cumulativeProbability += reward.probability;
      if (random <= cumulativeProbability) return reward;
    }
    return rewards[0];
  };

  const spinWheel = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    setHasSpun(true);

    const selectedReward = selectReward();
    const rewardIndex = rewards.findIndex(r => r.id === selectedReward.id);

    const baseRotation = 360 * 5;
    const rewardAngle = rewardIndex * segmentAngle;
    const offset = segmentAngle / 2;
    const finalRotation = baseRotation + (360 - rewardAngle - offset);

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWonReward(selectedReward);
      setShowCelebration(true);
      if (onRewardWon) onRewardWon(selectedReward);
    }, 4000);
  };

  const handleClose = () => {
    if (!isSpinning) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl max-w-2xl w-full relative animate-scale-in overflow-y-auto"
        style={{ maxHeight: "95vh" }}
      >
        <div className="p-8">
          {/* Close button */}
          <button
            onClick={handleClose}
            disabled={isSpinning}
            className={`absolute top-4 right-4 text-gray-400 hover:text-white transition-colors ${
              isSpinning ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4 animate-bounce">✨</div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
              Bonus Spin Wheel!
            </h2>
            <p className="text-gray-400 text-lg">Spin the wheel for bonus rewards!</p>
          </div>

          {/* Wheel */}
          <div className="relative flex items-center justify-center mb-8">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-yellow-400 drop-shadow-lg" />
            </div>

            <div className="relative w-80 h-80">
              <div
                className="w-full h-full rounded-full relative overflow-hidden shadow-2xl transition-transform duration-[4000ms] ease-out border-8 border-gray-700"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {rewards.map((reward, index) => {
                  const angle = index * segmentAngle;
                  return (
                    <div
                      key={reward.id}
                      className={`absolute w-full h-full ${reward.color}`}
                      style={{
                        clipPath: `polygon(50% 50%, 
                          ${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}% 
                          ${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%, 
                          ${50 + 50 * Math.cos((angle + segmentAngle - 90) * Math.PI / 180)}% 
                          ${50 + 50 * Math.sin((angle + segmentAngle - 90) * Math.PI / 180)}%)`,
                      }}
                    >
                      <div
                        className="absolute top-1/2 left-1/2 text-white font-bold text-2xl drop-shadow-lg"
                        style={{
                          transform: `translate(-50%, -50%) rotate(${angle + segmentAngle / 2}deg) translateY(-80px)`,
                        }}
                      >
                        {reward.isMultiplier && <div className="text-sm">Score</div>}
                        {reward.label}
                      </div>
                    </div>
                  );
                })}

                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-900 rounded-full border-4 border-yellow-400 flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
              </div>

              {/* Outer ring decoration */}
              <div className="absolute inset-0 rounded-full border-4 border-gray-600 pointer-events-none" />
            </div>

            {/* Celebration particles */}
            {showCelebration && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3"
                    style={{
                      left: "50%",
                      top: "50%",
                      animation: `particle-${i % 4} 1s ease-out forwards`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  >
                    {["✨", "🎉", "⭐", "💫"][i % 4]}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Result */}
          {wonReward && (
            <div className="text-center mb-6 animate-scale-in">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 shadow-lg">
                <p className="text-white text-xl mb-2">🎊 You Won! 🎊</p>
                <p className="text-white text-4xl font-bold">
                  {wonReward.isMultiplier
                    ? `${wonReward.label} Score Bonus!`
                    : `${wonReward.label} Points!`}
                </p>
                <p className="text-purple-200 text-sm mt-2">
                  {wonReward.isMultiplier
                    ? `Your score has been doubled!`
                    : `+${wonReward.points} bonus points added to your score!`}
                </p>
              </div>
            </div>
          )}

          {/* Spin button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning || hasSpun}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
              isSpinning || hasSpun
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 shadow-lg"
            } text-white`}
          >
            <span className="text-2xl">✨</span>
            <span>{isSpinning ? "Spinning..." : hasSpun ? "Spin Complete!" : "Spin the Wheel!"}</span>
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            {hasSpun ? "Close this to continue" : "One spin per quiz completion"}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes particle-0 {
          to { transform: translate(60px, -80px); opacity: 0; }
        }
        @keyframes particle-1 {
          to { transform: translate(-60px, -80px); opacity: 0; }
        }
        @keyframes particle-2 {
          to { transform: translate(80px, 60px); opacity: 0; }
        }
        @keyframes particle-3 {
          to { transform: translate(-80px, 60px); opacity: 0; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default BonusSpinWheel;
