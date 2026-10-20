import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  FileCheck,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { DocumentConfig, PageCountTarget, DocumentMargin, LineSpacing } from '../types';

interface DocumentToolbarProps {
  config: DocumentConfig;
  onConfigChange: (newConfig: Partial<DocumentConfig>) => void;
  onAutoBalance: () => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  viewMode: 'stacked' | 'grid';
  onViewModeChange: (mode: 'stacked' | 'grid') => void;
}

export const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  config,
  onConfigChange,
  onAutoBalance,
  zoomLevel,
  onZoomChange,
  viewMode,
  onViewModeChange,
}) => {
  const pageOptions: { label: string; value: PageCountTarget }[] = [
    { label: 'Auto', value: 'auto' },
    { label: '1 Page', value: 1 },
    { label: '2 Pages', value: 2 },
    { label: '3 Pages', value: 3 },
    { label: 'Exactly 4 Pages', value: 4 },
  ];

  const fontOptions = [
    { label: 'Plus Jakarta Sans (Standard)', value: '' },
    { label: 'Lora (Editorial Serif)', value: 'font-serif-doc' },
    { label: 'Noto Sans Telugu (తెలుగు)', value: 'font-telugu' },
    { label: 'Noto Sans Tamil (தமிழ்)', value: 'font-tamil' },
    { label: 'Noto Sans Devanagari (हिन्दी)', value: 'font-hindi' },
    { label: 'Noto Sans Kannada (ಕನ್ನಡ)', value: 'font-kannada' },
    { label: 'Noto Sans Malayalam (മലയാളം)', value: 'font-malayalam' },
    { label: 'Noto Sans Japanese (日本語)', value: 'font-japanese' },
    { label: 'JetBrains Mono (Monospace)', value: 'font-mono-doc' },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs divide-y divide-slate-100 no-print">
      {/* Upper Ribbon: Document Title & Target Page Count */}
      <div className="p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Document Title Input */}
        <div className="flex-1 min-w-[240px]">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Document Title
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => onConfigChange({ title: e.target.value })}
            placeholder="Official Document Title..."
            className="w-full px-3 py-1.5 text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* 5. Exact A4 Page Count Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Target A4 Page Count
          </label>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {pageOptions.map((opt) => {
              const isSelected = config.targetPages === opt.value;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => onConfigChange({ targetPages: opt.value })}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rebalance / Auto-Fit helper */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={onAutoBalance}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap"
            title="Automatically distribute paragraphs evenly across the target pages"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Balance Pages</span>
          </button>
        </div>
      </div>

      {/* Lower Ribbon: Word-style formatting tools */}
      <div className="p-3 bg-slate-50/70 rounded-b-xl flex flex-wrap items-center gap-3 text-slate-700 text-xs">
        {/* Font Family */}
        <div className="flex items-center gap-1.5">
          <select
            value={config.fontFamily}
            onChange={(e) => onConfigChange({ fontFamily: e.target.value })}
            className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {fontOptions.map((f) => (
              <option key={f.label} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Size:</span>
          <select
            value={config.fontSize}
            onChange={(e) => onConfigChange({ fontSize: Number(e.target.value) })}
            className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {[10, 11, 12, 13, 14, 16, 18, 20].map((s) => (
              <option key={s} value={s}>
                {s}pt
              </option>
            ))}
          </select>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Bold, Italic, Underline */}
        <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-md p-0.5">
          <button
            type="button"
            onClick={() => onConfigChange({ isBold: !config.isBold })}
            className={`p-1 rounded transition-colors ${
              config.isBold ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onConfigChange({ isItalic: !config.isItalic })}
            className={`p-1 rounded transition-colors ${
              config.isItalic ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onConfigChange({ isUnderline: !config.isUnderline })}
            className={`p-1 rounded transition-colors ${
              config.isUnderline ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-md p-0.5">
          <button
            type="button"
            onClick={() => onConfigChange({ textAlign: 'left' })}
            className={`p-1 rounded transition-colors ${
              config.textAlign === 'left' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onConfigChange({ textAlign: 'center' })}
            className={`p-1 rounded transition-colors ${
              config.textAlign === 'center' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onConfigChange({ textAlign: 'right' })}
            className={`p-1 rounded transition-colors ${
              config.textAlign === 'right' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onConfigChange({ textAlign: 'justify' })}
            className={`p-1 rounded transition-colors ${
              config.textAlign === 'justify' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Justify"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Line Spacing */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Line:</span>
          <select
            value={config.lineSpacing}
            onChange={(e) => onConfigChange({ lineSpacing: e.target.value as LineSpacing })}
            className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-800"
          >
            <option value="1.0">1.0 (Single)</option>
            <option value="1.15">1.15</option>
            <option value="1.5">1.5 (Standard)</option>
            <option value="2.0">2.0 (Double)</option>
          </select>
        </div>

        {/* Margins */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400">Margins:</span>
          <select
            value={config.margin}
            onChange={(e) => onConfigChange({ margin: e.target.value as DocumentMargin })}
            className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-800"
          >
            <option value="normal">Normal (25mm)</option>
            <option value="narrow">Narrow (12.7mm)</option>
            <option value="wide">Wide (38mm)</option>
          </select>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Zoom & View Controls */}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5">
            <button
              type="button"
              onClick={() => onZoomChange(Math.max(50, zoomLevel - 15))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="px-1 font-mono text-[11px] tabular-nums text-slate-600">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => onZoomChange(Math.min(150, zoomLevel + 15))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onViewModeChange(viewMode === 'stacked' ? 'grid' : 'stacked')}
            className={`p-1.5 border border-slate-200 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
            title={viewMode === 'stacked' ? 'Switch to Multi-Page Grid View' : 'Switch to Stacked Word View'}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
