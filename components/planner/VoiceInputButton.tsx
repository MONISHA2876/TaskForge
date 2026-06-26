"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type VoiceState = "idle" | "listening" | "processing";

const STATE_CONFIG = {
  idle: {
    label: "Voice Input",
    sublabel: "Click to speak",
    color: "#6B7280",
    bg: "bg-white",
    border: "border-[#E5E7EB]",
    textColor: "text-[#374151]",
  },
  listening: {
    label: "Listening...",
    sublabel: "Speak your plan",
    color: "#4F46E5",
    bg: "bg-[#F5F3FF]",
    border: "border-[#C4B5FD]",
    textColor: "text-[#4F46E5]",
  },
  processing: {
    label: "Processing...",
    sublabel: "Transcribing audio",
    color: "#2563EB",
    bg: "bg-[#EFF6FF]",
    border: "border-[#BFDBFE]",
    textColor: "text-[#2563EB]",
  },
};

export default function VoiceInputButton() {
  const [state, setState] = useState<VoiceState>("idle");

  const handleClick = () => {
    if (state === "idle") {
      setState("listening");
      setTimeout(() => setState("processing"), 3000);
      setTimeout(() => setState("idle"), 5000);
    } else {
      setState("idle");
    }
  };

  const cfg = STATE_CONFIG[state];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${cfg.border} ${cfg.bg} transition-all duration-300 w-full group`}
    >
      {/* Mic icon + waveform */}
      <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
        {/* Pulse rings when listening */}
        <AnimatePresence>
          {state === "listening" && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute inset-0 rounded-full border border-[#4F46E5]"
                  initial={{ opacity: 0.6, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.8 + i * 0.4 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${state !== "idle" ? "bg-[#4F46E5]" : "bg-[#F3F4F6] group-hover:bg-[#EEF2FF]"} transition-colors`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="5.5" y="2" width="5" height="7" rx="2.5" fill={state !== "idle" ? "white" : "#6B7280"} />
            <path d="M3 8C3 10.76 5.24 13 8 13C10.76 13 13 10.76 13 8" stroke={state !== "idle" ? "white" : "#6B7280"} strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="8" y1="13" x2="8" y2="15" stroke={state !== "idle" ? "white" : "#6B7280"} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
        <span className={`text-[13px] font-semibold ${cfg.textColor} transition-colors`}>{cfg.label}</span>
        <span className="text-[11px] text-[#9CA3AF]">{cfg.sublabel}</span>
      </div>

      {/* Waveform bars when listening */}
      <AnimatePresence>
        {state === "listening" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-0.5 h-6"
          >
            {[0.6, 1, 0.4, 0.8, 0.3, 0.9, 0.5].map((h, i) => (
              <motion.span
                key={i}
                className="w-0.5 bg-[#4F46E5] rounded-full"
                animate={{ scaleY: [h, 1, h * 0.5, 0.9, h] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
                style={{ height: "100%", transformOrigin: "center" }}
              />
            ))}
          </motion.div>
        )}
        {state === "processing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1 h-1 rounded-full bg-[#2563EB]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {state !== "idle" && (
        <span className="text-[10px] text-[#9CA3AF] font-medium flex-shrink-0">tap to stop</span>
      )}
    </motion.button>
  );
}
