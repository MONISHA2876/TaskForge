"use client";

import { motion } from "motion/react";
import {
  BookOpen,
  Calendar,
  CalendarRange,
  Dumbbell,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { focusRing } from "@/components/styles/styles";

const CHIPS: { label: string; icon: LucideIcon; prompt: string }[] = [
  {
    label: "Plan My Day",
    icon: Calendar,
    prompt:
      "I want to plan my day. I want to be productive, take regular breaks, and wrap up by 10 PM.",
  },
  {
    label: "Plan My Week",
    icon: CalendarRange,
    prompt:
      "Help me plan my week with deep work sessions, exercise, and personal projects. I work remotely.",
  },
  {
    label: "Study Plan",
    icon: BookOpen,
    prompt: "Create a study plan to cover all my subjects before my exams next week.",
  },
  {
    label: "Interview Prep",
    icon: Target,
    prompt:
      "I have a software engineering interview tomorrow. Help me prepare: DSA, system design, and behavioral questions.",
  },
  {
    label: "Hackathon Sprint",
    icon: Zap,
    prompt:
      "I'm joining a 24-hour hackathon this weekend. Help me plan the sprint effectively.",
  },
  {
    label: "Workout Schedule",
    icon: Dumbbell,
    prompt: "Design a 5-day workout split that balances strength training and cardio.",
  },
];

interface QuickPromptChipsProps {
  onSelect: (prompt: string) => void;
}

export default function QuickPromptChips({ onSelect }: QuickPromptChipsProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {CHIPS.map(({ label, icon: Icon, prompt }, i) => (
        <motion.button
          key={label}
          type="button"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(prompt)}
          className={`flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-[12.5px] font-medium whitespace-nowrap text-slate-200 transition-colors hover:border-[#c9a45c]/60 hover:bg-[#c9a45c]/10 hover:text-white ${focusRing}`}
        >
          <Icon className="size-3.5 text-[#d9b77a]" />
          {label}
        </motion.button>
      ))}
    </div>
  );
}