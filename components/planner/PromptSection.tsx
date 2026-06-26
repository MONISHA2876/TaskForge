"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuickPromptChips from "./QuickPromptChips";
import VoiceInputButton from "./VoiceInputButton";
import ImageUploadCard from "./ImageUploadCard";

const PLACEHOLDER_EXAMPLES = [
  "I have college from 9 AM to 5 PM today…",
  "I have an ML assignment due this Friday…",
  "I have a technical interview tomorrow morning…",
  "I want to build a hackathon project this weekend…",
  "Help me plan a focused study session for DSA…",
];

interface PromptSectionProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export default function PromptSection({
  onGenerate,
  isGenerating,
}: PromptSectionProps) {
  const [prompt, setPrompt] = useState("");
  const [placeholderIndex] = useState(() =>
    Math.floor(Math.random() * PLACEHOLDER_EXAMPLES.length),
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt.trim());
  };

  const handleChipSelect = (label: string) => {
    const prompts: Record<string, string> = {
      "Plan My Day":
        "Plan my day. I want to be productive, take regular breaks, and wrap up by 10 PM.",
      "Plan My Week":
        "Plan my week with a mix of deep work, exercise, and personal projects. I work remotely.",
      "Study Plan":
        "Create a study plan to cover all my subjects before my exams next week.",
      "Interview Prep":
        "I have a software engineering interview tomorrow. Help me prepare: DSA, system design, and behaviorals.",
      "Hackathon Sprint":
        "I'm joining a 24-hour hackathon this weekend. Help me plan the sprint effectively.",
      "Workout Schedule":
        "Design a 5-day workout split that balances strength training and cardio.",
    };
    const val = prompts[label] || label;
    setPrompt(val);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  };

  const charCount = prompt.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6 h-full"
    >
      {/* Heading */}
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-[28px] font-semibold text-[#111827] tracking-tight leading-tight"
        >
          What would you like
          <br />
          to accomplish?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="text-[14px] text-[#6B7280] mt-2"
        >
          Describe your goals and I will build a personalized plan.
        </motion.p>
      </div>

      {/* Quick chips */}
      <QuickPromptChips onSelect={handleChipSelect} />

      {/* Main textarea */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="relative flex-1"
      >
        <div
          className={`relative rounded-2xl border transition-all duration-200 bg-white shadow-sm ${
            prompt.length > 0
              ? "border-[#4F46E5] shadow-[0_0_0_3px_rgba(79,70,229,0.08)]"
              : "border-[#E5E7EB] hover:border-[#D1D5DB]"
          }`}
        >
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDER_EXAMPLES[placeholderIndex]}
            rows={7}
            className="w-full resize-none rounded-2xl px-4 pt-4 pb-12 text-[14px] text-[#111827] placeholder:text-[#D1D5DB] outline-none bg-transparent leading-relaxed"
          />

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 border-t border-[#F3F4F6]">
            <span className="text-[11px] text-[#D1D5DB] font-mono">
              {charCount > 0 ? `${charCount} chars` : "⌘↵ to generate"}
            </span>
            <div className="flex items-center gap-1.5">
              {prompt.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setPrompt("")}
                  className="text-[11px] text-[#9CA3AF] hover:text-[#6B7280] transition-colors px-2 py-1 rounded-lg hover:bg-[#F3F4F6]"
                >
                  Clear
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Voice + Image row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="grid grid-cols-2 gap-3"
      >
        <VoiceInputButton />
        <ImageUploadCard />
      </motion.div>

      {/* Generate button */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.38 }}
      >
        <motion.button
          whileHover={
            !isGenerating && prompt.trim() ? { scale: 1.015, y: -1 } : {}
          }
          whileTap={!isGenerating && prompt.trim() ? { scale: 0.985 } : {}}
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className={`w-full py-4 rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2.5 transition-all duration-200 shadow-sm ${
            prompt.trim() && !isGenerating
              ? "bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-[0_4px_16px_rgba(79,70,229,0.25)]"
              : "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
          }`}
        >
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5"
              >
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-white"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                <span>Building your plan...</span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1L10.39 5.26L15 6.18L11.5 9.59L12.22 14.18L8 12L3.78 14.18L4.5 9.59L1 6.18L5.61 5.26L8 1Z"
                    fill="currentColor"
                  />
                </svg>
                Generate Plan
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
