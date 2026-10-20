export interface Language {
  code: string;           // ISO code e.g. 'te', 'hi', 'en'
  name: string;           // English name e.g. 'Telugu'
  nativeName: string;     // Native script e.g. 'తెలుగు'
  speechCode: string;     // BCP-47 code e.g. 'te-IN'
  fontClass: string;      // CSS font class e.g. 'font-telugu'
  scriptDirection?: 'ltr' | 'rtl';
}

export type PageCountTarget = 'auto' | 1 | 2 | 3 | 4;

export type DocumentMargin = 'normal' | 'narrow' | 'wide';
export type LineSpacing = '1.0' | '1.15' | '1.5' | '2.0';
export type ParagraphSpacing = 'compact' | 'normal' | 'relaxed';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export interface DocumentConfig {
  title: string;
  author: string;
  date: string;
  fontFamily: string;
  fontSize: number; // in pt (e.g. 11, 12, 14)
  lineSpacing: LineSpacing;
  paragraphSpacing: ParagraphSpacing;
  textAlign: TextAlign;
  margin: DocumentMargin;
  targetPages: PageCountTarget;
  showHeader: boolean;
  showFooter: boolean;
  showPageNumbers: boolean;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
}

export interface DocumentPage {
  pageNumber: number;
  totalEstimate: number;
  content: string;
}

export interface SampleDocument {
  id: string;
  title: string;
  sourceLang: string;
  targetLang: string;
  category: string;
  sourceText: string;
  description: string;
}
