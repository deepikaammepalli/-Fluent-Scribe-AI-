export interface TranslationResponse {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  error?: string;
}

export async function translateText(params: {
  text: string;
  sourceLang: string;
  targetLang: string;
  tone?: string;
}): Promise<TranslationResponse> {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Translation failed with status: ${res.status}`);
  }

  return res.json();
}

export async function synthesizeSpeech(text: string, lang: string): Promise<{ audio: string; mimeType: string }> {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, lang }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Speech synthesis failed with status: ${res.status}`);
  }

  return res.json();
}

export async function transcribeAudio(audioBase64: string, mimeType: string, language?: string): Promise<{ text: string }> {
  const res = await fetch('/api/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioBase64, mimeType, language }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Transcription failed with status: ${res.status}`);
  }

  return res.json();
}

export async function formatDocumentAI(params: {
  text: string;
  targetPages?: string | number;
  title?: string;
}): Promise<{ formattedText: string }> {
  const res = await fetch('/api/format-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Document formatting failed with status: ${res.status}`);
  }

  return res.json();
}
