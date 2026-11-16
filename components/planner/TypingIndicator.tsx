"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-label="Forge AI is typing"
      className="flex items-end gap-2.5"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#c9a45c]/30 bg-[#1a1d2b] text-[#e6c78f]">
        <Sparkles className="size-3.5" />
      </span>

      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.05] px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-[#d9b77a]"
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
}