import { v4 as uuid } from 'uuid';
import type { MatchResult } from '@/types/jobMatch.types';
import { getMatchCategory } from '@/utils/jobMatchHelpers';

/**
 * Mock match used when USE_MOCK_API is on, so the matcher UI can be developed without
 * spending Affinda credits. Shape mirrors what the backend mapper produces.
 */
export function generateMockJobMatch(fileName: string): MatchResult {
  const score = 82;

  return {
    id: uuid(),
    matchedAt: new Date().toISOString(),
    fileName,
    score,
    category: getMatchCategory(score),
    skills: {
      label: 'Skills',
      value: 'React, TypeScript, Node.js, GraphQL',
      score: 78,
      matched: ['React', 'TypeScript', 'JavaScript', 'GraphQL', 'REST APIs', 'Git'],
      missing: ['Next.js', 'AWS', 'CI/CD'],
    },
    experience: {
      label: 'Experience',
      value: '6 years',
      score: 88,
      years: 6,
      meetsRequirement: true,
    },
    education: {
      label: 'Education',
      value: 'Bachelor of Engineering',
      score: 90,
      matched: ['Bachelor of Engineering — Pune University'],
      missing: [],
    },
    keywords: {
      label: 'Search expression',
      score: 65,
      matched: ['design system', 'accessibility'],
      missing: ['server-side rendering'],
    },
    criteria: [
      { key: 'jobTitle', label: 'Job title', value: 'Senior Frontend Engineer', score: 84 },
      { key: 'occupationGroup', label: 'Occupation group', value: 'Web design and development professionals', score: 80 },
      { key: 'managementLevel', label: 'Management level', value: 'Mid', score: null },
      { key: 'location', label: 'Location', value: 'Bengaluru, Karnataka, India', score: 100 },
      { key: 'languages', label: 'Languages', value: 'English', score: 97 },
    ],
    detailsAvailable: true,
  };
}
