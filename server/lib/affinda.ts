import type { AffindaMatchResponse, AffindaSearchDetailResponse } from '../../src/types/jobMatch.types';

const AFFINDA_BASE_URL = 'https://api.affinda.com/v3';
const REQUEST_TIMEOUT_MS = 90_000;

export type AffindaErrorKind =
  | 'config'
  | 'auth'
  | 'rate_limit'
  | 'network'
  | 'invalid_document'
  | 'api'
  | 'unexpected';

/**
 * Wraps every Affinda failure with a message that is safe to show a user.
 * The raw provider error is kept in `detail` for server logs only.
 */
export class AffindaError extends Error {
  constructor(
    readonly kind: AffindaErrorKind,
    readonly userMessage: string,
    readonly status: number,
    readonly detail?: string,
  ) {
    super(detail ? `${userMessage} (${detail})` : userMessage);
    this.name = 'AffindaError';
  }
}

function requireApiKey(): string {
  const apiKey = process.env.AFFINDA_API_KEY;
  if (!apiKey) {
    throw new AffindaError(
      'config',
      'Job matching is not configured on the server yet. Please contact your administrator.',
      503,
      'AFFINDA_API_KEY is not set — see .env.example',
    );
  }
  return apiKey;
}

interface AffindaRequestOptions {
  method?: 'GET' | 'POST' | 'DELETE';
  query?: Record<string, string | number | undefined>;
  json?: unknown;
  form?: FormData;
  /** Treat a 404 as "nothing there" rather than an error. */
  allowNotFound?: boolean;
}

