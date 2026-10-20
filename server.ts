import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '25mb' }));

  // Initialize GoogleGenAI SDK instance if API key is provided
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasApiKey: !!apiKey,
      timestamp: new Date().toISOString(),
    });
  });

  // Translation endpoint
  app.post('/api/translate', async (req: Request, res: Response) => {
    const { text, sourceLang, targetLang, tone } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Text to translate is required.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server. Please check the Secrets panel.',
      });
    }

    try {
      const toneInstruction = tone
        ? `Adopt a ${tone} tone suitable for official or business documents.`
        : 'Maintain the natural tone and nuance of the source text.';

      const systemInstruction = `You are Fluent Scribe AI's professional translation engine.
Translate the text faithfully from ${sourceLang || 'the source language'} to ${targetLang || 'the target language'}.
Requirements:
1. Preserve the exact meaning, names of people, places, organizations, technical terms, numbers, dates, and paragraph structures.
2. ${toneInstruction}
3. Preserve all punctuation, lists, bullet points, and blank line breaks.
4. If translating into Indian languages (such as Telugu, Tamil, Kannada, Malayalam, Hindi) or East Asian languages (Japanese, Chinese, Korean), use correct grammatical honorifics, natural collocations, and formal written register.
5. Do NOT include introductory greetings, notes, disclaimer footnotes, markdown code fences (\`\`\`), or explanations. Return ONLY the translated text.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: text,
        config: {
          systemInstruction,
          temperature: 0.2, // low temperature for consistent, accurate translation
        },
      });

      const translatedText = response.text || '';
      return res.json({
        translatedText: translatedText.trim(),
        sourceLang,
        targetLang,
      });
    } catch (err: any) {
      console.error('Translation error:', err);
      return res.status(500).json({
        error: err.message || 'Failed to complete translation. Please try again.',
      });
    }
  });

  // Text-to-Speech endpoint using gemini-3.8-flash-lite-tts
  app.post('/api/tts', async (req: Request, res: Response) => {
    const { text, lang } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required for speech synthesis.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server.',
      });
    }

    try {
      // Trim to maximum ~1200 characters for snappy TTS generation
      const speechInput = text.trim().slice(0, 1200);

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: speechInput,
                speechMetadata: {
                  style: 'Clear, articulate, natural cadence',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error('No audio returned from speech synthesis model.');
      }

      return res.json({
        audio: base64Audio,
        mimeType: 'audio/wav',
      });
    } catch (err: any) {
      console.error('TTS error:', err);
      return res.status(500).json({
        error: err.message || 'TTS generation failed.',
      });
    }
  });

  // Audio transcription endpoint (backup/alternative for speech input)
  app.post('/api/transcribe', async (req: Request, res: Response) => {
    const { audioBase64, mimeType, language } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required for transcription.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server.',
      });
    }

    try {
      const audioPart = {
        inlineData: {
          mimeType: mimeType || 'audio/webm',
          data: audioBase64,
        },
      };

      const langHint = language ? ` The expected language is ${language}.` : '';
      const prompt = `Transcribe the speech in this audio accurately word for word.${langHint} Include proper punctuation and paragraphing. Do not add filler words, guesses, or any extra commentary.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: [audioPart, { text: prompt }] },
      });

      return res.json({
        text: (response.text || '').trim(),
      });
    } catch (err: any) {
      console.error('Transcription error:', err);
      return res.status(500).json({
        error: err.message || 'Transcription failed.',
      });
    }
  });

  // Document formatting assistant (formats raw transcripts into clean sections)
  app.post('/api/format-document', async (req: Request, res: Response) => {
    const { text, targetPages, title } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server.',
      });
    }

    try {
      const prompt = `Organize and structure the following translated content into a professional document layout.
Document Title: ${title || 'Document'}
Target Pages requested by user: ${targetPages || 'Automatic'}

Guidelines:
- Keep ALL original text and meaning verbatim. Do not cut out essential facts or invent details.
- Add clear descriptive section headings (e.g., Executive Summary, Background, Key Discussion, Action Items/Conclusions).
- Break dense run-on blocks into readable paragraphs.
- Return the organized document with clean paragraph breaks and section headers.
- Do NOT use markdown code blocks (\`\`\`). Return clean formatted text with plain section headings.

Content:
${text}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({
        formattedText: (response.text || '').trim(),
      });
    } catch (err: any) {
      console.error('Doc formatting error:', err);
      return res.status(500).json({
        error: err.message || 'Formatting failed.',
      });
    }
  });

  // Vite integration
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fluent Scribe AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
