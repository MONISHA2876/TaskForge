"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, Square, Send, RotateCcw } from "lucide-react";

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscript: (text: string) => void;
}

type RecordState = "idle" | "recording" | "processing" | "done" | "error";

export default function VoiceModal({ isOpen, onClose, onTranscript }: VoiceModalProps) {
  const [state, setState] = useState<RecordState>("idle");
  const [transcript, setTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [bars, setBars] = useState<number[]>(Array(20).fill(4));

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setState("idle");
      setTranscript("");
      setErrorMsg("");
      setSeconds(0);
    }
    return () => cleanup();
  }, [isOpen]);

  function cleanup() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animRef.current) clearInterval(animRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    mediaRef.current = null;
    chunksRef.current = [];
  }

  function startWaveAnimation() {
    animRef.current = setInterval(() => {
      setBars(Array(20).fill(0).map(() => Math.random() * 36 + 4));
    }, 80);
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => void processAudio();

      recorder.start(100);
      setState("recording");
      setSeconds(0);

      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      startWaveAnimation();
    } catch {
      setErrorMsg("Microphone access denied. Please allow microphone permissions.");
      setState("error");
    }
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animRef.current) clearInterval(animRef.current);
    setBars(Array(20).fill(4));
    mediaRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setState("processing");
  }

  async function processAudio() {
    try {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });

      // Convert to base64
      const arrayBuffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      bytes.forEach((b) => (binary += String.fromCharCode(b)));
      const audioBase64 = btoa(binary);

      const res = await fetch("/api/speech-to-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioBase64, mimeType: "audio/webm" }),
      });

      const data = await res.json();

      if (data.transcript) {
        setTranscript(data.transcript);
        setState("done");
      } else {
        setErrorMsg(data.error ?? "Could not transcribe audio. Please try again.");
        setState("error");
      }
    } catch {
      setErrorMsg("Something went wrong during processing.");
      setState("error");
    }
  }

  function handleUseTranscript() {
    if (transcript) {
      onTranscript(transcript);
      onClose();
    }
  }

  function handleRetry() {
    setTranscript("");
    setErrorMsg("");
    setSeconds(0);
    setState("idle");
  }

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              position: "fixed", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 101, width: "460px", maxWidth: "calc(100vw - 32px)",
              background: "#ffffff", borderRadius: "24px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "20px 24px 16px",
              borderBottom: "1px solid #F3F4F6",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "34px", height: "34px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Mic size={16} color="#fff" />
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>Voice Input</p>
                  <p style={{ fontSize: "11px", color: "#9CA3AF" }}>Powered by Google Speech-to-Text</p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: "30px", height: "30px", borderRadius: "8px",
                  background: "#F9FAFB", border: "1px solid #E5E7EB",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={14} color="#6B7280" />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "28px 24px" }}>

              {/* Waveform / status area */}
              <div style={{
                height: "120px", borderRadius: "16px",
                background: state === "recording" ? "#F5F3FF" : "#F9FAFB",
                border: `1.5px solid ${state === "recording" ? "#C4B5FD" : "#E5E7EB"}`,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "12px",
                marginBottom: "24px", transition: "all 0.3s",
                position: "relative", overflow: "hidden",
              }}>
                {state === "idle" && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "28px", marginBottom: "6px" }}>🎙️</div>
                    <p style={{ fontSize: "13px", color: "#6B7280", fontWeight: 500 }}>
                      Click record to start speaking
                    </p>
                    <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "3px" }}>
                      Describe your goals out loud
                    </p>
                  </div>
                )}

                {state === "recording" && (
                  <>
                    {/* Timer */}
                    <p style={{ fontSize: "22px", fontWeight: 700, color: "#4F46E5", fontVariantNumeric: "tabular-nums" }}>
                      {formatTime(seconds)}
                    </p>
                    {/* Waveform bars */}
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", height: "40px" }}>
                      {bars.map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: `${h}px` }}
                          transition={{ duration: 0.08 }}
                          style={{
                            width: "3px", borderRadius: "99px",
                            background: `rgba(79,70,229,${0.4 + (h / 40) * 0.6})`,
                          }}
                        />
                      ))}
                    </div>
                    <p style={{ fontSize: "11px", color: "#7C3AED", fontWeight: 600 }}>
                      Listening...
                    </p>
                  </>
                )}

                {state === "processing" && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "10px" }}>
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4F46E5" }}
                        />
                      ))}
                    </div>
                    <p style={{ fontSize: "13px", color: "#4F46E5", fontWeight: 600 }}>Transcribing audio...</p>
                    <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "3px" }}>This takes a moment</p>
                  </div>
                )}

                {state === "done" && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "28px", marginBottom: "6px" }}>✅</div>
                    <p style={{ fontSize: "13px", color: "#059669", fontWeight: 600 }}>Transcription complete!</p>
                  </div>
                )}

                {state === "error" && (
                  <div style={{ textAlign: "center", padding: "0 20px" }}>
                    <div style={{ fontSize: "28px", marginBottom: "6px" }}>⚠️</div>
                    <p style={{ fontSize: "12px", color: "#DC2626", fontWeight: 500 }}>{errorMsg}</p>
                  </div>
                )}
              </div>

              {/* Transcript preview */}
              <AnimatePresence>
                {state === "done" && transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginBottom: "20px", padding: "14px 16px",
                      background: "#F0FDF4", border: "1px solid #A7F3D0",
                      borderRadius: "12px",
                    }}
                  >
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#059669", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Transcript
                    </p>
                    <p style={{ fontSize: "13.5px", color: "#111827", lineHeight: 1.6 }}>
                      {transcript}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                {state === "idle" && (
                  <button
                    onClick={startRecording}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                      gap: "8px", padding: "13px", borderRadius: "14px",
                      background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                      color: "#fff", border: "none", cursor: "pointer",
                      fontSize: "14px", fontWeight: 700,
                      boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
                    }}
                  >
                    <Mic size={16} />
                    Start Recording
                  </button>
                )}

                {state === "recording" && (
                  <motion.button
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    onClick={stopRecording}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                      gap: "8px", padding: "13px", borderRadius: "14px",
                      background: "#FEF2F2", color: "#DC2626",
                      border: "1.5px solid #FECACA", cursor: "pointer",
                      fontSize: "14px", fontWeight: 700,
                    }}
                  >
                    <Square size={14} fill="#DC2626" />
                    Stop Recording
                  </motion.button>
                )}

                {state === "done" && (
                  <>
                    <button
                      onClick={handleRetry}
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        padding: "12px 18px", borderRadius: "12px",
                        background: "#F9FAFB", color: "#6B7280",
                        border: "1px solid #E5E7EB", cursor: "pointer",
                        fontSize: "13px", fontWeight: 600,
                      }}
                    >
                      <RotateCcw size={14} />
                      Retry
                    </button>
                    <button
                      onClick={handleUseTranscript}
                      style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                        gap: "8px", padding: "13px", borderRadius: "14px",
                        background: "#4F46E5", color: "#fff",
                        border: "none", cursor: "pointer",
                        fontSize: "14px", fontWeight: 700,
                      }}
                    >
                      <Send size={14} />
                      Use This Text
                    </button>
                  </>
                )}

                {state === "error" && (
                  <button
                    onClick={handleRetry}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                      gap: "8px", padding: "13px", borderRadius: "14px",
                      background: "#4F46E5", color: "#fff",
                      border: "none", cursor: "pointer",
                      fontSize: "14px", fontWeight: 700,
                    }}
                  >
                    <RotateCcw size={14} />
                    Try Again
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
