import { v4 as uuid } from 'uuid';
import type {
  AffindaMatchDetailKey,
  AffindaMatchResponse,
  AffindaSearchDetailResponse,
  AffindaSearchScoreComponent,
  JobMatchCategory,
  MatchCriterion,
  MatchEducationDetail,
  MatchExperienceDetail,
  MatchKeywordsDetail,
  MatchResult,
  MatchSkillsDetail,
} from '../../src/types/jobMatch.types';

/** Criteria rendered in their own dedicated card rather than the generic criteria list. */
const DEDICATED_KEYS = new Set<AffindaMatchDetailKey>(['skills', 'experience', 'education', 'searchExpression']);

const CRITERION_ORDER: AffindaMatchDetailKey[] = [
  'jobTitle',
  'occupationGroup',
  'managementLevel',
  'location',
  'languages',
];

/** Affinda scores are 0–1; the UI works in whole percentages. */
function toPercent(score: number | null | undefined): number | null {
  if (typeof score !== 'number' || Number.isNaN(score)) return null;
  return Math.round(Math.min(Math.max(score, 0), 1) * 100);
}

function cleanValue(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function getMatchCategory(score: number): JobMatchCategory {
  if (score >= 80) return 'strong';
  if (score >= 60) return 'good';
  if (score >= 40) return 'partial';
  return 'low';
}

function dedupe(values: Array<string | undefined | null>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const trimmed = value?.trim();
    if (!trimmed || seen.has(trimmed.toLowerCase())) continue;
    seen.add(trimmed.toLowerCase());
    result.push(trimmed);
  }
  return result;
}

function toCriterion(
  key: AffindaMatchDetailKey,
  component: AffindaSearchScoreComponent | undefined,
): MatchCriterion | null {
  if (!component) return null;
  const value = cleanValue(component.value);
  const score = toPercent(component.score);
  // Nothing to show if Affinda returned neither a value nor a score for this criterion.
  if (value === null && score === null) return null;
  return { key, label: component.label, value, score };
}

function buildSkills(
  component: AffindaSearchScoreComponent | undefined,
  detail: AffindaSearchDetailResponse | null,
): MatchSkillsDetail | null {
  const matched = dedupe((detail?.skills?.value ?? []).filter((s) => s.match).map((s) => s.name));
  const missing = dedupe((detail?.skills?.missing ?? []).map((s) => s.name));
  const value = cleanValue(component?.value);
  const score = toPercent(component?.score);

  if (matched.length === 0 && missing.length === 0 && value === null && score === null) return null;

  return { label: component?.label ?? 'Skills', value, score, matched, missing };
}

function buildExperience(
  component: AffindaSearchScoreComponent | undefined,
  detail: AffindaSearchDetailResponse | null,
): MatchExperienceDetail | null {
  const years = typeof detail?.experience?.years === 'number' ? detail.experience.years : null;
  const meetsRequirement =
    typeof detail?.experience?.match === 'boolean' ? detail.experience.match : null;
  const value = cleanValue(component?.value);
  const score = toPercent(component?.score);

  if (years === null && meetsRequirement === null && value === null && score === null) return null;

  return { label: component?.label ?? 'Experience', value, score, years, meetsRequirement };
}

function buildEducation(
  component: AffindaSearchScoreComponent | undefined,
  detail: AffindaSearchDetailResponse | null,
): MatchEducationDetail | null {
  const matched = dedupe(
    (detail?.education?.value ?? [])
      .filter((e) => e.match)
      .map((e) => {
        const accreditation = e.accreditation?.education?.trim();
        const organization = e.organization?.trim();
        return [accreditation, organization].filter(Boolean).join(' — ');
      }),
  );

  const missingEducation = detail?.education?.missing;
  const missing = dedupe([
    ...(missingEducation?.degrees ?? []),
    ...(missingEducation?.highestDegreeTypes ?? []),
    ...(missingEducation?.institutions ?? []),
  ]);

  const value = cleanValue(component?.value);
  const score = toPercent(component?.score);

  if (matched.length === 0 && missing.length === 0 && value === null && score === null) return null;

  return { label: component?.label ?? 'Education', value, score, matched, missing };
}

function buildKeywords(
  component: AffindaSearchScoreComponent | undefined,
  detail: AffindaSearchDetailResponse | null,
): MatchKeywordsDetail | null {
  const matched = dedupe(detail?.searchExpression?.value ?? []);
  const missing = dedupe(detail?.searchExpression?.missing ?? []);
  if (matched.length === 0 && missing.length === 0) return null;

  return {
    label: component?.label ?? 'Keywords',
    score: toPercent(component?.score),
    matched,
    missing,
  };
}

interface MapArgs {
  fileName: string;
  match: AffindaMatchResponse;
  detail: AffindaSearchDetailResponse | null;
}

/**
 * Maps Affinda's raw match (plus the optional detail breakdown) onto the frontend model.
 * Anything Affinda did not return stays null/empty so the UI can hide that section —
 * nothing here is inferred or filled in on the candidate's behalf.
 */
export function mapMatchResult({ fileName, match, detail }: MapArgs): MatchResult {
  const details = match.details ?? {};
  const score = toPercent(match.score) ?? 0;

  const criteria = CRITERION_ORDER.map((key) => toCriterion(key, details[key])).filter(
    (criterion): criterion is MatchCriterion => criterion !== null,
  );

  // Org-specific custom criteria come back keyed by data-point slug.
  for (const [key, component] of Object.entries(details.customData ?? {})) {
    const value = cleanValue(component?.value);
    const criterionScore = toPercent(component?.score);
    if (value === null && criterionScore === null) continue;
    criteria.push({
      key: key as AffindaMatchDetailKey,
      label: component.label ?? key,
      value,
      score: criterionScore,
    });
  }

  // Any criterion Affinda adds in future that we don't explicitly place still gets shown.
  for (const [key, component] of Object.entries(details)) {
    const typedKey = key as AffindaMatchDetailKey;
    if (key === 'customData' || DEDICATED_KEYS.has(typedKey) || CRITERION_ORDER.includes(typedKey)) continue;
    const criterion = toCriterion(typedKey, component as AffindaSearchScoreComponent);
    if (criterion) criteria.push(criterion);
  }

  return {
    id: uuid(),
    matchedAt: new Date().toISOString(),
    fileName,
    score,
    category: getMatchCategory(score),
    skills: buildSkills(details.skills, detail),
    experience: buildExperience(details.experience, detail),
    education: buildEducation(details.education, detail),
    keywords: buildKeywords(details.searchExpression, detail),
    criteria,
    detailsAvailable: detail !== null,
  };
}
