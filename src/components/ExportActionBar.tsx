import React, { useState } from 'react';
import {
  Download,
  Printer,
  Share2,
  FileCheck2,
  Loader2,
  CheckCircle,
  FileText,
  Edit3,
} from 'lucide-react';
import { downloadDocumentPDF, shareDocumentPDF, printDocumentWindow } from '../services/pdf';

interface ExportActionBarProps {
  pageElements: HTMLElement[];
  documentTitle: string;
  pageCount: number;
  onEditDocument?: () => void;
}

export const ExportActionBar: React.FC<ExportActionBarProps> = ({
  pageElements,
  documentTitle,
  pageCount,
  onEditDocument,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      setExportMessage('Generating high-resolution A4 PDF...');
      const result = await downloadDocumentPDF(pageElements, documentTitle);
      setExportMessage(`PDF downloaded successfully! (${result.pageCount} pages verified)`);
      setTimeout(() => setExportMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setExportMessage(`Export error: ${err.message || 'Failed to generate PDF'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsExporting(true);
      setExportMessage('Preparing A4 PDF for sharing...');
      const result = await shareDocumentPDF(pageElements, documentTitle);
      setExportMessage(result.message);
      setTimeout(() => setExportMessage(null), 5000);
    } catch (err: any) {
      console.error(err);
      setExportMessage(`Share error: ${err.message || 'Failed to share PDF'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    printDocumentWindow();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm no-print space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Verification Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                Verified A4 Export Ready
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Matches print preview and export specifications exactly
            </p>
          </div>
        </div>

        {/* Right: Export action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onEditDocument && (
            <button
              type="button"
              onClick={onEditDocument}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap"
            >
              <Edit3 className="w-4 h-4 text-slate-500" />
              <span>Edit Document</span>
            </button>
          )}

          <button
            type="button"
            disabled={isExporting}
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap active:scale-95"
            title="Print or Save as PDF via native browser dialog"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Document</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 rounded-lg transition-all whitespace-nowrap active:scale-95 shadow-2xs"
            title="Share PDF via WhatsApp, Gmail, Drive (Web Share API)"
          >
            <Share2 className="w-4 h-4 text-blue-600" />
            <span>Share PDF</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all whitespace-nowrap active:scale-95 shadow-xs disabled:bg-slate-300"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Export notification */}
      {exportMessage && (
        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-xs text-blue-800">
          <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{exportMessage}</span>
        </div>
      )}
    </div>
  );
};
