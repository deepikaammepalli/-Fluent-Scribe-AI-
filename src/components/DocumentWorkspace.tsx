import React, { useRef } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Plus,
  Trash2,
  FileText,
  CornerDownRight,
} from 'lucide-react';
import { DocumentConfig, PageCountTarget } from '../types';
import { PaginationAnalysis } from '../services/pagination';

interface DocumentWorkspaceProps {
  config: DocumentConfig;
  pages: string[];
  paginationAnalysis: PaginationAnalysis;
  onPageChange: (index: number, content: string) => void;
  onAddPage: () => void;
  onRemovePage: (index: number) => void;
  zoomLevel: number;
  viewMode: 'stacked' | 'grid';
  pageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export const DocumentWorkspace: React.FC<DocumentWorkspaceProps> = ({
  config,
  pages,
  paginationAnalysis,
  onPageChange,
  onAddPage,
  onRemovePage,
  zoomLevel,
  viewMode,
  pageRefs,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Margin padding CSS classes
  const getMarginClass = (margin: string) => {
    switch (margin) {
      case 'narrow':
        return 'p-8 sm:p-10'; // ~12.7mm
      case 'wide':
        return 'p-16 sm:p-20'; // ~38mm
      case 'normal':
      default:
        return 'p-12 sm:p-16'; // ~25.4mm
    }
  };

  // Font size style
  const getFontSizeStyle = (pt: number) => {
    return {
      fontSize: `${pt}pt`,
      lineHeight: config.lineSpacing,
      textAlign: config.textAlign,
      fontWeight: config.isBold ? 700 : 400,
      fontStyle: config.isItalic ? 'italic' : 'normal',
      textDecoration: config.isUnderline ? 'underline' : 'none',
    };
  };

  return (
    <div className="space-y-4">
      {/* Page Count & Fit Status Banner */}
      <div className="no-print">
        {paginationAnalysis.status === 'underflow' && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-800">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">Target page count notice: </span>
              {paginationAnalysis.statusMessage}
            </div>
          </div>
        )}

        {paginationAnalysis.status === 'overflow' && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">Page overflow warning: </span>
              {paginationAnalysis.statusMessage}
            </div>
          </div>
        )}

        {paginationAnalysis.status === 'optimal' && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <span className="font-semibold">A4 Layout Verified: </span>
                {paginationAnalysis.statusMessage}
              </span>
            </div>
            <span className="text-emerald-700 font-mono font-medium">
              {pages.length} {pages.length === 1 ? 'Page' : 'Pages'} Total
            </span>
          </div>
        )}
      </div>

      {/* Page Navigation Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500 no-print">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="font-medium text-slate-600 mr-1">Pages:</span>
          {pages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const el = pageRefs.current[idx];
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md font-mono text-slate-700 transition-colors"
            >
              Page {idx + 1}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span>{paginationAnalysis.wordCount} words</span>
          <span>·</span>
          <span>A4 (210 × 297mm)</span>
        </div>
      </div>

      {/* Microsoft Word Canvas: Light grey desk background */}
      <div
        ref={containerRef}
        className="bg-slate-200/90 rounded-2xl p-4 sm:p-8 md:p-12 overflow-x-auto min-h-[600px] flex justify-center items-start border border-slate-300/70"
      >
        <div
          style={{
            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className={`w-full flex ${
            viewMode === 'grid' && pages.length > 1
              ? 'grid grid-cols-1 xl:grid-cols-2 gap-8 justify-items-center'
              : 'flex-col items-center gap-10'
          }`}
        >
          {pages.map((pageContent, index) => (
            <div
              key={index}
              ref={(el) => {
                pageRefs.current[index] = el;
              }}
              id={`a4-page-sheet-${index}`}
              className={`a4-page bg-white shadow-xl rounded-sm border border-slate-300/80 relative flex flex-col justify-between transition-shadow hover:shadow-2xl ${
                getMarginClass(config.margin)
              } ${config.fontFamily}`}
              style={{
                width: '794px',
                minHeight: '1123px',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
              }}
            >
              {/* Running Header */}
              {config.showHeader && (
                <div className="border-b border-slate-200/80 pb-3 mb-6 flex items-center justify-between text-[11px] text-slate-400 font-sans tracking-wide">
                  <span className="font-semibold uppercase tracking-wider text-slate-500 truncate max-w-[400px]">
                    {config.title || 'Untitled Document'}
                  </span>
                  <span>{config.date || new Date().toLocaleDateString()}</span>
                </div>
              )}

              {/* Editable Page Body */}
              <div className="flex-1 flex flex-col">
                {/* On first page, display big document title */}
                {index === 0 && config.title && (
                  <div className="mb-6 pb-2 border-b border-slate-100">
                    <h1
                      className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
                      style={{ textAlign: config.textAlign }}
                    >
                      {config.title}
                    </h1>
                  </div>
                )}

                <textarea
                  value={pageContent}
                  onChange={(e) => onPageChange(index, e.target.value)}
                  placeholder={`Page ${index + 1} content... Type or paste text here. Formatting and fonts apply instantly.`}
                  style={getFontSizeStyle(config.fontSize)}
                  className={`w-full flex-1 min-h-[850px] resize-none border-0 p-0 text-slate-900 bg-transparent focus:outline-none focus:ring-0 leading-relaxed ${config.fontFamily}`}
                />
              </div>

              {/* Running Footer with Page Numbers */}
              {config.showFooter && (
                <div className="border-t border-slate-200/80 pt-3 mt-6 flex items-center justify-between text-[11px] text-slate-400 font-sans tracking-wide">
                  <span className="truncate max-w-[300px]">
                    Fluent Scribe AI Document
                  </span>
                  {config.showPageNumbers && (
                    <span className="font-mono tabular-nums font-medium text-slate-600">
                      Page {index + 1} of {pages.length}
                    </span>
                  )}
                </div>
              )}

              {/* Page Number Watermark Stamp in Corner (Preview only) */}
              <div className="absolute top-3 right-3 no-print bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-mono px-2 py-0.5 rounded shadow-2xs">
                A4 · Page {index + 1}/{pages.length}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