/** Single choke point for Affinda calls: auth, timeouts, and error normalisation. */
async function affindaRequest<T>(path: string, options: AffindaRequestOptions = {}): Promise<T | null> {
  const apiKey = requireApiKey();
  const { method = 'GET', query, json, form, allowNotFound } = options;

  const url = new URL(`${AFFINDA_BASE_URL}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
        ...(json ? { 'Content-Type': 'application/json' } : {}),
      },
      body: form ?? (json ? JSON.stringify(json) : undefined),
    });
  } catch (err) {
    const aborted = err instanceof Error && err.name === 'AbortError';
    throw new AffindaError(
      'network',
      aborted
        ? 'The matching service took too long to respond. Please try again.'
        : 'Could not reach the matching service. Please check your connection and try again.',
      504,
      err instanceof Error ? err.message : String(err),
    );
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 404 && allowNotFound) return null;
  if (!response.ok) throw await toAffindaError(response);
  if (response.status === 204) return null;

  try {
    return (await response.json()) as T;
  } catch (err) {
    throw new AffindaError(
      'unexpected',
      'The matching service returned an unreadable response. Please try again.',
      502,
      err instanceof Error ? err.message : String(err),
    );
  }
}

async function toAffindaError(response: Response): Promise<AffindaError> {
  const body = await response.text().catch(() => '');
  const detail = `HTTP ${response.status}: ${body.slice(0, 500)}`;

  if (response.status === 401 || response.status === 403) {
    return new AffindaError(
      'auth',
      'The matching service rejected our credentials. Please contact your administrator.',
      502,
      detail,
    );
  }
  if (response.status === 429) {
    return new AffindaError(
      'rate_limit',
      'Too many match requests right now. Please wait a moment and try again.',
      429,
      detail,
    );
  }
  if (response.status === 400 || response.status === 422) {
    return new AffindaError(
      'invalid_document',
      'The matching service could not process this resume or job description. Try a different file.',
      422,
      detail,
    );
  }
  return new AffindaError(
    'api',
    'The matching service is currently unavailable. Please try again shortly.',
    502,
    detail,
  );
}

/* ------------------------------------------------------------------ *
 * Collection / index resolution
 * ------------------------------------------------------------------ */

interface AffindaCollection {
  identifier: string;
  name?: string;
  extractor?: { identifier?: string; name?: string; baseExtractor?: { identifier?: string; name?: string } };
}

interface AffindaWorkspace {
  identifier: string;
  name?: string;
}

interface AffindaOrganization {
  identifier?: string;
  name?: string;
}

interface AffindaIndex {
  name: string;
  docType?: string;
}

export interface AffindaTargets {
  resumeCollection: string;
  jobDescriptionCollection: string;
  /** Search index holding resumes — enables the richer matched/missing breakdown. */
  resumeIndex: string | null;
}

let cachedTargets: AffindaTargets | null = null;

function extractorMatches(collection: AffindaCollection, ...needles: string[]): boolean {
  const haystack = [
    collection.extractor?.baseExtractor?.identifier,
    collection.extractor?.baseExtractor?.name,
    collection.extractor?.identifier,
    collection.extractor?.name,
    collection.name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return needles.some((needle) => haystack.includes(needle));
}

/**
 * Affinda matches *documents*, so a resume and a job description each need to be uploaded
 * into a collection first. Collection identifiers are org-specific, so they can be pinned
 * via env vars; otherwise we discover them once and cache the result for the process.
 */
export async function resolveTargets(): Promise<AffindaTargets> {
  if (cachedTargets) return cachedTargets;

  const envResume = process.env.AFFINDA_RESUME_COLLECTION;
  const envJobDescription = process.env.AFFINDA_JOB_DESCRIPTION_COLLECTION;
  const envIndex = process.env.AFFINDA_RESUME_INDEX ?? null;

  if (envResume && envJobDescription) {
    cachedTargets = {
      resumeCollection: envResume,
      jobDescriptionCollection: envJobDescription,
      resumeIndex: envIndex,
    };
    return cachedTargets;
  }

  const collections = await discoverCollections();
  const resumeCollection =
    envResume ?? collections.find((c) => extractorMatches(c, 'resume'))?.identifier;
  const jobDescriptionCollection =
    envJobDescription ??
    collections.find((c) => extractorMatches(c, 'job-description', 'job description', 'job_description'))
      ?.identifier;

  if (!resumeCollection || !jobDescriptionCollection) {
    throw new AffindaError(
      'config',
      'Job matching is not fully configured — the matching service has no resume or job-description collection set up.',
      503,
      `Discovered ${collections.length} collection(s); resume=${resumeCollection ?? 'none'}, jobDescription=${jobDescriptionCollection ?? 'none'}. Set AFFINDA_RESUME_COLLECTION and AFFINDA_JOB_DESCRIPTION_COLLECTION.`,
    );
  }

  cachedTargets = {
    resumeCollection,
    jobDescriptionCollection,
    resumeIndex: envIndex ?? (await discoverResumeIndex()),
  };
  return cachedTargets;
}

async function discoverCollections(): Promise<AffindaCollection[]> {
  const workspaceIds = process.env.AFFINDA_WORKSPACE
    ? [process.env.AFFINDA_WORKSPACE]
    : await discoverWorkspaceIds();

  const collections: AffindaCollection[] = [];
  for (const workspace of workspaceIds) {
    const result = await affindaRequest<AffindaCollection[]>('/collections', { query: { workspace } });
    if (result) collections.push(...result);
  }
  return collections;
}

async function discoverWorkspaceIds(): Promise<string[]> {
  const organizations = (await affindaRequest<AffindaOrganization[]>('/organizations')) ?? [];
  const workspaces: string[] = [];
  for (const organization of organizations) {
    if (!organization.identifier) continue;
    const result = await affindaRequest<AffindaWorkspace[]>('/workspaces', {
      query: { organization: organization.identifier },
    });
    workspaces.push(...(result ?? []).map((w) => w.identifier).filter(Boolean));
  }
  return workspaces;
}

/** Best-effort: the resume search index is optional, and absence is not an error. */
async function discoverResumeIndex(): Promise<string | null> {
  try {
    const page = await affindaRequest<{ results?: AffindaIndex[] }>('/index', { query: { limit: 100 } });
    const resumeIndex = (page?.results ?? []).find((index) => index.docType === 'resumes');
    return resumeIndex?.name ?? null;
  } catch {
    return null;
  }
}

/** Clears the cached discovery result — used by tests and after a configuration change. */
export function resetTargetsCache(): void {
  cachedTargets = null;
}

/* ------------------------------------------------------------------ *
 * Documents
 * ------------------------------------------------------------------ */

interface AffindaDocumentResponse {
  meta?: { identifier?: string; ready?: boolean; failed?: boolean };
  error?: { errorCode?: string; errorDetail?: string } | null;
}

interface UploadArgs {
  collection: string;
  fileName: string;
  mimeType: string;
  content: Uint8Array | string;
}

/** Uploads one document and waits for Affinda to finish parsing it. Returns its identifier. */
export async function uploadDocument({ collection, fileName, mimeType, content }: UploadArgs): Promise<string> {
  const form = new FormData();
  const bytes = typeof content === 'string' ? new TextEncoder().encode(content) : content;
  form.append('file', new Blob([bytes], { type: mimeType }), fileName);
  form.append('collection', collection);
  form.append('fileName', fileName);
  form.append('wait', 'true');

  const document = await affindaRequest<AffindaDocumentResponse>('/documents', { method: 'POST', form });
  const identifier = document?.meta?.identifier;

  if (document?.meta?.failed || !identifier) {
    throw new AffindaError(
      'invalid_document',
      `We could not read "${fileName}". Please make sure it is a valid, text-based resume and try again.`,
      422,
      document?.error?.errorDetail ?? 'Affinda returned no document identifier.',
    );
  }
  return identifier;
}

/** Best-effort cleanup so matched documents don't pile up in the Affinda workspace. */
export async function deleteDocument(identifier: string): Promise<void> {
  try {
    await affindaRequest(`/documents/${identifier}`, { method: 'DELETE', allowNotFound: true });
  } catch (err) {
    console.warn(`Affinda: failed to delete document ${identifier}`, err);
  }
}

/* ------------------------------------------------------------------ *
 * Search & Match
 * ------------------------------------------------------------------ */

/**
 * `GET /v3/resume_search/match` — the overall score plus per-criterion scores.
 *
 * Deliberately does not pass `index`: that parameter narrows the search to resumes already
 * inside a given index, and scores 0 for a freshly uploaded resume that isn't in one yet.
 */
export async function matchResumeToJobDescription(
  resume: string,
  jobDescription: string,
): Promise<AffindaMatchResponse> {
  const match = await affindaRequest<AffindaMatchResponse>('/resume_search/match', {
    query: { resume, job_description: jobDescription },
  });

  if (!match || typeof match.score !== 'number') {
    throw new AffindaError(
      'unexpected',
      'The matching service returned an incomplete result. Please try again.',
      502,
      `Unexpected match payload: ${JSON.stringify(match)?.slice(0, 300)}`,
    );
  }
  return match;
}

/**
 * `POST /v3/resume_search/details/{identifier}` — the only Affinda endpoint that reports
 * which criteria are *missing* from a resume. It only works for resumes that live in a
 * search index, so it is strictly optional enrichment: any failure downgrades the result
 * to score-only instead of failing the whole match.
 */
export async function fetchMatchDetails(
  resumeIdentifier: string,
  jobDescriptionIdentifier: string,
  index: string,
): Promise<AffindaSearchDetailResponse | null> {
  try {
    await addToIndex(resumeIdentifier, index);
    return await affindaRequest<AffindaSearchDetailResponse>(
      `/resume_search/details/${resumeIdentifier}`,
      { method: 'POST', json: { indices: [index], jobDescription: jobDescriptionIdentifier } },
    );
  } catch (err) {
    console.warn('Affinda: skipping detailed match breakdown', err);
    return null;
  }
}

async function addToIndex(resumeIdentifier: string, index: string): Promise<void> {
  await affindaRequest(`/index/${encodeURIComponent(index)}/documents`, {
    method: 'POST',
    json: { document: resumeIdentifier },
  });
}

/** Best-effort removal of a resume from the search index once the match is done. */
export async function removeFromIndex(resumeIdentifier: string, index: string): Promise<void> {
  try {
    await affindaRequest(
      `/index/${encodeURIComponent(index)}/documents/${resumeIdentifier}`,
      { method: 'DELETE', allowNotFound: true },
    );
  } catch (err) {
    console.warn(`Affinda: failed to remove ${resumeIdentifier} from index ${index}`, err);
  }
}
