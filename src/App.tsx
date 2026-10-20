/**
 * Fluent Scribe AI — Voice Translator & Document Maker
 * Precision multilingual voice translation and Microsoft Word-style A4 document studio
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { TranslatorSection } from './components/TranslatorSection';
import { DocumentToolbar } from './components/DocumentToolbar';
import { DocumentWorkspace } from './components/DocumentWorkspace';
import { ExportActionBar } from './components/ExportActionBar';
import { SampleTextModal } from './components/SampleTextModal';
import { DocumentConfig, PageCountTarget, SampleDocument } from './types';
import { translateText } from './services/api';
import { calculatePagination, splitIntoNPages } from './services/pagination';
import { SAMPLE_DOCUMENTS, SUPPORTED_LANGUAGES } from './data/languages';
import { FileText, ArrowDown, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'translator' | 'document'>('translator');
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState<'stacked' | 'grid'>('stacked');

  // Translation State - default to Telugu -> English as requested
  const [sourceLang, setSourceLang] = useState('te');
  const [targetLang, setTargetLang] = useState('en');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  // Document Config State
  const [docConfig, setDocConfig] = useState<DocumentConfig>({
    title: 'Comprehensive Telugu Activity Report',
    author: 'Fluent Scribe AI',
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    fontFamily: '',
    fontSize: 12,
    lineSpacing: '1.5',
    paragraphSpacing: 'normal',
    textAlign: 'left',
    margin: 'normal',
    targetPages: 4, // Default to 4 pages as highlighted in prompt workflow
    showHeader: true,
    showFooter: true,
    showPageNumbers: true,
    isBold: false,
    isItalic: false,
    isUnderline: false,
  });

  // Pages Array
  const [pages, setPages] = useState<string[]>(['']);

  // Document workspace DOM references for PDF export
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const documentSectionRef = useRef<HTMLDivElement>(null);

  // Calculate pagination whenever translatedText, targetPages, fontSize, or lineSpacing changes
  const paginationAnalysis = calculatePagination(
    translatedText,
    docConfig.targetPages,
    docConfig.fontSize,
    docConfig.lineSpacing
  );

  // Synchronize pages state when pagination calculation updates
  useEffect(() => {
    if (paginationAnalysis.pages && paginationAnalysis.pages.length > 0) {
      setPages(paginationAnalysis.pages);
    }
  }, [
    translatedText,
    docConfig.targetPages,
    docConfig.fontSize,
    docConfig.lineSpacing,
  ]);

  // Update target font family when target language changes
  useEffect(() => {
    const targetLanguageObj = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang);
    if (targetLanguageObj?.fontClass) {
      setDocConfig((prev) => ({
        ...prev,
        fontFamily: targetLanguageObj.fontClass,
      }));
    } else {
      setDocConfig((prev) => ({
        ...prev,
        fontFamily: '',
      }));
    }
  }, [targetLang]);

  // Swap Languages Handler
  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  // Translation execution
  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    try {
      setIsTranslating(true);
      setTranslationError(null);

      const srcObj = SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang);
      const tgtObj = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang);

      const result = await translateText({
        text: inputText,
        sourceLang: srcObj ? srcObj.name : sourceLang,
        targetLang: tgtObj ? tgtObj.name : targetLang,
      });

      setTranslatedText(result.translatedText);
    } catch (err: any) {
      console.error('Translation error:', err);
      setTranslationError(err.message || 'Translation service failed. Please check your connection.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Clear translation
  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setPages(['']);
  };

  // Open in Document Workspace
  const handleOpenInDocument = () => {
    setActiveTab('document');
    setTimeout(() => {
      documentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Rebalance paragraphs evenly across target pages
  const handleAutoBalance = () => {
    const paragraphs = translatedText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    const targetN = docConfig.targetPages === 'auto' ? Math.max(1, pages.length) : Number(docConfig.targetPages);
    const balanced = splitIntoNPages(paragraphs, targetN);
    setPages(balanced);
    setTranslatedText(balanced.join('\n\n'));
  };

  // Handle individual page edit
  const handlePageContentChange = (index: number, newContent: string) => {
    const updated = [...pages];
    updated[index] = newContent;
    setPages(updated);
    // Sync back to translatedText
    setTranslatedText(updated.join('\n\n'));
  };

  // Add a blank page
  const handleAddPage = () => {
    setPages((prev) => [...prev, '']);
  };

  // Remove a page
  const handleRemovePage = (index: number) => {
    if (pages.length <= 1) return;
    const updated = pages.filter((_, i) => i !== index);
    setPages(updated);
    setTranslatedText(updated.join('\n\n'));
  };

  // Load sample document
  const handleSelectSample = (sample: SampleDocument) => {
    setSourceLang(sample.sourceLang);
    setTargetLang(sample.targetLang);
    setInputText(sample.sourceText);
    setDocConfig((prev) => ({
      ...prev,
      title: sample.title,
    }));
    // Clear previous translation so user can click Translate or inspect
    setTranslatedText('');
  };

  // Collect valid HTMLElement refs for PDF export
  const validPageElements: HTMLDivElement[] = pageRefs.current.filter(
    (el): el is HTMLDivElement => el !== null
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onOpenSamples={() => setIsSampleModalOpen(true)}
        onReset={() => {
          handleClear();
          setDocConfig((prev) => ({
            ...prev,
            title: 'Untitled Document',
          }));
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Section 1: Translator & Voice Input */}
        <section className={`space-y-6 ${activeTab === 'document' ? 'hidden sm:block' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4 no-print">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Voice Translator & Content Studio
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Speak or type in Telugu, Tamil, Hindi, Japanese, and more. Review and translate with precision.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsSampleModalOpen(true)}
              className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Load Telugu 4-Page Report Workflow</span>
            </button>
          </div>

          {/* 1. Language Selectors */}
          <LanguageSelector
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSourceChange={setSourceLang}
            onTargetChange={setTargetLang}
            onSwap={handleSwapLanguages}
          />

          {/* 2 - 6. Translator Text Input, Voice Mic, Translate Button & Result */}
          <TranslatorSection
            sourceLang={sourceLang}
            targetLang={targetLang}
            inputText={inputText}
            translatedText={translatedText}
            isTranslating={isTranslating}
            translationError={translationError}
            onInputChange={setInputText}
            onTranslatedTextChange={setTranslatedText}
            onTranslate={handleTranslate}
            onClear={handleClear}
            onOpenInDocument={handleOpenInDocument}
          />
        </section>

        {/* Section 2: Word-Style Document Editor & A4 Pagination Workspace */}
        <section
          ref={documentSectionRef}
          className={`space-y-6 pt-4 ${
            activeTab === 'translator' && !translatedText ? 'opacity-80' : ''
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4 no-print">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Microsoft Word-Style Studio
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">
                  {docConfig.targetPages === 'auto'
                    ? 'Automatic A4 Flow'
                    : `Target: Exactly ${docConfig.targetPages} A4 Pages`}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                A4 Document Editor & Print Preview
              </h2>
            </div>

            {/* Quick jump back to translator if on mobile */}
            {activeTab === 'document' && (
              <button
                type="button"
                onClick={() => setActiveTab('translator')}
                className="self-start sm:self-auto px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors"
              >
                ← Back to Voice & Translator
              </button>
            )}
          </div>

          {/* 7. Document Formatting and Page-Count Controls */}
          <DocumentToolbar
            config={docConfig}
            onConfigChange={(newCfg) => setDocConfig((prev) => ({ ...prev, ...newCfg }))}
            onAutoBalance={handleAutoBalance}
            zoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* 8. Word-Style A4 Canvas Page Preview */}
          <DocumentWorkspace
            config={docConfig}
            pages={pages}
            paginationAnalysis={paginationAnalysis}
            onPageChange={handlePageContentChange}
            onAddPage={handleAddPage}
            onRemovePage={handleRemovePage}
            zoomLevel={zoomLevel}
            viewMode={viewMode}
            pageRefs={pageRefs}
          />

          {/* 9. Download PDF, Print, and Share Buttons */}
          <ExportActionBar
            pageElements={validPageElements}
            documentTitle={docConfig.title}
            pageCount={pages.length}
            onEditDocument={() => {
              const firstPage = pageRefs.current[0];
              firstPage?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Fluent Scribe AI · Multilingual Voice Translator, Word Document Studio & Verified PDF Maker
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Telugu · Tamil · Kannada · Hindi · Japanese · English</span>
            <span>·</span>
            <span>A4 Print Standards</span>
          </div>
        </div>
      </footer>

      {/* Sample Documents Modal */}
      <SampleTextModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectSample={handleSelectSample}
      />
    </div>
  );
}
