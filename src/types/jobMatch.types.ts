/**
 * Types for the Job Description Matcher module.
 *
 * Split in two layers:
 *  1. `Affinda*` — raw wire types mirroring the Affinda Search & Match API responses.
 *     These are only ever consumed by the backend mapper; the UI never sees them.
 *  2. `MatchResult` and friends — the clean, frontend-facing model the backend returns.
 *     Every field here is derived from something Affinda actually sent back; anything the
 *     API omits stays `null`/empty so the UI can hide the corresponding section.
 */

/* ------------------------------------------------------------------ *
 * Raw Affinda wire types
 * ------------------------------------------------------------------ */

/** One scored criterion in `GET /v3/resume_search/match` → `details.*`. */
export interface AffindaSearchScoreComponent {
  label: string;
  value?: string | null;
  /** 0–1, or null when Affinda could not score this criterion. */
  score?: number | null;
}

export type AffindaMatchDetailKey =
  | 'jobTitle'
  | 'managementLevel'
  | 'experience'
  | 'skills'
  | 'languages'
  | 'location'
  | 'education'
  | 'occupationGroup'
  | 'searchExpression';

export interface AffindaMatchDetails
  extends Partial<Record<AffindaMatchDetailKey, AffindaSearchScoreComponent>> {
  /** Org-defined extra criteria, keyed by data-point slug. Empty for most accounts. */
  customData?: Record<string, AffindaSearchScoreComponent>;
}

/** Response body of `GET /v3/resume_search/match`. */
export interface AffindaMatchResponse {
  /** Overall match, 0–1 (0 = no match, 1 = perfect match). */
  score?: number | null;
  details?: AffindaMatchDetails;
}

/** A skill/language as returned inside a search detail `value` array. */
export interface AffindaSearchDetailSkill {
  name?: string;
  match?: boolean;
}

/** A skill/language as returned inside a search detail `missing` array. */
export interface AffindaSearchParameterSkill {
  name?: string;
  required?: boolean;
}

export interface AffindaSearchDetailJobTitleValueItem {
  name?: string;
  companyName?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  match?: boolean;
}

export interface AffindaSearchDetailEducationValueItem {
  organization?: string;
  accreditation?: { education?: string; educationLevel?: string };
  match?: boolean;
}

export interface AffindaSearchDetailEducationMissing {
  degrees?: string[];
  highestDegreeTypes?: string[];
  institutions?: string[];
  currentStudent?: boolean;
  recentGraduate?: boolean;
}

/**
 * Response body of `POST /v3/resume_search/details/{identifier}`.
 * Optional enrichment — it is the only Affinda endpoint that reports which criteria are
 * *missing* from a resume, but it requires the resume to live in a search index.
 */
export interface AffindaSearchDetailResponse {
  jobTitle?: { missing?: string[]; value?: AffindaSearchDetailJobTitleValueItem[] };
  skills?: { missing?: AffindaSearchParameterSkill[]; value?: AffindaSearchDetailSkill[] };
  languages?: { missing?: AffindaSearchParameterSkill[]; value?: AffindaSearchDetailSkill[] };
  education?: {
    missing?: AffindaSearchDetailEducationMissing;
    value?: AffindaSearchDetailEducationValueItem[];
  };
  experience?: { years?: number; match?: boolean };
  managementLevel?: { level?: string; match?: boolean };
  occupationGroup?: { missing?: number[]; value?: Array<{ code?: number; name?: string; match?: boolean }> };
  searchExpression?: { missing?: string[]; value?: string[] };
}

/* ------------------------------------------------------------------ *
 * Frontend-facing model
 * ------------------------------------------------------------------ */

export type JobMatchCategory = 'strong' | 'good' | 'partial' | 'low';

/** A single Affinda criterion, normalised to a 0–100 score for display. */
export interface MatchCriterion {
  key: AffindaMatchDetailKey;
  label: string;
  value: string | null;
  /** 0–100, or null when Affinda returned no score for this criterion. */
  score: number | null;
}

export interface MatchSkillsDetail {
  label: string;
  value: string | null;
  score: number | null;
  /** Populated only when the search-detail enrichment ran. */
  matched: string[];
  missing: string[];
}

export interface MatchExperienceDetail {
  label: string;
  value: string | null;
  score: number | null;
  years: number | null;
  meetsRequirement: boolean | null;
}

export interface MatchEducationDetail {
  label: string;
  value: string | null;
  score: number | null;
  matched: string[];
  missing: string[];
}

export interface MatchKeywordsDetail {
  label: string;
  score: number | null;
  matched: string[];
  missing: string[];
}

/** The processed match, ready to render. */
export interface MatchResult {
  id: string;
  matchedAt: string;
  fileName: string;
  /** Overall match as a percentage (Affinda's 0–1 score × 100, rounded). */
  score: number;
  category: JobMatchCategory;
  skills: MatchSkillsDetail | null;
  experience: MatchExperienceDetail | null;
  education: MatchEducationDetail | null;
  keywords: MatchKeywordsDetail | null;
  /** Everything else Affinda scored — job title, location, languages, and so on. */
  criteria: MatchCriterion[];
  /**
   * True when the `/resume_search/details` enrichment succeeded, meaning matched/missing
   * breakdowns are trustworthy. False means only aggregate criterion scores are available.
   */
  detailsAvailable: boolean;
}

export interface JobDescriptionMatcherRequest {
  resume: File;
  jobDescription: string;
}

export interface JobDescriptionMatcherResponse {
  success: boolean;
  data: MatchResult;
}
