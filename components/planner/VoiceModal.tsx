"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { LoaderCircle, Mic, RotateCcw, Send, Square, X } from "lucide-react";
import { blobToBase64 } from "./utils";
import { card, focusRing } from "@/components/styles/styles";

type Phase = "starting" | "recording" | "processing" | "done" | "error";

const BAR_COUNT = 24;
const MAX_SECONDS = 120;
const MIME_CANDIDATES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];

const pickMime = () =>
  typeof MediaRecorder === "undefined"
    ? ""
    : (MIME_CANDIDATES.find((t) => MediaRecorder.isTypeSupported(t)) ?? "");

const formatTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/* ------------------------------------------------------------------ */
/* Panel — mounts fresh on every open and starts recording right away   */
/* ------------------------------------------------------------------ */

interface PanelProps {
  onClose: () => void;
  onTranscript: (text: string) => void;
}

function VoicePanel({ onClose, onTranscript }: PanelProps) {
  const [phase, setPhase] = useState<Phase>("starting");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(0);

  const runRef = useRef(0); // invalidates stale async work (retry / close / StrictMode)
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef(0);
  const timerRef = useRef(0);
  const maxRef = useRef(0);
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);

  /** Stop mic, meter and timers (leaves the recorder so it can flush its last chunk) */
  function stopCapture() {
    cancelAnimationFrame(rafRef.current);
    window.clearInterval(timerRef.current);
    window.clearTimeout(maxRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void audioCtxRef.current?.close();
    audioCtxRef.current = null;
  }

  /** Full teardown, discarding any recording in progress */
  function release() {
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") {
      rec.onstop = null;
      rec.stop();
    }
    recorderRef.current = null;
    stopCapture();
  }

  function fail(message: string) {
    setError(message);
    setPhase("error");
  }

  async function start() {
    const run = ++runRef.current;
    release();
    setPhase("starting");
    setError("");
    setTranscript("");
    setSeconds(0);

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      fail("Voice input isn’t supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (run !== runRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;

      const mime = pickMime();
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => void transcribe(run, recorder.mimeType || mime);
      recorder.start(250);
      recorderRef.current = recorder;

      // Live level meter — drives the bars directly (no React re-renders)
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      void ctx.resume();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        barsRef.current.forEach((el, i) => {
          if (!el) return;
          const level = data[Math.floor((i * data.length) / BAR_COUNT)] / 255;
          el.style.transform = `scaleY(${0.12 + level * 0.88})`;
        });
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();

      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
      maxRef.current = window.setTimeout(stop, MAX_SECONDS * 1000);
      setPhase("recording");
    } catch (err) {
      if (run !== runRef.current) return;
      fail(
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Microphone access was blocked. Allow it in your browser settings and try again."
          : "Couldn’t start recording. Check your microphone and try again.",
      );
    }
  }

  function stop() {
    const rec = recorderRef.current;
    if (!rec || rec.state === "inactive") return;
    setPhase("processing");
    rec.stop();
    stopCapture();
  }

  async function transcribe(run: number, mime: string) {
    try {
      const type = mime || "audio/webm";
      const blob = new Blob(chunksRef.current, { type });
      if (!blob.size) throw new Error("empty recording");

      const res = await fetch("/api/speech-to-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64: await blobToBase64(blob),
          mimeType: type.split(";")[0],
        }),
      });
      const data = await res.json();
      if (run !== runRef.current) return;

      if (data.transcript) {
        setTranscript(data.transcript);
        setPhase("done");
      } else {
        fail(data.error ?? "We couldn’t make out any speech. Please try again.");
      }
    } catch {
      if (run === runRef.current) fail("Something went wrong while transcribing. Please try again.");
    }
  }

  // Start on open, clean up on close
  useEffect(() => {
    void start();
    return () => {
      runRef.current++;
      release();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escape closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function confirmTranscript() {
    const text = transcript.trim();
    if (!text) return;
    onTranscript(text);
    onClose();
  }

  const recording = phase === "recording";
  const busy = phase === "starting" || phase === "processing";

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Voice input"
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`${card} relative w-full max-w-[420px] overflow-hidden bg-[#0a1228] shadow-2xl shadow-black/50`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl border border-[#c9a45c]/40 bg-[#1a1d2b] text-[#e6c78f]">
              <Mic className="size-4" />
            </span>
            <div>
              <p className="font-serif text-[16px] leading-tight font-medium text-white">
                Voice input
              </p>
              <p className="mt-0.5 text-[11.5px] text-slate-400">
                Powered by Google Speech-to-Text
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.07] hover:text-white ${focusRing}`}
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-8">
          {phase === "done" ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label
                htmlFor="voice-transcript"
                className="text-[12px] text-slate-400"
              >
                Transcript — edit if needed
              </label>
              <textarea
                id="voice-transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={5}
                autoFocus
                className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-[13.5px] leading-[1.6] text-white outline-none focus:border-[#d9b77a]/70"
              />
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => void start()}
                  className={`flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-[13px] font-medium text-slate-200 transition-colors hover:bg-white/[0.06] hover:text-white ${focusRing}`}
                >
                  <RotateCcw className="size-3.5" />
                  Re-record
                </button>
                <button
                  type="button"
                  onClick={confirmTranscript}
                  disabled={!transcript.trim()}
                  className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ecd5a5] via-[#e0bf86] to-[#c9a45c] text-[13.5px] font-semibold text-[#1c1406] transition-[filter] hover:brightness-110 disabled:opacity-40 ${focusRing}`}
                >
                  <Send className="size-3.5" />
                  Use this text
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center">
              {/* Orb */}
              <div className="relative flex size-24 items-center justify-center">
                {recording &&
                  [0, 1].map((i) => (
                    <motion.span
                      key={i}
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-[#d9b77a]/50"
                      initial={{ opacity: 0.5, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.7 }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        delay: i * 0.9,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                <motion.button
                  type="button"
                  onClick={recording ? stop : phase === "error" ? () => void start() : undefined}
                  disabled={busy}
                  whileHover={!busy ? { scale: 1.05 } : undefined}
                  whileTap={!busy ? { scale: 0.95 } : undefined}
                  aria-label={
                    recording ? "Stop recording" : phase === "error" ? "Try again" : "Please wait"
                  }
                  className={`relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-[#ecd5a5] to-[#c9a45c] text-[#1c1406] shadow-[0_8px_28px_rgba(201,164,92,0.3)] disabled:opacity-70 ${focusRing}`}
                >
                  {busy ? (
                    <LoaderCircle className="size-7 animate-spin" />
                  ) : recording ? (
                    <Square className="size-6 fill-current" />
                  ) : (
                    <RotateCcw className="size-6" />
                  )}
                </motion.button>
              </div>

              {/* Level meter */}
              <div
                aria-hidden="true"
                className={`mt-6 flex h-10 items-center justify-center gap-[3px] transition-opacity ${
                  recording ? "opacity-100" : "opacity-0"
                }`}
              >
                {Array.from({ length: BAR_COUNT }, (_, i) => (
                  <span
                    key={i}
                    ref={(el) => {
                      barsRef.current[i] = el;
                    }}
                    className="h-full w-[3px] origin-center rounded-full bg-[#d9b77a] transition-transform duration-75"
                    style={{ transform: "scaleY(0.12)" }}
                  />
                ))}
              </div>

              {/* Status */}
              <div role="status" aria-live="polite" className="mt-3 text-center">
                {phase === "starting" && (
                  <p className="text-[13px] text-slate-300">Waiting for your microphone…</p>
                )}
                {recording && (
                  <>
                    <p className="font-serif text-[26px] leading-none text-white tabular-nums">
                      {formatTime(seconds)}
                    </p>
                    <p className="mt-2 text-[12.5px] text-slate-400">
                      Listening… tap the button to finish
                    </p>
                  </>
                )}
                {phase === "processing" && (
                  <p className="text-[13px] text-[#ecd5a5]">Transcribing your audio…</p>
                )}
                {phase === "error" && (
                  <p className="max-w-[300px] text-[13px] leading-relaxed text-rose-300">
                    {error}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/* Public component                                                     */
/* ------------------------------------------------------------------ */

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscript: (text: string) => void;
}

export default function VoiceModal({ isOpen, onClose, onTranscript }: VoiceModalProps) {
  return (
    <AnimatePresence>
      {isOpen && <VoicePanel key="voice" onClose={onClose} onTranscript={onTranscript} />}
    </AnimatePresence>
  );
}