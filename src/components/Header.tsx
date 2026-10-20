import React from 'react';
import { FileText, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenSamples: () => void;
  onReset: () => void;
  activeTab: 'translator' | 'document';
  setActiveTab: (tab: 'translator' | 'document') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSamples,
  onReset,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              Fluent Scribe AI
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-medium">
              Voice Translator & Document Maker
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('translator')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'translator'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Translator & Voice
          </button>
          <button
            onClick={() => setActiveTab('document')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'document'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Word Document Editor
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSamples}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            title="Load sample documents for quick testing"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline">Sample Documents</span>
            <span className="md:hidden">Samples</span>
          </button>

          <button
            onClick={onReset}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            New Document
          </button>
        </div>
      </div>
    </header>
  );
};
