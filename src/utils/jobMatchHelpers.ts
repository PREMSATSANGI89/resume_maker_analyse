import type { JobMatchCategory } from '@/types/jobMatch.types';

interface MatchCategoryMeta {
  /** Short label shown next to the score. */
  label: string;
  /** Recommendation headline. */
  title: string;
  /** Recommendation body — what the score means for this resume. */
  detail: string;
  color: 'success' | 'warning' | 'error';
  /** Inclusive lower bound of the band, used for the legend. */
  min: number;
  max: number;
}

/**
 * Score bands for the matcher. Deliberately separate from the analyzer's `getScoreLabel`
 * because a job-fit score and a resume-quality score mean different things.
 */
export const MATCH_CATEGORY_META: Record<JobMatchCategory, MatchCategoryMeta> = {
  strong: {
    label: 'Strong Match',
    title: 'Strong Match',
    detail: 'This resume aligns well with the job description.',
    color: 'success',
    min: 80,
    max: 100,
  },
  good: {
    label: 'Good Match',
    title: 'Good Match',
    detail: 'The resume matches most of the job requirements, but some improvements may be useful.',
    color: 'success',
    min: 60,
    max: 79,
  },
  partial: {
    label: 'Partial Match',
    title: 'Partial Match',
    detail: 'Several important requirements are missing from the resume.',
    color: 'warning',
    min: 40,
    max: 59,
  },
  low: {
    label: 'Low Match',
    title: 'Low Match',
    detail: 'The resume has limited alignment with the job description.',
    color: 'error',
    min: 0,
    max: 39,
  },
};

/** Mirrors the backend banding so the UI can categorise a score without a round trip. */
export function getMatchCategory(score: number): JobMatchCategory {
  if (score >= 80) return 'strong';
  if (score >= 60) return 'good';
  if (score >= 40) return 'partial';
  return 'low';
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}
