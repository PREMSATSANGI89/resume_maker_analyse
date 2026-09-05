import multer from 'multer';

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Resume formats the app accepts everywhere (analyzer, comparison, job-description matcher). */
export const ACCEPTED_MIMETYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export const UNSUPPORTED_FORMAT_MESSAGE = 'Only PDF and DOCX files are supported.';

/** Shared multer instance — keeps uploads in memory and enforces the size cap. */
export const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES },
});
