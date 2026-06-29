"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import ChatPrompt from "@/components/planner/ChatPromptSection";
import PlanTimeline from "@/components/planner/PlanTimeline";
import PlanningSummary from "@/components/planner/PlanningSummary";
import SavePlanCard from "@/components/planner/CalendarSyncCard";
import EmptyState from "@/components/planner/EmptyState";
import { GeneratedPlan } from "@/lib/mockPlanner";

export default function PlannerPage() {
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate(prompt: string) {
    setIsGenerating(true);
    setPlan(null);

    const res = await fetch("/api/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      console.error(await res.text());
      setIsGenerating(false);
      return;
    }

    const data = await res.json();
    setPlan(data);
    setIsGenerating(false);
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-[420px] flex-shrink-0 border-r border-[#E5E7EB] overflow-y-auto">
          <div className="p-8 pb-10">
            <ChatPrompt
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {!plan && !isGenerating ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <EmptyState />
              </motion.div>
            ) : isGenerating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center h-full gap-5"
              >
                {/* AI thinking animation */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-[#4F46E5] flex items-center justify-center shadow-lg shadow-indigo-200">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 2L14.5 8L21 9.5L16.5 14L18 21L12 18L6 21L7.5 14L3 9.5L9.5 8L12 2Z"
                          fill="white"
                        />
                      </svg>
                    </motion.div>
                  </div>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-2xl border-2 border-[#4F46E5]"
                      initial={{ opacity: 0.6, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.6 + i * 0.3 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>

                <div className="text-center">
                  <h3 className="text-[16px] font-semibold text-[#111827]">
                    Building your plan…
                  </h3>
                  <p className="text-[13px] text-[#9CA3AF] mt-1">
                    Analyzing priorities and optimizing blocks
                  </p>
                </div>

                {/* Shimmer bars */}
                <div className="flex flex-col gap-2.5 w-64 mt-2">
                  {[100, 75, 88, 60].map((w, i) => (
                    <motion.div
                      key={i}
                      className="h-3 rounded-full bg-gradient-to-r from-[#F3F4F6] via-[#E5E7EB] to-[#F3F4F6]"
                      style={{ width: `${w}%` }}
                      animate={{
                        backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : plan ? (
              <motion.div
                key="plan"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 pb-12 flex flex-col gap-7 max-w-2xl"
              >
                {/* Plan heading */}
                <div className="flex items-center justify-between">
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="text-[20px] font-semibold text-[#111827] tracking-tight"
                    >
                      {plan.heading}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.35, delay: 0.08 }}
                      className="text-[13px] text-[#9CA3AF] mt-1 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      Generated just now · AI-optimized
                    </motion.p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0]"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M6 1L7.2 3.9L10.3 4.4L8.15 6.5L8.7 9.6L6 8.2L3.3 9.6L3.85 6.5L1.7 4.4L4.8 3.9L6 1Z"
                        fill="#10B981"
                      />
                    </svg>
                    <span className="text-[11px] font-semibold text-[#059669]">
                      {plan.days.length} days planned
                    </span>
                  </motion.div>
                </div>

                {/* Timeline */}
                <PlanTimeline days={plan.days} />

                {/* Summary */}
                <PlanningSummary
                  totalTasks={plan.totalTasks}
                  focusTime={plan.focusTime}
                  breakTime={plan.breakTime}
                  completionEstimate={plan.completionEstimate}
                  productivityScore={plan.productivityScore}
                />

                {/* Save plan */}
                <SavePlanCard plan={plan} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
