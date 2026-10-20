import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Square,
  ArrowRight,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  FileEdit,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import {
  SpeechRecognitionService,
  SpeechStatus,
  SpeechError,
} from '../services/speech';
import { ttsService } from '../services/tts';

interface TranslatorSectionProps {
  sourceLang: string;
  targetLang: string;
  inputText: string;
  translatedText: string;
  isTranslating: boolean;
  translationError: string | null;
  onInputChange: (text: string) => void;
  onTranslatedTextChange: (text: string) => void;
  onTranslate: () => void;
  onClear: () => void;
  onOpenInDocument: () => void;
}

export const TranslatorSection: React.FC<TranslatorSectionProps> = ({
  sourceLang,
  targetLang,
  inputText,
  translatedText,
  isTranslating,
  translationError,
  onInputChange,
  onTranslatedTextChange,
  onTranslate,
  onClear,
  onOpenInDocument,
}) => {
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>('idle');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimText, setInterimText] = useState<string>('');
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedTranslated, setCopiedTranslated] = useState(false);
  const [activeTTS, setActiveTTS] = useState<'source' | 'target' | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<string>('Standard');

  const speechServiceRef = useRef<SpeechRecognitionService | null>(null);

  useEffect(() => {
    speechServiceRef.current = new SpeechRecognitionService();
    return () => {
      speechServiceRef.current?.stopListening();
      ttsService.stop();
    };
  }, []);

  const sourceLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang) || SUPPORTED_LANGUAGES[0];
  const targetLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[5];

  // Speech Recognition handlers
  const handleStartListening = () => {
    setSpeechError(null);
    setTtsError(null);
    ttsService.stop();
    setActiveTTS(null);

    if (!speechServiceRef.current) {
      speechServiceRef.current = new SpeechRecognitionService();
    }

    speechServiceRef.current.startListening(
      sourceLanguage.speechCode,
      (transcript: string, isFinal: boolean) => {
        if (isFinal) {
          onInputChange(
            inputText ? `${inputText.trim()} ${transcript}` : transcript
          );
          setInterimText('');
        } else {
          setInterimText(transcript);
        }
      },
      (err: SpeechError) => {
        setSpeechError(err.message);
      },
      (status: SpeechStatus) => {
        setSpeechStatus(status);
      }
    );
  };

  const handleStopListening = () => {
    speechServiceRef.current?.stopListening();
    setSpeechStatus('stopped');
  };

  const handleRetryListening = () => {
    handleStopListening();
    setTimeout(() => {
      handleStartListening();
    }, 200);
  };

  // TTS Handlers
  const handleSpeak = (text: string, langCode: string, targetType: 'source' | 'target') => {
    setTtsError(null);
    if (activeTTS === targetType) {
      ttsService.stop();
      setActiveTTS(null);
      return;
    }

    setActiveTTS(targetType);
    ttsService.speak(
      targetType,
      text,
      langCode,
      () => setActiveTTS(targetType),
      () => setActiveTTS(null),
      (err) => {
        setActiveTTS(null);
        setTtsError(err);
      }
    );
  };

  const copyToClipboard = (text: string, isOriginal: boolean) => {
    navigator.clipboard.writeText(text);
    if (isOriginal) {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedTranslated(true);
      setTimeout(() => setCopiedTranslated(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 2. Large text input area with microphone button and typing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Source Text Card */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col h-full">
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Source ({sourceLanguage.name})
              </span>
              <span className="text-xs text-slate-400">
                · Speech: {sourceLanguage.speechCode}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {inputText && (
                <>
                  <button
                    onClick={() =>
                      handleSpeak(inputText, sourceLanguage.code, 'source')
                    }
                    className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                      activeTTS === 'source'
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                    title={
                      activeTTS === 'source' ? 'Stop Speaking' : 'Read Aloud'
                    }
                  >
                    {activeTTS === 'source' ? (
                      <Square className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(inputText, true)}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 text-xs transition-colors"
                    title="Copy Source Text"
                  >
                    {copiedOriginal ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={onClear}
                    className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-xs transition-colors"
                    title="Clear Text"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Text Area */}
          <div className="relative flex-1 p-3.5 sm:p-4 min-h-[220px]">
            <textarea
              value={inputText}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={`Type, paste, or tap the microphone to speak naturally in ${sourceLanguage.name} (${sourceLanguage.nativeName})...\n\nFor example, speak Telugu or Hindi and watch words appear in real time.`}
              className={`w-full h-full min-h-[190px] resize-none border-0 p-0 text-slate-800 placeholder:text-slate-400 text-base leading-relaxed focus:outline-none focus:ring-0 ${sourceLanguage.fontClass}`}
            />

            {/* Interim speech recognition indicator */}
            {interimText && (
              <div className="mt-2 p-2 bg-blue-50/70 rounded-md border border-blue-100 text-xs text-blue-800 italic">
                <span className="font-medium mr-1">Hearing:</span> "{interimText}"
              </div>
            )}
          </div>

          {/* Voice Controls Bar */}
          <div className="p-3 bg-slate-50/90 border-t border-slate-100 rounded-b-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {speechStatus !== 'listening' ? (
                <button
                  type="button"
                  onClick={handleStartListening}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 shadow-xs"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Speak in {sourceLanguage.name}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopListening}
                  className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 animate-pulse shadow-xs"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Listening</span>
                </button>
              )}

              {speechStatus === 'listening' && (
                <span className="text-xs text-rose-600 font-medium">
                  Listening in {sourceLanguage.speechCode}...
                </span>
              )}

              {speechStatus === 'stopped' && inputText && (
                <button
                  type="button"
                  onClick={handleRetryListening}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md text-xs font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retry Voice</span>
                </button>
              )}
            </div>

            <div className="text-xs text-slate-400 tabular-nums">
              {inputText.length} characters ·{' '}
              {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words
            </div>
          </div>
        </div>

        {/* 5. Translated Result Card */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col h-full">
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Target Translation ({targetLanguage.name})
              </span>
              <span className="text-xs text-slate-400">
                · {targetLanguage.nativeName}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {translatedText && (
                <>
                  <button
                    onClick={() =>
                      handleSpeak(translatedText, targetLanguage.code, 'target')
                    }
                    className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                      activeTTS === 'target'
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                    title={
                      activeTTS === 'target' ? 'Stop Speaking' : 'Read Aloud'
                    }
                  >
                    {activeTTS === 'target' ? (
                      <Square className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(translatedText, false)}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 text-xs transition-colors"
                    title="Copy Translation"
                  >
                    {copiedTranslated ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Translated Content Area (Editable so user can tweak translation) */}
          <div className="relative flex-1 p-3.5 sm:p-4 min-h-[220px]">
            {isTranslating ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <p className="text-sm font-medium">
                  Translating faithfully to {targetLanguage.name}...
                </p>
                <p className="text-xs text-slate-400">
                  Preserving names, numbers, paragraphs, and tone
                </p>
              </div>
            ) : translatedText ? (
              <textarea
                value={translatedText}
                onChange={(e) => onTranslatedTextChange(e.target.value)}
                placeholder="Translated text will appear here and can be edited directly..."
                className={`w-full h-full min-h-[190px] resize-none border-0 p-0 text-slate-800 text-base leading-relaxed focus:outline-none focus:ring-0 ${targetLanguage.fontClass}`}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12 text-center">
                <FileEdit className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-500">
                  Ready to translate into {targetLanguage.name}
                </p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Type or speak your text on the left, then click Translate.
                  You can edit the result here before opening it in the Word document.
                </p>
              </div>
            )}
          </div>

          {/* Action Footer for Translation */}
          <div className="p-3 bg-slate-50/90 border-t border-slate-100 rounded-b-xl flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              {translatedText ? 'Editable translation' : 'Awaiting translation'}
            </span>

            {/* 6. Open in Document Button */}
            {translatedText && (
              <button
                type="button"
                onClick={onOpenInDocument}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 shadow-xs"
              >
                <span>Open in Document</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Errors or Notices */}
      {speechError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Microphone notice: </span>
            {speechError}
          </div>
        </div>
      )}

      {ttsError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Speech readout notice: </span>
            {ttsError}
          </div>
        </div>
      )}

      {translationError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Translation error: </span>
            {translationError}
          </div>
        </div>
      )}

      {/* 4. Main Translate Button Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500">Tone:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            {['Standard', 'Formal & Legal', 'Business', 'Academic'].map((tone) => (
              <button
                key={tone}
                type="button"
                onClick={() => setSelectedTone(tone)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedTone === tone
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {inputText && (
            <button
              type="button"
              onClick={onClear}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors"
            >
              Clear
            </button>
          )}

          <button
            type="button"
            disabled={!inputText.trim() || isTranslating}
            onClick={onTranslate}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 shadow-xs cursor-pointer disabled:cursor-not-allowed"
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Translating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Translate to {targetLanguage.name}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
