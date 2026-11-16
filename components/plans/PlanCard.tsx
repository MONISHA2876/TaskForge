"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Calendar, Clock, SquareCheckBig, Trash2 } from "lucide-react";
import type { Plan, PlanStats } from "@/types";
import { card, focusRing } from "@/components/styles/styles";

interface PlanCardProps {
  plan: Plan;
  stats: PlanStats;
  onDelete?: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/* Plan-type badge colours (dark theme)                                 */
/* ------------------------------------------------------------------ */

const planTypeBadge: Record<string, string> = {
  Daily: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  Weekly: "border-sky-400/25 bg-sky-400/10 text-sky-300",
  Monthly: "border-violet-400/25 bg-violet-400/10 text-violet-300",
};
const badgeFallback = "border-white/10 bg-white/[0.05] text-slate-200";

/* ------------------------------------------------------------------ */
/* Small pieces                                                         */
/* ------------------------------------------------------------------ */

function ScoreRing({ score }: { score: number }) {
  const value = Math.max(0, Math.min(100, score));
  return (
    <div
      className="relative size-[52px] shrink-0"
      role="img"
      aria-label={`Productivity score ${value}%`}
    >
      <svg viewBox="0 0 48 48" className="size-full -rotate-90">
        <defs>
          <linearGradient id="pc-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0dcae" />
            <stop offset="1" stopColor="#c9a45c" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <motion.circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="url(#pc-ring)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: value / 100 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-serif text-[13px] text-white">
        {value}
      </span>
    </div>
  );
}

function Mountain() {
  return (
    <svg
      viewBox="0 0 250 220"
      preserveAspectRatio="xMidYMid slice"
      className="size-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2b5a" />
          <stop offset="1" stopColor="#0c1530" />
        </linearGradient>
        <linearGradient id="pc-lit" x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f2b78a" />
          <stop offset="0.45" stopColor="#b86f6b" />
          <stop offset="1" stopColor="#2a3a72" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pc-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24376e" />
          <stop offset="1" stopColor="#101c40" />
        </linearGradient>
      </defs>
      <rect width="250" height="220" fill="url(#pc-sky)" />
      <path d="M0 150 L58 98 L108 134 L165 84 L250 142 L250 220 L0 220Z" fill="#15234a" />
      <path d="M10 220 L122 38 L150 72 L176 58 L250 165 L250 220Z" fill="url(#pc-body)" />
      <path d="M122 38 L150 72 L130 98 L108 92 L86 138 L58 182 L10 220 L74 220 L112 150 L130 98Z" fill="url(#pc-lit)" />
      <path d="M122 38 L132 56 L118 64 L110 80 L100 70Z" fill="#fbd9b8" opacity="0.85" />
      <path d="M0 200 Q80 170 160 195 T250 188 L250 220 L0 220Z" fill="#0b1430" opacity="0.8" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export function PlanCard({ plan, stats, onDelete }: PlanCardProps) {
  const badge = planTypeBadge[plan.planType] ?? badgeFallback;
  const pct = Math.max(0, Math.min(100, stats.completionPercentage));

  const meta = [
    {
      icon: SquareCheckBig,
      value: `${stats.completedTasks} / ${stats.totalTasks}`,
      label: "Tasks",
    },
    { icon: Clock, value: plan.focusTime, label: "Focus time" },
    { icon: Calendar, value: plan.completionEstimate, label: "Est. completion" },
  ];

  return (
    <article className={`${card} p-6`}>
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Image */}
        <div className="h-[170px] w-full shrink-0 overflow-hidden rounded-xl border border-white/10 md:h-auto md:min-h-[190px] md:w-[216px]">
          <Mountain />
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-serif text-[19px] leading-snug font-medium text-white">
                {plan.heading}
              </h3>
              <span
                className={`mt-2.5 inline-block rounded-full border px-3 py-0.5 text-[11.5px] font-medium ${badge}`}
              >
                {plan.planType}
              </span>
            </div>
            <ScoreRing score={plan.productivityScore} />
          </div>

          <p className="mt-3 line-clamp-3 max-w-[460px] text-[13px] leading-[1.6] text-slate-400">
            {plan.summary}
          </p>

          {/* Progress */}
          <div className="mt-5 flex items-center gap-4">
            <div
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Plan progress"
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#d8bb84] to-[#f0dcae]"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.6, duration: 1.1, ease: "easeOut" }}
              />
            </div>
            <span className="font-serif text-[16px] text-white">{pct}%</span>
          </div>

          {/* Meta */}
          <div className="mt-5 grid grid-cols-3 divide-x divide-white/[0.08]">
            {meta.map(({ icon: Icon, value, label }, i) => (
              <div
                key={label}
                className={`flex items-center gap-2.5 ${i === 0 ? "pr-3" : "px-3 sm:px-5"}`}
              >
                <Icon className="hidden size-[17px] shrink-0 stroke-[1.5] text-slate-400 sm:block" />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-white">{value}</p>
                  <p className="truncate text-[11.5px] text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next task */}
      {stats.nextTask && (
        <div className="mt-6 rounded-xl border border-[#c9a45c]/25 bg-[#c9a45c]/[0.06] px-4 py-3.5">
          <p className="text-[11.5px] font-medium text-[#ecd5a5]">Next up</p>
          <p className="mt-1.5 text-[14px] font-medium text-white">
            {stats.nextTask.title}
          </p>
          <p className="mt-1 text-[12px] text-slate-400">
            {stats.nextTask.period} · {stats.nextTask.time} ·{" "}
            {stats.nextTask.duration} · {stats.nextTask.taskType}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={`/plans/${plan.id}`}
          className={`flex h-10 min-w-[150px] flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ecd5a5] via-[#e0bf86] to-[#c9a45c] text-[13px] font-semibold text-[#1c1406] shadow-[0_6px_18px_rgba(201,164,92,0.2)] transition-[filter] hover:brightness-110 ${focusRing}`}
        >
          Continue plan
          <ArrowRight className="size-3.5" />
        </Link>

        <Link
          href={`/plans/${plan.id}`}
          className={`flex h-10 items-center rounded-full border border-white/15 px-5 text-[13px] font-medium text-slate-200 transition-colors hover:bg-white/[0.06] hover:text-white ${focusRing}`}
        >
          View details
        </Link>

        <button
          type="button"
          onClick={() => onDelete?.(plan.id)}
          aria-label="Delete plan"
          className={`flex size-10 items-center justify-center rounded-full border border-rose-400/20 text-rose-300 transition-colors hover:bg-rose-400/10 active:scale-95 ${focusRing}`}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </article>
  );
}

export default PlanCard;
