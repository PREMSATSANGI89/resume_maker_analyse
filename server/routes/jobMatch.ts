import { Router, type Response } from 'express';
import {
  AffindaError,
  deleteDocument,
  fetchMatchDetails,
  matchResumeToJobDescription,
  removeFromIndex,
  resolveTargets,
  uploadDocument,
} from '../lib/affinda.js';
import { mapMatchResult } from '../lib/matchMapper.js';
import {
  ACCEPTED_MIMETYPES,
  resumeUpload as upload,
  UNSUPPORTED_FORMAT_MESSAGE,
} from '../lib/uploads.js';

/** Kept in sync with JOB_DESCRIPTION_LIMITS in src/utils/constants.ts. */
const MIN_JOB_DESCRIPTION_CHARS = 50;
const MAX_JOB_DESCRIPTION_CHARS = 20000;

export const jobMatchRouter = Router();

jobMatchRouter.post('/match', upload.single('resume'), async (req, res) => {
  const file = req.file;
  const jobDescription = typeof req.body?.jobDescription === 'string' ? req.body.jobDescription.trim() : '';

  if (!file) {
    res.status(400).json({ message: 'Please upload a resume before matching.' });
    return;
  }
  if (!ACCEPTED_MIMETYPES.has(file.mimetype)) {
    res.status(400).json({ message: UNSUPPORTED_FORMAT_MESSAGE });
    return;
  }
  if (!jobDescription) {
    res.status(400).json({ message: 'Please paste a job description before matching.' });
    return;
  }
  if (jobDescription.length < MIN_JOB_DESCRIPTION_CHARS) {
    res.status(400).json({
      message: `The job description is too short — add at least ${MIN_JOB_DESCRIPTION_CHARS} characters so we can match it properly.`,
    });
    return;
  }
  if (jobDescription.length > MAX_JOB_DESCRIPTION_CHARS) {
    res.status(400).json({
      message: `The job description is too long. Please keep it under ${MAX_JOB_DESCRIPTION_CHARS.toLocaleString()} characters.`,
    });
    return;
  }

  let resumeId: string | null = null;
  let jobDescriptionId: string | null = null;
  let resumeIndex: string | null = null;

  try {
    const targets = await resolveTargets();
    resumeIndex = targets.resumeIndex;

    // Affinda matches documents, so both sides have to be uploaded and parsed first.
    [resumeId, jobDescriptionId] = await Promise.all([
      uploadDocument({
        collection: targets.resumeCollection,
        fileName: file.originalname,
        mimeType: file.mimetype,
        content: new Uint8Array(file.buffer),
      }),
      uploadDocument({
        collection: targets.jobDescriptionCollection,
        fileName: 'job-description.txt',
        mimeType: 'text/plain',
        content: jobDescription,
      }),
    ]);

    const match = await matchResumeToJobDescription(resumeId, jobDescriptionId);
    const detail = resumeIndex ? await fetchMatchDetails(resumeId, jobDescriptionId, resumeIndex) : null;

    res.json({
      success: true,
      data: mapMatchResult({ fileName: file.originalname, match, detail }),
    });
  } catch (err) {
    handleMatchError(res, err);
  } finally {
    // Best-effort cleanup so trial credits and the search index aren't filled with one-off documents.
    if (resumeId && resumeIndex) await removeFromIndex(resumeId, resumeIndex);
    await Promise.all([
      resumeId ? deleteDocument(resumeId) : Promise.resolve(),
      jobDescriptionId ? deleteDocument(jobDescriptionId) : Promise.resolve(),
    ]);
  }
});

function handleMatchError(res: Response, err: unknown) {
  if (err instanceof AffindaError) {
    // The raw provider error stays in the log; the client only sees the friendly message.
    console.error(`[job-match] ${err.kind}: ${err.message}`);
    res.status(err.status).json({ message: err.userMessage });
    return;
  }
  console.error('[job-match] unexpected error', err);
  res.status(500).json({ message: 'Something went wrong while matching your resume. Please try again.' });
}
