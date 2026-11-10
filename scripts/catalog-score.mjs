// Scores are optional editorial hypotheses, not measured search metrics.
// Newly researched sparse topics must not fabricate a score to make a build pass.
export const hasTopicScore = score =>
  typeof score === 'number' && Number.isFinite(score) && score >= 0 && score <= 10;
export const formatTopicScore = score =>
  hasTopicScore(score) ? score.toFixed(1) : 'Not scored';
export function compareTopicScore(a,b) {
  const aKnown=hasTopicScore(a.score), bKnown=hasTopicScore(b.score);
  if (aKnown && bKnown) return b.score-a.score || a.rank-b.rank;
  if (aKnown) return -1;
  if (bKnown) return 1;
  return a.rank-b.rank;
}
