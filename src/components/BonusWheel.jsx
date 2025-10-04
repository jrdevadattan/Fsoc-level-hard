import { useEffect, useMemo, useRef, useState } from 'react';

// Lightweight, frontend-only spin wheel with weighted rewards
// Props: onComplete(reward), onSkip()
const BonusWheel = ({ open = false, onComplete, onSkip }) => {
  const segments = useMemo(() => [
    { id: 'p50', label: '+50', type: 'points', value: 50, color: '#7C3AED', probability: 0.22 },
    { id: 'p75', label: '+75', type: 'points', value: 75, color: '#EF4444', probability: 0.15 },
    { id: 'p150', label: '+150', type: 'points', value: 150, color: '#3B82F6', probability: 0.08 },
    { id: 'm1_5', label: 'x1.5', type: 'multiplier', value: 1.5, color: '#22C55E', probability: 0.10 },
    { id: 'm2', label: 'x2', type: 'multiplier', value: 2, color: '#F59E0B', probability: 0.05 },
    { id: 'hint', label: 'Hint', type: 'hint', value: 1, color: '#10B981', probability: 0.12 },
    { id: 'extra', label: 'Extra Spin', type: 'extraSpin', value: 1, color: '#8B5CF6', probability: 0.05 },
    { id: 'none', label: '+0', type: 'none', value: 0, color: '#64748B', probability: 0.23 },
  ], []);

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [resultIndex, setResultIndex] = useState(null);
  const [extraSpin, setExtraSpin] = useState(false);

  const wheelRef = useRef(null);

  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;
    const handle = () => {
      setSpinning(false);
      if (resultIndex == null) return;
      const reward = segments[resultIndex];
      if (reward?.type === 'extraSpin' && !extraSpin) {
        // allow a single extra spin
        setExtraSpin(true);
      } else if (typeof onComplete === 'function') {
        onComplete(reward);
      }
    };
    el.addEventListener('transitionend', handle);
    return () => el.removeEventListener('transitionend', handle);
  }, [resultIndex, segments, onComplete, extraSpin]);

  const pickWeightedIndex = () => {
    const total = segments.reduce((s, seg) => s + (seg.probability || 0), 0);
    let r = Math.random() * total;
    for (let i = 0; i < segments.length; i++) {
      const p = segments[i].probability || 0;
      if (r < p) return i;
      r -= p;
    }
    return segments.length - 1;
  };

  const spin = () => {
    if (spinning) return;
    const index = pickWeightedIndex();
    setResultIndex(index);
    setSpinning(true);
    const segAngle = 360 / segments.length;
    // We want the chosen segment's center to land at the top (pointer at 0deg)
    const targetFromTop = (index + 0.5) * segAngle; // center of segment
    const baseSpins = 5; // full turns for aesthetics
    const final = baseSpins * 360 + (360 - targetFromTop);
    setRotation(final);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative w-full max-w-lg mx-auto bg-[rgb(var(--card-bg))] rounded-2xl shadow-2xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="text-2xl">✨</div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Bonus Spin Wheel</h2>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>One spin per quiz completion</p>

        <div className="relative w-72 h-72 mx-auto mb-5 select-none">
          {/* Pointer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent" style={{ borderBottomColor: '#FBBF24' }} />
          </div>

          {/* Wheel */}
          <div ref={wheelRef} className="absolute inset-0 rounded-full border-4" style={{
            borderColor: 'rgba(0,0,0,0.08)',
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 3.2s cubic-bezier(0.12, 0.56, 0.04, 1)' : 'none',
          }}>
            {segments.map((seg, i) => {
              const segAngle = 360 / segments.length;
              const rotate = i * segAngle;
              return (
                <div key={seg.id} className="absolute top-1/2 left-1/2 origin-top-left" style={{
                  width: '50%',
                  height: '50%',
                  transform: `rotate(${rotate}deg) skewY(${90 - segAngle}deg)`,
                }}>
                  <div className="absolute inset-0" style={{ background: seg.color, transform: 'skewY(-' + (90 - segAngle) + 'deg) rotate(' + (segAngle/2) + 'deg)' }} />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `skewY(-${90 - segAngle}deg) rotate(${segAngle/2}deg)` }}>
                    <span className="text-white text-sm font-bold drop-shadow" style={{ transform: 'rotate(0deg)' }}>{seg.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center cap */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shadow" style={{ background: '#111827', color: 'white' }}>★</div>
          </div>
        </div>

        <div className="space-y-2">
          <button onClick={spin} disabled={spinning} className={`w-full py-3 rounded-lg text-white font-semibold transition-transform ${spinning ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'} bg-gradient-to-r from-purple-600 to-blue-600`}>
            {spinning ? 'Spinning...' : 'Spin the Wheel!'}
          </button>
          <button onClick={onSkip} className="w-full py-2 rounded-lg font-medium" style={{ color: 'var(--muted)', background: 'transparent', border: '1px solid rgba(0,0,0,0.1)' }}>
            Skip
          </button>
          {extraSpin && (
            <div className="text-sm" style={{ color: 'var(--muted)' }}>You got an extra spin! Press Spin again.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BonusWheel;