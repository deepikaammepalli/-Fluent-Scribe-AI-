import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportResult {
  success: boolean;
  pageCount: number;
  fileName: string;
  blob?: Blob;
  error?: string;
}

/**
 * Generates an A4 PDF from an array of DOM element containers.
 * Each container represents one A4 page sheet.
 */
export async function generateA4PDF(
  pageElements: HTMLElement[],
  documentTitle: string = 'Document'
): Promise<PDFExportResult> {
  if (!pageElements || pageElements.length === 0) {
    throw new Error('No document pages found to export.');
  }

  const safeTitle = (documentTitle || 'Document')
    .trim()
    .replace(/[^a-zA-Z0-9_\-\u0900-\u0D7F\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\s]/g, '')
    .slice(0, 50) || 'Fluent_Scribe_Document';

  // Initialize jsPDF with A4 portrait (210mm x 297mm)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = 210; // mm
  const pdfHeight = 297; // mm

  for (let i = 0; i < pageElements.length; i++) {
    const el = pageElements[i];

    // High resolution canvas capture (scale 2 for retina clarity)
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794,
      onclone: (_clonedDoc, clonedEl) => {
        // Ensure no scrollbars or overflow shadows in render
        clonedEl.style.boxShadow = 'none';
        clonedEl.style.transform = 'none';
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  }

  const actualPageCount = pdf.getNumberOfPages();
  const fileName = `${safeTitle}.pdf`;
  const blob = pdf.output('blob');

  return {
    success: true,
    pageCount: actualPageCount,
    fileName,
    blob,
  };
}

/**
 * Downloads the PDF directly to device
 */
export async function downloadDocumentPDF(
  pageElements: HTMLElement[],
  documentTitle: string
): Promise<PDFExportResult> {
  const result = await generateA4PDF(pageElements, documentTitle);
  if (result.blob) {
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }
  return result;
}

/**
 * Shares the PDF using Web Share API on mobile or falls back to download
 */
export async function shareDocumentPDF(
  pageElements: HTMLElement[],
  documentTitle: string
): Promise<{ shared: boolean; method: 'native-share' | 'download-fallback'; message: string }> {
  const result = await generateA4PDF(pageElements, documentTitle);
  if (!result.blob) {
    throw new Error('Failed to generate PDF for sharing.');
  }

  const pdfFile = new File([result.blob], result.fileName, {
    type: 'application/pdf',
    lastModified: Date.now(),
  });

  // Check if navigator.share supports sharing files (standard on modern Android & iOS)
  if (
    typeof navigator !== 'undefined' &&
    navigator.canShare &&
    navigator.canShare({ files: [pdfFile] })
  ) {
    try {
      await navigator.share({
        title: documentTitle || 'Fluent Scribe Document',
        text: `Here is the ${result.pageCount}-page translated document exported from Fluent Scribe AI.`,
        files: [pdfFile],
      });
      return {
        shared: true,
        method: 'native-share',
        message: 'Document shared successfully via native share menu.',
      };
    } catch (shareErr: any) {
      if (shareErr.name === 'AbortError') {
        return {
          shared: false,
          method: 'native-share',
          message: 'Share cancelled by user.',
        };
      }
      console.warn('Native share failed, triggering download fallback:', shareErr);
    }
  }

  // Fallback: trigger download so user can manually attach in WhatsApp, Gmail, etc.
  const url = URL.createObjectURL(result.blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = result.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 3000);

  return {
    shared: true,
    method: 'download-fallback',
    message: 'PDF downloaded to your device so you can share it directly via WhatsApp, Gmail, or your preferred app.',
  };
}

/**
 * Triggers standard browser print dialog styled for A4
 */
export function printDocumentWindow() {
  window.print();
}
