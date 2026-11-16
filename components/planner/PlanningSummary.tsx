"use client";

import { motion } from "motion/react";
import { CalendarCheck, Coffee, ListChecks, Target, type LucideIcon } from "lucide-react";
import { card, row } from "@/components/styles/styles";

interface PlanningSummaryProps {
  totalTasks: number;
  focusTime: string;
  breakTime: string;
  completionEstimate: string;
  productivityScore: number;
}

function ScoreRing({ score }: { score: number }) {
  const value = Math.max(0, Math.min(100, score));
  const low = value < 60;

  return (
    <div
      className="relative size-16"
      role="img"
      aria-label={`Productivity score ${value} out of 100`}
    >
      <svg viewBox="0 0 56 56" className="size-full -rotate-90">
        <defs>
          <linearGradient id="ps-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0dcae" />
            <stop offset="1" stopColor="#c9a45c" />
          </linearGradient>
        </defs>
        <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <motion.circle
          cx="28"
          cy="28"
          r="22"
          fill="none"
          stroke={low ? "#fb7185" : "url(#ps-ring)"}
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: value / 100 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-[16px] leading-none text-white">{value}</span>
        <span className="mt-0.5 text-[9px] text-slate-400">/ 100</span>
      </div>
    </div>
  );
}

export default function PlanningSummary({
  totalTasks,
  focusTime,
  breakTime,
  completionEstimate,
  productivityScore,
}: PlanningSummaryProps) {
  const stats: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: ListChecks, label: "Total blocks", value: String(totalTasks) },
    { icon: Target, label: "Focus time", value: focusTime },
    { icon: Coffee, label: "Break time", value: breakTime },
    { icon: CalendarCheck, label: "Done by", value: completionEstimate },
  ];

  return (
    <section className={`${card} p-6`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-[17px] font-medium text-white">
            Planning Summary
          </h3>
          <p className="mt-1 text-[12.5px] text-slate-400">
            AI-optimized schedule analysis
          </p>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <ScoreRing score={productivityScore} />
          <span className="text-[11px] text-slate-400">Productivity</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            variants={row}
            custom={i}
            className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3.5"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#c9a45c]/10 text-[#d9b77a]">
              <Icon className="size-[18px] stroke-[1.6]" />
            </span>
            <div className="min-w-0">
              <p className="text-[11.5px] text-slate-400">{label}</p>
              <p className="mt-0.5 truncate font-serif text-[16px] leading-tight text-white">
                {value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}