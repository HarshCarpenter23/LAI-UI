import { useState, useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export type MicState = "idle" | "listening" | "error" | "unsupported";

interface UseSpeechRecognitionOptions {
  onTranscript: (text: string) => void;
  onEnd?: () => void;
  language?: string;
}

interface UseSpeechRecognitionReturn {
  micState: MicState;
  errorMessage: string | null;
  isSupported: boolean;
  toggleListening: (currentText?: string) => void;
}

export function useSpeechRecognition({
  onTranscript,
  onEnd,
  language = "en-US",
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
  const [micState, setMicState]         = useState<MicState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef  = useRef<InstanceType<typeof SpeechRecognition> | null>(null);
  const finalizedRef    = useRef("");   // all confirmed phrases this session
  const baseTextRef     = useRef("");   // text already in box before mic started
  const shouldRestartRef = useRef(false); // true = user hasn't stopped, keep going
  const silenceTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // How long (ms) to keep listening after the user goes silent before auto-stop
  // 8 seconds — enough time to think and continue speaking
  const SILENCE_TIMEOUT_MS = 8000;

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  // ── Clear silence timer ───────────────────────────────────────────────────
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // ── Reset silence timer — called every time speech is detected ────────────
  const resetSilenceTimer = useCallback((stopFn: () => void) => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      // Auto-stop after SILENCE_TIMEOUT_MS of no speech
      stopFn();
    }, SILENCE_TIMEOUT_MS);
  }, [clearSilenceTimer]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearSilenceTimer();
      shouldRestartRef.current = false;
      recognitionRef.current?.abort();
    };
  }, [clearSilenceTimer]);

  // ── Build & attach a recognition instance ────────────────────────────────
  const buildAndStart = useCallback(() => {
    if (!isSupported) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();

    recognition.lang            = language;
    recognition.interimResults  = true;
    recognition.maxAlternatives = 1;
    // continuous = false intentionally — avoids cumulative result bug.
    // We manually restart on `onend` to simulate continuous listening
    // while keeping each session's results clean (resultIndex always 0-based).
    recognition.continuous      = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Reset silence timer — user is speaking, don't auto-stop yet
      resetSilenceTimer(() => {
        shouldRestartRef.current = false;
        recognitionRef.current?.stop();
        setMicState("idle");
        onEnd?.();
      });

      let interim = "";
      let final   = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) {
          final += r[0].transcript;
        } else {
          interim += r[0].transcript;
        }
      }

      if (final) {
        // Append with space only if there's already content
        finalizedRef.current +=
          (finalizedRef.current ? " " : "") + final.trim();
        interim = "";
      }

      // Compose full text and push to parent
      const parts = [
        baseTextRef.current,
        finalizedRef.current,
        interim,
      ].map((s) => s.trim()).filter(Boolean);

      onTranscript(parts.join(" "));
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // "aborted" = we called .abort() manually — not a real error
      if (event.error === "aborted") return;
      // "no-speech" = silence timeout hit inside the browser engine —
      // we handle this via our own silence timer + manual restart, so just ignore
      if (event.error === "no-speech") return;

      const messages: Record<string, string> = {
        "not-allowed":         "Microphone access denied. Please allow microphone permission.",
        "network":             "Network error. Check your connection.",
        "audio-capture":       "No microphone found.",
        "service-not-allowed": "Speech service not allowed.",
      };
      setErrorMessage(messages[event.error] ?? `Error: ${event.error}`);
      setMicState("error");
      shouldRestartRef.current = false;
      clearSilenceTimer();
    };

    recognition.onend = () => {
      // If user hasn't explicitly stopped → restart to keep listening
      if (shouldRestartRef.current) {
        try {
          const nextRecognition = buildAndStart();
          if (nextRecognition) recognitionRef.current = nextRecognition;
        } catch (_) {
          // If restart fails, gracefully stop
          setMicState("idle");
          shouldRestartRef.current = false;
          clearSilenceTimer();
          onEnd?.();
        }
      } else {
        setMicState("idle");
        clearSilenceTimer();
        onEnd?.();
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (_) {
      // Already started — ignore
    }

    return recognition;
  }, [isSupported, language, onTranscript, onEnd, resetSilenceTimer, clearSilenceTimer]);

  // ── Start listening ───────────────────────────────────────────────────────
  const startListening = useCallback((existingText: string) => {
    if (!isSupported) { setMicState("unsupported"); return; }

    // Reset session state
    finalizedRef.current   = "";
    baseTextRef.current    = existingText.trim();
    shouldRestartRef.current = true;

    setErrorMessage(null);
    setMicState("listening");

    // Start silence timer from the beginning too —
    // if user never speaks at all, stop after timeout
    const stopAll = () => {
      shouldRestartRef.current = false;
      recognitionRef.current?.stop();
      setMicState("idle");
      onEnd?.();
    };
    resetSilenceTimer(stopAll);

    buildAndStart();
  }, [isSupported, buildAndStart, resetSilenceTimer, onEnd]);

  // ── Stop listening ────────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;
    clearSilenceTimer();
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setMicState("idle");
    onEnd?.();
  }, [clearSilenceTimer, onEnd]);

  // ── Toggle ────────────────────────────────────────────────────────────────
  const toggleListening = useCallback((currentText = "") => {
    if (micState === "listening") {
      stopListening();
    } else {
      startListening(currentText);
    }
  }, [micState, startListening, stopListening]);

  return { micState, errorMessage, isSupported, toggleListening };
}