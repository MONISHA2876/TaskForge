"use client";

import { motion } from "framer-motion";

const CHIPS = [
  { label: "Plan My Day",       emoji: "📅" },
  { label: "Plan My Week",      emoji: "🗓️" },
  { label: "Study Plan",        emoji: "📚" },
  { label: "Interview Prep",    emoji: "🎯" },
  { label: "Hackathon Sprint",  emoji: "⚡" },
  { label: "Workout Schedule",  emoji: "💪" },
];

const PROMPTS: Record<string, string> = {
  "Plan My Day":       "I want to plan my day. I want to be productive, take regular breaks, and wrap up by 10 PM.",
  "Plan My Week":      "Help me plan my week with deep work sessions, exercise, and personal projects. I work remotely.",
  "Study Plan":        "Create a study plan to cover all my subjects before my exams next week.",
  "Interview Prep":    "I have a software engineering interview tomorrow. Help me prepare: DSA, system design, and behavioral questions.",
  "Hackathon Sprint":  "I'm joining a 24-hour hackathon this weekend. Help me plan the sprint effectively.",
  "Workout Schedule":  "Design a 5-day workout split that balances strength training and cardio.",
};

interface QuickPromptChipsProps {
  onSelect: (prompt: string) => void;
}

export default function QuickPromptChips({ onSelect }: QuickPromptChipsProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {CHIPS.map((chip, i) => (
        <motion.button
          key={chip.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(PROMPTS[chip.label])}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "7px 14px", borderRadius: "99px",
            background: "#ffffff", border: "1px solid #E5E7EB",
            fontSize: "12.5px", fontWeight: 500, color: "#374151",
            cursor: "pointer", whiteSpace: "nowrap",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#A5B4FC";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 3px rgba(79,70,229,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5E7EB";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
          }}
        >
          <span style={{ fontSize: "14px" }}>{chip.emoji}</span>
          {chip.label}
        </motion.button>
      ))}
    </div>
  );
}
