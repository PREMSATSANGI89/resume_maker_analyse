import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

/**
 * Renders a DOM node to a multi-page A4 PDF and triggers a browser download.
 * Used to turn the resume builder's live preview into an actual downloadable file.
 */
export async function exportNodeToPdf(node: HTMLElement, fileName: string): Promise<void> {
  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  });

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageHeightPx = Math.floor((canvas.width / A4_WIDTH_MM) * A4_HEIGHT_MM);

  let renderedPx = 0;
  let pageIndex = 0;
  // Loop on remaining height rather than a precomputed page count — computing
  // totalPages via division can round up over a sub-pixel remainder and produce
  // a final near-zero-height slice, which toDataURL() turns into an empty,
  // undecodable image ("wrong PNG signature" from jsPDF).
  while (canvas.height - renderedPx > 1) {
    const sliceHeightPx = Math.min(pageHeightPx, canvas.height - renderedPx);

    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = sliceHeightPx;
    const ctx = sliceCanvas.getContext('2d');
    if (!ctx) throw new Error('Could not create a canvas context for PDF export.');
    ctx.drawImage(
      canvas,
      0,
      renderedPx,
      canvas.width,
      sliceHeightPx,
      0,
      0,
      canvas.width,
      sliceHeightPx,
    );

    if (pageIndex > 0) pdf.addPage();
    const sliceHeightMm = (sliceHeightPx / canvas.width) * A4_WIDTH_MM;
    // JPEG rather than PNG: a rasterized text page has no transparency to preserve, and
    // PNG's lossless encoding balloons a single A4 page to 10MB+ at 2x render scale.
    pdf.addImage(sliceCanvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, A4_WIDTH_MM, sliceHeightMm);

    renderedPx += sliceHeightPx;
    pageIndex += 1;
  }

  pdf.save(fileName);
}

/** Builds a safe, descriptive filename for a resume PDF download. */
export function buildResumeFileName(fullName: string): string {
  const slug = fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug || 'resume'}-resume.pdf`;
}
