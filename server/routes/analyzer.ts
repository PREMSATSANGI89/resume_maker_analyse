import { Router, type Response } from 'express';
import { v4 as uuid } from 'uuid';
import { extractResumeText, UnsupportedFileTypeError } from '../lib/extractText.js';
import {
  ACCEPTED_MIMETYPES,
  MAX_UPLOAD_BYTES,
  resumeUpload as upload,
  UNSUPPORTED_FORMAT_MESSAGE,
} from '../lib/uploads.js';
import { callOpenRouterJSON } from '../lib/openrouter.js';
import {
  buildAnalysisPrompt,
  buildComparisonPrompt,
  type ModelAnalysisOutput,
  type ModelComparisonOutput,
  type ModelComparisonSide,
} from '../lib/prompts.js';
import type { ResumeAnalysisResult } from '../../src/types/analyzer.types';
import type { ResumeComparisonResult, ResumeComparisonSide } from '../../src/types/comparison.types';

// Re-exported so server/index.ts keeps its existing import path.
export { MAX_UPLOAD_BYTES };

export const analyzerRouter = Router();

analyzerRouter.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: 'No resume file was uploaded.' });
      return;
    }
    if (!ACCEPTED_MIMETYPES.has(file.mimetype)) {
      res.status(400).json({ message: UNSUPPORTED_FORMAT_MESSAGE });
      return;
    }

    const text = await extractResumeText(file);
    const output = await callOpenRouterJSON<ModelAnalysisOutput>(buildAnalysisPrompt(text));

    const result: ResumeAnalysisResult = {
      id: uuid(),
      fileName: file.originalname,
      analyzedAt: new Date().toISOString(),
      scores: output.scores,
      strengths: output.strengths,
      weaknesses: output.weaknesses,
      missingSkills: output.missingSkills,
      keywordMatch: output.keywordMatch,
      suggestions: output.suggestions.map((s) => ({ ...s, id: uuid() })),
      improvementTimeline: output.improvementTimeline.map((s) => ({ ...s, id: uuid() })),
      summary: output.summary,
    };

    res.json({ success: true, data: result });
  } catch (err) {
    handleError(res, err, 'Failed to analyze resume.');
  }
});

analyzerRouter.post(
  '/compare',
  upload.fields([
    { name: 'resumeA', maxCount: 1 },
    { name: 'resumeB', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files as Record<string, Express.Multer.File[]> | undefined;
      const fileA = files?.resumeA?.[0];
      const fileB = files?.resumeB?.[0];
      if (!fileA || !fileB) {
        res.status(400).json({ message: 'Both resumes are required to run a comparison.' });
        return;
      }
      for (const f of [fileA, fileB]) {
        if (!ACCEPTED_MIMETYPES.has(f.mimetype)) {
          res.status(400).json({ message: UNSUPPORTED_FORMAT_MESSAGE });
          return;
        }
      }

      const [textA, textB] = await Promise.all([extractResumeText(fileA), extractResumeText(fileB)]);
      const output = await callOpenRouterJSON<ModelComparisonOutput>(buildComparisonPrompt(textA, textB));

      const toSide = (file: Express.Multer.File, side: ModelComparisonSide): ResumeComparisonSide => ({
        fileName: file.originalname,
        ...side,
      });

      const result: ResumeComparisonResult = {
        id: uuid(),
        comparedAt: new Date().toISOString(),
        resumeA: toSide(fileA, output.resumeA),
        resumeB: toSide(fileB, output.resumeB),
      };

      res.json({ success: true, data: result });
    } catch (err) {
      handleError(res, err, 'Failed to compare resumes.');
    }
  },
);

function handleError(res: Response, err: unknown, fallbackMessage: string) {
  const message = err instanceof UnsupportedFileTypeError ? err.message : fallbackMessage;
  console.error(err);
  res.status(err instanceof UnsupportedFileTypeError ? 400 : 502).json({ message });
}
