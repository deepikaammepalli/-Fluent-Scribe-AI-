import { PageCountTarget } from '../types';

export interface PaginationAnalysis {
  targetPages: PageCountTarget;
  actualPages: number;
  wordCount: number;
  charCount: number;
  status: 'optimal' | 'underflow' | 'overflow';
  statusMessage: string;
  pages: string[];
}

/**
 * Distributes text across target pages or estimates automatic page count
 */
export function calculatePagination(
  rawText: string,
  targetPages: PageCountTarget,
  fontSize: number = 12,
  lineSpacing: string = '1.5'
): PaginationAnalysis {
  const text = (rawText || '').trim();
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const charCount = text.length;

  // Words per A4 page baseline estimate
  // Adjusted for font size and line spacing
  const baseWordsPerPage = Math.max(
    150,
    Math.round(420 * (12 / fontSize) * (1.5 / parseFloat(lineSpacing)))
  );

  // If text contains explicit page breaks: [page-break] or ---page---
  const manualPages = text
    .split(/(?:---page---|\[page-break\])/i)
    .map((p) => p.trim())
    .filter(Boolean);

  if (manualPages.length > 1 && targetPages === 'auto') {
    return {
      targetPages: 'auto',
      actualPages: manualPages.length,
      wordCount,
      charCount,
      status: 'optimal',
      statusMessage: `Document manually formatted into ${manualPages.length} pages.`,
      pages: manualPages,
    };
  }

  if (targetPages === 'auto') {
    const estimatedCount = Math.max(1, Math.ceil(wordCount / baseWordsPerPage));
    const pages = splitIntoNPages(paragraphs, estimatedCount);
    return {
      targetPages: 'auto',
      actualPages: estimatedCount,
      wordCount,
      charCount,
      status: 'optimal',
      statusMessage: `Auto-formatted into ${estimatedCount} page${estimatedCount > 1 ? 's' : ''} based on font size (${fontSize}pt) and content volume.`,
      pages,
    };
  }

  // Exact target pages (1, 2, 3, or 4)
  const numTarget = targetPages as number;
  const targetCapacity = numTarget * baseWordsPerPage;
  const minLegibleWords = numTarget * 60; // below this, pages will look very empty
  const maxSafeWords = targetCapacity * 1.35; // above this, pages will overflow

  let status: 'optimal' | 'underflow' | 'overflow' = 'optimal';
  let statusMessage = `Content distributed evenly across exactly ${numTarget} A4 pages.`;

  if (wordCount < minLegibleWords && wordCount > 0) {
    status = 'underflow';
    statusMessage = `Content volume (~${wordCount} words) is relatively short for ${numTarget} pages. To fill all pages legibly, consider increasing font size (14pt+), relaxing line spacing (1.5 or 2.0), or adding more sections.`;
  } else if (wordCount > maxSafeWords) {
    status = 'overflow';
    statusMessage = `Content volume (~${wordCount} words) is large for ${numTarget} pages. Text may overflow beyond ${numTarget} pages unless font size is reduced (e.g. 10pt-11pt) or margins set to Narrow.`;
  }

  const pages = splitIntoNPages(paragraphs, numTarget);

  return {
    targetPages,
    actualPages: numTarget,
    wordCount,
    charCount,
    status,
    statusMessage,
    pages,
  };
}

/**
 * Splits paragraphs into exactly N balanced page segments
 */
export function splitIntoNPages(paragraphs: string[], n: number): string[] {
  if (n <= 1 || paragraphs.length === 0) {
    return [paragraphs.join('\n\n') || ''];
  }

  // If we have fewer paragraphs than pages, split long paragraphs by sentence
  let chunks = [...paragraphs];
  if (chunks.length < n) {
    const expanded: string[] = [];
    for (const p of chunks) {
      const sentences = p.split(/(?<=[.?!।॥\n])\s+/).filter(Boolean);
      if (sentences.length > 1 && expanded.length + sentences.length <= n * 2) {
        expanded.push(...sentences);
      } else {
        expanded.push(p);
      }
    }
    if (expanded.length >= n) {
      chunks = expanded;
    }
  }

  // Calculate target length per page
  const totalLength = chunks.reduce((sum, p) => sum + p.length, 0);
  const targetPerChunk = Math.ceil(totalLength / n);

  const result: string[] = [];
  let currentGroup: string[] = [];
  let currentLen = 0;

  for (let i = 0; i < chunks.length; i++) {
    const p = chunks[i];
    const remainingPages = n - result.length;
    const remainingChunks = chunks.length - i;

    // Must start new page if remaining chunks equal remaining pages needed
    if (currentGroup.length > 0 && remainingChunks === remainingPages) {
      result.push(currentGroup.join('\n\n'));
      currentGroup = [p];
      currentLen = p.length;
    } else if (
      currentLen + p.length > targetPerChunk * 1.15 &&
      result.length < n - 1 &&
      currentGroup.length > 0
    ) {
      result.push(currentGroup.join('\n\n'));
      currentGroup = [p];
      currentLen = p.length;
    } else {
      currentGroup.push(p);
      currentLen += p.length;
    }
  }

  if (currentGroup.length > 0) {
    result.push(currentGroup.join('\n\n'));
  }

  // Ensure exactly n pages
  while (result.length < n) {
    result.push(''); // blank page container for user to type or fill
  }

  // If there are more than n pages due to rounding, merge the excess into the last page
  if (result.length > n) {
    const mainPages = result.slice(0, n - 1);
    const lastPageCombined = result.slice(n - 1).join('\n\n');
    mainPages.push(lastPageCombined);
    return mainPages;
  }

  return result;
}
