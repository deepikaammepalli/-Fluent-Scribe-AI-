import React from 'react';
import { X, BookOpen, ArrowRight, Check } from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/languages';
import { SampleDocument } from '../types';

interface SampleTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SampleDocument) => void;
}

export const SampleTextModal: React.FC<SampleTextModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Sample Test Documents
              </h2>
              <p className="text-xs text-slate-500">
                Choose a pre-formatted test workflow to try translation and exact A4 pagination
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 divide-y divide-slate-100">
          {SAMPLE_DOCUMENTS.map((sample) => (
            <div
              key={sample.id}
              className="pt-3.5 first:pt-0 group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
            >
              <div className="space-y-1 flex-1 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {sample.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {sample.sourceLang.toUpperCase()} → {sample.targetLang.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-800">
                  {sample.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {sample.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectSample(sample);
                  onClose();
                }}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
              >
                <span>Load Workflow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 rounded-b-2xl flex items-center justify-between text-xs text-slate-500">
          <span>Clicking Load will populate source text and target languages automatically.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
