export type ComparisonWinner = 'A' | 'B' | 'tie';

/** Determines the winner of a numeric metric where a higher value is better (e.g. ATS score). */
export function compareHigherWins(a: number, b: number): ComparisonWinner {
  if (a === b) return 'tie';
  return a > b ? 'A' : 'B';
}

/** Determines the winner of a numeric metric where a lower value is better (e.g. missing skills count). */
export function compareLowerWins(a: number, b: number): ComparisonWinner {
  if (a === b) return 'tie';
  return a < b ? 'A' : 'B';
}

/** Determines the winner between two lists by item count. */
export function compareByCount(a: unknown[], b: unknown[], fewerIsBetter = false): ComparisonWinner {
  return fewerIsBetter ? compareLowerWins(a.length, b.length) : compareHigherWins(a.length, b.length);
}
