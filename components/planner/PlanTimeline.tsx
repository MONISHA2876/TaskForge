"use client";

import { motion } from "motion/react";
import {
  BookOpen,
  Briefcase,
  CircleCheck,
  Code,
  Coffee,
  Dumbbell,
  FileText,
  FlaskConical,
  GraduationCap,
  Heart,
  PenLine,
  Pencil,
  Repeat,
  Rocket,
  ShoppingCart,
  Smile,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { row } from "@/components/styles/styles";

export interface TimelineItem {
  id: string;
  title: string;
  taskType: string;
  priority: "High" | "Medium" | "Low";
  period: "Morning" | "Afternoon" | "Evening" | "Night";
  time: string;
  duration: string;
  completed: boolean;
  aiNote: string;
}

export interface TimelineDay {
  day: string;
  date: string;
  items: TimelineItem[];
}

interface PlanTimelineProps {
  days: TimelineDay[];
}

/* ------------------------------------------------------------------ */
/* Styling maps                                                         */
/* ------------------------------------------------------------------ */

const TASK_STYLES: Record<string, { icon: LucideIcon; color: string }> = {
  study: { icon: GraduationCap, color: "#6366F1" },
  revision: { icon: Repeat, color: "#F59E0B" },
  practice: { icon: Pencil, color: "#10B981" },
  assignment: { icon: FileText, color: "#EC4899" },
  project: { icon: Rocket, color: "#8B5CF6" },
  coding: { icon: Code, color: "#3B82F6" },
  meeting: { icon: Users, color: "#0EA5E9" },
  reading: { icon: BookOpen, color: "#14B8A6" },
  research: { icon: FlaskConical, color: "#A78BFA" },
  writing: { icon: PenLine, color: "#F97316" },
  exercise: { icon: Dumbbell, color: "#EF4444" },
  work: { icon: Briefcase, color: "#818CF8" },
  break: { icon: Coffee, color: "#9CA3AF" },
  personal: { icon: Smile, color: "#06B6D4" },
  errands: { icon: ShoppingCart, color: "#84CC16" },
  health: { icon: Heart, color: "#F43F5E" },
  other: { icon: CircleCheck, color: "#94A3B8" },
};

const badge = "rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap";

const PRIORITY: Record<TimelineItem["priority"], string> = {
  High: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  Medium: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  Low: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
};

const PERIOD: Record<TimelineItem["period"], string> = {
  Morning: "border-orange-400/25 bg-orange-400/10 text-orange-300",
  Afternoon: "border-sky-400/25 bg-sky-400/10 text-sky-300",
  Evening: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  Night: "border-slate-400/25 bg-slate-400/10 text-slate-300",
};

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export default function PlanTimeline({ days }: PlanTimelineProps) {
  // Running index across all days so the stagger flows top to bottom
  const offsets = days.reduce<number[]>((acc, _day, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + days[i - 1].items.length);
    return acc;
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {days.map((day, dayIdx) => (
        <motion.section
          key={`${day.day}-${day.date}`}
          variants={row}
          custom={Math.min(offsets[dayIdx], 12)}
          aria-label={`Day ${dayIdx + 1}: ${day.day}`}
        >
          {/* Day header */}
          <div className="flex items-center gap-3">
            <span className="size-2 shrink-0 rounded-full bg-[#d9b77a] shadow-[0_0_10px_rgba(217,183,122,0.6)]" />
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-[11px] tracking-[0.14em] text-[#d9b77a] uppercase">
                Day {dayIdx + 1}
              </span>
              <span className="font-serif text-[18px] font-medium text-white">
                {day.day}
              </span>
              <span className="text-[12.5px] text-slate-400">{day.date}</span>
            </div>
          </div>

          {/* Items */}
          <ul className="mt-4 ml-[3px] flex flex-col gap-3 border-l border-white/10 pl-5">
            {day.items.map((item, itemIdx) => {
              const style =
                TASK_STYLES[item.taskType.toLowerCase()] ?? TASK_STYLES.other;
              const Icon = style.icon;

              return (
                <motion.li
                  key={item.id}
                  variants={row}
                  custom={Math.min(offsets[dayIdx] + itemIdx, 12)}
                  className={`relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4 pl-5 transition-colors duration-200 hover:bg-white/[0.055] ${
                    item.completed ? "opacity-60" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-4 left-0 w-1 rounded-r-full"
                    style={{ backgroundColor: style.color }}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${style.color}26`, color: style.color }}
                      >
                        <Icon className="size-[18px] stroke-[1.7]" />
                      </span>
                      <div className="min-w-0">
                        <h3
                          className={`text-[14.5px] leading-snug font-medium ${
                            item.completed ? "text-slate-500 line-through" : "text-white"
                          }`}
                        >
                          {item.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className={`${badge} ${PRIORITY[item.priority]}`}>
                            {item.priority}
                          </span>
                          <span className={`${badge} ${PERIOD[item.period]}`}>
                            {item.period}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="text-[13px] font-medium text-slate-100">
                        {item.time}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-[11px] text-slate-300">
                        {item.duration}
                      </span>
                    </div>
                  </div>

                  {item.aiNote && (
                    <p className="mt-3.5 flex items-start gap-2 border-t border-white/[0.06] pt-3 text-[12px] leading-relaxed text-slate-400 italic">
                      <Sparkles className="mt-0.5 size-3 shrink-0 text-[#d9b77a]" />
                      {item.aiNote}
                    </p>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </motion.section>
      ))}
    </div>
  );
}