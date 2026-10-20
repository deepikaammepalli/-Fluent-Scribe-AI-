import { synthesizeSpeech } from './api';

export interface TTSState {
  isPlaying: boolean;
  activeId: string | null;
  error: string | null;
}

class TTSService {
  private currentAudio: HTMLAudioElement | null = null;
  private isBrowserSpeaking = false;

  public async speak(
    id: string,
    text: string,
    langCode: string,
    onStart: () => void,
    onEnd: () => void,
    onError: (err: string) => void
  ) {
    this.stop();

    if (!text || !text.trim()) {
      onError('No text provided to read aloud.');
      return;
    }

    // Strategy 1: Check if browser SpeechSynthesis has a voice for this language
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      // Wait for voices if needed
      let voices = synth.getVoices();
      if (voices.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        voices = synth.getVoices();
      }

      // Find voice matching language prefix (e.g. 'te', 'hi', 'ja')
      const targetPrefix = langCode.toLowerCase().split('-')[0];
      const matchedVoice = voices.find((v) =>
        v.lang.toLowerCase().startsWith(targetPrefix)
      );

      if (matchedVoice) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
        utterance.rate = 0.95;

        utterance.onstart = () => {
          this.isBrowserSpeaking = true;
          onStart();
        };

        utterance.onend = () => {
          this.isBrowserSpeaking = false;
          onEnd();
        };

        utterance.onerror = (e) => {
          this.isBrowserSpeaking = false;
          console.warn('Browser TTS error, trying server TTS fallback:', e);
          this.fallbackServerTTS(text, langCode, onStart, onEnd, onError);
        };

        try {
          synth.cancel();
          synth.speak(utterance);
          return;
        } catch {
          // fallback
        }
      }
    }

    // Strategy 2: Server-side Gemini TTS fallback (gemini-3.8-flash-lite-tts)
    await this.fallbackServerTTS(text, langCode, onStart, onEnd, onError);
  }

  private async fallbackServerTTS(
    text: string,
    langCode: string,
    onStart: () => void,
    onEnd: () => void,
    onError: (err: string) => void
  ) {
    try {
      const data = await synthesizeSpeech(text, langCode);
      if (!data.audio) {
        onError(`No speech voice available for ${langCode} on this device.`);
        return;
      }

      const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audio}`;
      this.currentAudio = new Audio(audioSrc);

      this.currentAudio.onplay = () => onStart();
      this.currentAudio.onended = () => onEnd();
      this.currentAudio.onerror = () => {
        onError('Audio playback error occurred.');
      };

      await this.currentAudio.play();
    } catch (err: any) {
      onError(
        err.message || `No voice is currently installed for ${langCode} on your browser, and server synthesis was unable to process it.`
      );
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
      } catch (e) {
        // ignore
      }
    }
    this.isBrowserSpeaking = false;
  }
}

export const ttsService = new TTSService();
