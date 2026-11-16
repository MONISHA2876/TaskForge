"use client";

import { useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { Info, Sparkles } from "lucide-react";
import ChatPrompt from "@/components/planner/ChatPromptSection";
import PlanTimeline from "@/components/planner/PlanTimeline";
import PlanningSummary from "@/components/planner/PlanningSummary";
import SavePlanCard from "@/components/planner/CalendarSyncCard";
import EmptyState from "@/components/planner/EmptyState";
import { GeneratedPlan } from "@/lib/mockPlanner";
import { page, rise } from "@/components/styles/styles";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

export default function PlannerPage() {
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(prompt: string) {
    setIsGenerating(true);
    setPlan(null);
    setError("");

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error(await res.text());
      setPlan(await res.json());
    } catch (err) {
      console.error(err);
      setError("We couldn’t build your plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  const view = isGenerating ? "generating" : plan ? "plan" : "empty";

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-screen bg-[#070d1e] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_70%_45%_at_85%_-10%,rgba(90,125,230,0.12),transparent_70%)]"
        />

        <main>
          <div className="flex flex-col xl:flex-row xl:items-start">
            {/* Left — chat */}
            <section className="border-b border-white/[0.07] px-4 pt-20 pb-8 sm:px-8 xl:sticky xl:top-0 xl:h-screen xl:w-[440px] xl:shrink-0 xl:border-r xl:border-b-0 xl:pt-10">
              <ChatPrompt onGenerate={handleGenerate} isGenerating={isGenerating} />
            </section>

            {/* Right — result */}
            <section className="min-w-0 flex-1 px-4 py-8 sm:px-8 xl:px-10 xl:pt-10">
              {error && (
                <p
                  role="alert"
                  className="mb-6 flex items-center gap-2.5 rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200"
                >
                  <Info className="size-4 shrink-0" />
                  {error}
                </p>
              )}

              <AnimatePresence mode="wait">
                {view === "empty" && (
                  <motion.div key="empty" {...fade}>
                    <EmptyState />
                  </motion.div>
                )}

                {view === "generating" && (
                  <motion.div
                    key="generating"
                    {...fade}
                    className="flex min-h-[420px] flex-col items-center justify-center gap-6"
                  >
                    <div className="relative">
                      <div className="flex size-16 items-center justify-center rounded-2xl border border-[#c9a45c]/40 bg-[#1a1d2b] text-[#e6c78f] shadow-[0_0_32px_rgba(201,164,92,0.2)]">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Sparkles className="size-6" />
                        </motion.div>
                      </div>
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          aria-hidden="true"
                          className="absolute inset-0 rounded-2xl border border-[#d9b77a]/60"
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

                    <div className="text-center" role="status">
                      <h3 className="font-serif text-[20px] font-medium text-white">
                        Building your plan…
                      </h3>
                      <p className="mt-1.5 text-[13px] text-slate-400">
                        Analyzing priorities and optimizing blocks
                      </p>
                    </div>

                    <div className="flex w-64 flex-col gap-2.5" aria-hidden="true">
                      {[100, 75, 88, 60].map((w, i) => (
                        <motion.div
                          key={i}
                          className="h-3 rounded-full bg-gradient-to-r from-white/[0.04] via-white/[0.12] to-white/[0.04] bg-[length:200%_100%]"
                          style={{ width: `${w}%` }}
                          animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {view === "plan" && plan && (
                  <motion.div
                    key="plan"
                    variants={page}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0 }}
                    className="flex max-w-2xl flex-col gap-8 pb-12"
                  >
                    <motion.div
                      variants={rise}
                      className="flex flex-wrap items-center justify-between gap-4"
                    >
                      <div>
                        <h2 className="font-serif text-[26px] leading-tight font-medium text-white">
                          {plan.heading}
                        </h2>
                        <p className="mt-2 flex items-center gap-2 text-[13px] text-slate-400">
                          <span className="size-1.5 rounded-full bg-emerald-400" />
                          Generated just now · AI-optimized
                        </p>
                      </div>
                      <span className="flex items-center gap-1.5 rounded-full border border-[#c9a45c]/50 bg-[#c9a45c]/10 px-3.5 py-1.5 text-[12px] font-medium text-[#f0d9a8]">
                        <Sparkles className="size-3" />
                        {plan.days.length} days planned
                      </span>
                    </motion.div>

                    <motion.div variants={rise}>
                      <PlanTimeline days={plan.days} />
                    </motion.div>

                    <motion.div variants={rise}>
                      <PlanningSummary
                        totalTasks={plan.totalTasks}
                        focusTime={plan.focusTime}
                        breakTime={plan.breakTime}
                        completionEstimate={plan.completionEstimate}
                        productivityScore={plan.productivityScore}
                      />
                    </motion.div>

                    <motion.div variants={rise}>
                      <SavePlanCard plan={plan} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}