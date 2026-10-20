/**
 * Speech Recognition and Audio Recording Engine
 * Implements W3C Web Speech API with fallback to MediaRecorder + Gemini Transcription
 */

import { transcribeAudio } from './api';

// Cross-browser SpeechRecognition type definition
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export type SpeechStatus =
  | 'idle'
  | 'requesting-permission'
  | 'listening'
  | 'processing'
  | 'error'
  | 'stopped';

export interface SpeechError {
  type: string;
  message: string;
}

export interface UseSpeechRecognitionOptions {
  speechCode: string; // e.g. 'te-IN'
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: SpeechError) => void;
  onStatusChange?: (status: SpeechStatus) => void;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening = false;
  private speechCode = 'en-US';
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor() {
    const win = typeof window !== 'undefined' ? (window as any) : ({} as any);
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
    }
  }

  public isSupported(): boolean {
    return !!this.recognition || !!(typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia);
  }

  public hasNativeWebSpeech(): boolean {
    return !!this.recognition;
  }

  public startListening(
    speechCode: string,
    onResult: (text: string, isFinal: boolean) => void,
    onError: (err: SpeechError) => void,
    onStatusChange: (status: SpeechStatus) => void
  ) {
    this.speechCode = speechCode;

    if (this.recognition) {
      try {
        this.recognition.lang = speechCode;
        onStatusChange('listening');
        this.isListening = true;

        this.recognition.onstart = () => {
          this.isListening = true;
          onStatusChange('listening');
        };

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript.trim()) {
            onResult(finalTranscript.trim(), true);
          } else if (interimTranscript.trim()) {
            onResult(interimTranscript.trim(), false);
          }
        };

        this.recognition.onerror = (event: any) => {
          let message = 'An error occurred during speech recognition.';
          if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            message = 'Microphone permission was denied. Please allow microphone access in your browser settings to speak.';
          } else if (event.error === 'no-speech') {
            message = 'No speech was detected. Please check your microphone and speak clearly.';
          } else if (event.error === 'network') {
            message = 'Network error encountered during speech recognition. Retrying or switching to recording mode.';
          } else if (event.error === 'audio-capture') {
            message = 'No microphone was found or audio capture failed. Ensure a microphone is connected.';
          }

          onError({ type: event.error, message });
          this.isListening = false;
          onStatusChange('error');
        };

        this.recognition.onend = () => {
          if (this.isListening) {
            // Keep listening if still supposed to be active
            try {
              this.recognition.start();
            } catch {
              this.isListening = false;
              onStatusChange('stopped');
            }
          } else {
            onStatusChange('stopped');
          }
        };

        this.recognition.start();
      } catch (err: any) {
        console.warn('Native speech recognition start failed:', err);
        // Fallback to media recorder
        this.startMediaRecorder(speechCode, onResult, onError, onStatusChange);
      }
    } else {
      // Fallback: MediaRecorder stream + Gemini transcribe
      this.startMediaRecorder(speechCode, onResult, onError, onStatusChange);
    }
  }

  public stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {
        // ignore
      }
    }
  }

  private async startMediaRecorder(
    speechCode: string,
    onResult: (text: string, isFinal: boolean) => void,
    onError: (err: SpeechError) => void,
    onStatusChange: (status: SpeechStatus) => void
  ) {
    if (!navigator.mediaDevices?.getUserMedia) {
      onError({
        type: 'unsupported',
        message: 'Microphone access is not supported on this browser.',
      });
      return;
    }

    try {
      onStatusChange('requesting-permission');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.isListening = true;
      onStatusChange('listening');

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.audioChunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        if (this.audioChunks.length === 0) {
          onStatusChange('stopped');
          return;
        }

        onStatusChange('processing');
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64Data = (reader.result as string).split(',')[1];
            const result = await transcribeAudio(base64Data, 'audio/webm', speechCode);
            if (result.text) {
              onResult(result.text, true);
            }
            onStatusChange('stopped');
          } catch (transcribeErr: any) {
            onError({
              type: 'transcribe_failed',
              message: transcribeErr.message || 'Failed to transcribe recorded audio.',
            });
            onStatusChange('error');
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      this.mediaRecorder.start();
    } catch (err: any) {
      onError({
        type: 'permission_denied',
        message: 'Could not access microphone: ' + (err.message || 'Permission denied'),
      });
      onStatusChange('error');
    }
  }
}
