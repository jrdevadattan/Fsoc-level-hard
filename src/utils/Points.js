export const DIFFICULTY_POINTS = {
  easy: 30,
  medium: 60,
  hard: 120,
};

export function pointsForDifficulty(diff) {
  const key = String(diff || '').toLowerCase();
  return DIFFICULTY_POINTS[key] ?? 0;
}

export function computeBasePoints(questions = [], userAnswers = []) {
  // userAnswers is array of objects with { questionIndex, isCorrect }
  let total = 0;
  for (const ans of userAnswers) {
    if (!ans || !ans.isCorrect) continue;
    const q = questions[ans.questionIndex];
    if (!q) continue;
    total += pointsForDifficulty(q.difficulty);
  }
  return total;
}

export function applyBonus(basePoints, reward) {
  // reward: { type: 'points'|'multiplier'|'none'|'extraSpin'|'hint'|'time', value:number }
  if (!reward) return { finalPoints: basePoints, applied: { type: 'none', value: 0 } };
  let additive = 0;
  let multiplier = 1;
  if (reward.type === 'points') additive = reward.value || 0;
  if (reward.type === 'multiplier') multiplier = reward.value || 1;
  const finalPoints = Math.round((basePoints + additive) * multiplier);
  return { finalPoints, applied: reward };
}