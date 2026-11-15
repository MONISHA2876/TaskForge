"use client";

import { motion, type Variants } from "motion/react";
import {
  ArrowRight,
  ChartColumn,
  Check,
  Flame,
  Hourglass,
  type LucideIcon,
} from "lucide-react";
import { useTaskContext } from "@/lib/task-context";
import { getProductivitySummary } from "@/lib/utils";
import { card, rise } from "@/components/styles/styles"


/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

type Stat = {
  icon: LucideIcon;
  value: string;
  label: string;
  delta?: string;
};

type StatCardsProps = {
  streakDays?: number;
  deltas?: { tasks?: string; focus?: string };
};

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export default function StatCards({ streakDays, deltas }: StatCardsProps) {
  const { plans, taskState } = useTaskContext();
  const summary = getProductivitySummary(plans, taskState);

  const completed = Number(summary.completedTasks) || 0;
  const pending = Number(summary.pendingTasks) || 0;
  const total = completed + pending;

  const stats: Stat[] = [
    {
      icon: Check,
      value: `${completed} / ${total}`,
      label: "Tasks Completed",
      delta: deltas?.tasks,
    },
    {
      icon: Hourglass,
      value: String(summary.focusTime),
      label: "Focus Time",
      delta: deltas?.focus,
    },
    {
      icon: ChartColumn,
      value: `${summary.productivityScore}%`,
      label: "Productivity Score",
    },
    {
      icon: Flame,
      value:
        streakDays === undefined
          ? "—"
          : `${streakDays} ${streakDays === 1 ? "day" : "days"}`,
      label: "Streak",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ icon: Icon, value, label, delta }) => {
        const negative = delta?.trim().startsWith("-");
        return (
          <motion.div
            key={label}
            variants={rise}
            whileHover={{ y: -2 }}
            className={`${card} flex items-center gap-4 px-5 py-5`}
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-slate-100 ring-1 ring-white/[0.06]">
              <Icon className="size-5 stroke-[1.5]" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="font-serif text-[22px] leading-none font-medium text-white">
                {value}
              </p>
              <p className="mt-2 truncate text-[13px] text-slate-400">{label}</p>
            </div>

            {delta && (
              <span
                className={[
                  "flex items-center gap-0.5 self-start pt-0.5 text-[12px] font-medium",
                  negative ? "text-rose-400" : "text-emerald-400",
                ].join(" ")}
              >
                <ArrowRight
                  className={`size-3 ${negative ? "rotate-90" : "-rotate-90"}`}
                />
                {delta.replace(/^[+-]/, "")}
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
