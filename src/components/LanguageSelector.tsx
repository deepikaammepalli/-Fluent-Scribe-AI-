import React from 'react';
import { ArrowLeftRight, Check, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { Language } from '../types';

interface LanguageSelectorProps {
  sourceLang: string;
  targetLang: string;
  onSourceChange: (code: string) => void;
  onTargetChange: (code: string) => void;
  onSwap: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange,
  onSwap,
}) => {
  const currentSource =
    SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang) || SUPPORTED_LANGUAGES[0];
  const currentTarget =
    SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[5];

  const quickPairs = [
    { s: 'te', t: 'en', label: 'Telugu → English' },
    { s: 'en', t: 'te', label: 'English → Telugu' },
    { s: 'hi', t: 'en', label: 'Hindi → English' },
    { s: 'ta', t: 'en', label: 'Tamil → English' },
    { s: 'ja', t: 'en', label: 'Japanese → English' },
  ];

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* Source Language */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Translate from (Source Language)
          </label>
          <div className="relative">
            <select
              value={sourceLang}
              onChange={(e) => onSourceChange(e.target.value)}
              className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg py-2.5 pl-3.5 pr-10 text-sm font-medium text-slate-800 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={`src-${lang.code}`} value={lang.code}>
                  {lang.name} — {lang.nativeName} ({lang.speechCode})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center sm:pt-5">
          <button
            type="button"
            onClick={onSwap}
            aria-label="Swap source and target languages"
            title="Swap Languages"
            className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-slate-600 hover:text-blue-600 transition-all active:scale-95 shadow-2xs"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Target Language */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Translate to (Target Language)
          </label>
          <div className="relative">
            <select
              value={targetLang}
              onChange={(e) => onTargetChange(e.target.value)}
              className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg py-2.5 pl-3.5 pr-10 text-sm font-medium text-slate-800 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={`tgt-${lang.code}`} value={lang.code}>
                  {lang.name} — {lang.nativeName} ({lang.speechCode})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Quick shortcuts */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Popular:</span>
        {quickPairs.map((pair) => {
          const isActive = sourceLang === pair.s && targetLang === pair.t;
          return (
            <button
              key={`${pair.s}-${pair.t}`}
              type="button"
              onClick={() => {
                onSourceChange(pair.s);
                onTargetChange(pair.t);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
              }`}
            >
              {pair.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
