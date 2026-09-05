import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

const PDF_MIME = 'application/pdf';
const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export class UnsupportedFileTypeError extends Error {
  constructor(mimetype: string) {
    super(`Unsupported file type: ${mimetype}. Upload a PDF or DOCX resume.`);
    this.name = 'UnsupportedFileTypeError';
  }
}

/** Extracts plain text from an uploaded resume file (PDF or DOCX). */
export async function extractResumeText(file: { buffer: Buffer; mimetype: string }): Promise<string> {
  let text: string;

  if (file.mimetype === PDF_MIME) {
    const parser = new PDFParse({ data: file.buffer });
    try {
      text = (await parser.getText()).text;
    } finally {
      await parser.destroy();
    }
  } else if (file.mimetype === DOCX_MIME) {
    text = (await mammoth.extractRawText({ buffer: file.buffer })).value;
  } else {
    throw new UnsupportedFileTypeError(file.mimetype);
  }

  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (!trimmed) {
    throw new Error('Could not extract any text from this file — it may be scanned/image-based or empty.');
  }
  return trimmed;
}
