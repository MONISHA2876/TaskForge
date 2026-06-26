"use client";

import { motion } from "framer-motion";

const CHIPS = [
  { label: "Plan My Day", emoji: "🌅" },
  { label: "Plan My Week", emoji: "📅" },
  { label: "Study Plan", emoji: "📚" },
  { label: "Interview Prep", emoji: "🎯" },
  { label: "Hackathon Sprint", emoji: "⚡" },
  { label: "Workout Schedule", emoji: "💪" },
];

interface QuickPromptChipsProps {
  onSelect: (prompt: string) => void;
}

export default function QuickPromptChips({ onSelect }: QuickPromptChipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-wrap gap-2"
    >
      {CHIPS.map((chip, i) => (
        <motion.button
          key={chip.label}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(chip.label)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-[13px] text-[#374151] font-medium hover:border-[#4F46E5] hover:text-[#4F46E5] hover:bg-[#F5F3FF] transition-all duration-200 shadow-sm"
        >
          <span className="text-sm">{chip.emoji}</span>
          {chip.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
