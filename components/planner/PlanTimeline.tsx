"use client";

import { motion } from "framer-motion";

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

const PERIOD_COLORS: Record<
  TimelineItem["period"],
  {
    dot: string;
    label: string;
  }
> = {
  Morning: {
    dot: "bg-[#FDE68A]",
    label: "text-[#92400E]",
  },
  Afternoon: {
    dot: "bg-[#BFDBFE]",
    label: "text-[#1E40AF]",
  },
  Evening: {
    dot: "bg-[#C7D2FE]",
    label: "text-[#3730A3]",
  },
  Night: {
    dot: "bg-[#A7F3D0]",
    label: "text-[#065F46]",
  },
};

const TASK_STYLES = {
  study: {
    icon: "📚",
    color: "#4F46E5",
    textColor: "#3730A3",
  },

  revision: {
    icon: "🔁",
    color: "#F59E0B",
    textColor: "#92400E",
  },

  practice: {
    icon: "✏️",
    color: "#10B981",
    textColor: "#065F46",
  },

  assignment: {
    icon: "📝",
    color: "#EC4899",
    textColor: "#9D174D",
  },

  project: {
    icon: "🚀",
    color: "#8B5CF6",
    textColor: "#5B21B6",
  },

  coding: {
    icon: "💻",
    color: "#2563EB",
    textColor: "#1E40AF",
  },

  meeting: {
    icon: "👥",
    color: "#0EA5E9",
    textColor: "#075985",
  },

  reading: {
    icon: "📖",
    color: "#14B8A6",
    textColor: "#115E59",
  },

  research: {
    icon: "🔬",
    color: "#7C3AED",
    textColor: "#5B21B6",
  },

  writing: {
    icon: "✍️",
    color: "#F97316",
    textColor: "#9A3412",
  },

  exercise: {
    icon: "🏋️",
    color: "#EF4444",
    textColor: "#991B1B",
  },

  work: {
    icon: "💼",
    color: "#6366F1",
    textColor: "#3730A3",
  },

  break: {
    icon: "☕",
    color: "#9CA3AF",
    textColor: "#374151",
  },

  personal: {
    icon: "🙂",
    color: "#06B6D4",
    textColor: "#164E63",
  },

  errands: {
    icon: "🛒",
    color: "#84CC16",
    textColor: "#3F6212",
  },

  health: {
    icon: "❤️",
    color: "#DC2626",
    textColor: "#991B1B",
  },

  other: {
    icon: "✅",
    color: "#6B7280",
    textColor: "#374151",
  },
} as const;

export default function PlanTimeline({ days }: PlanTimelineProps) {
  return (
    <div className="flex flex-col gap-6">
      {days.map((day, dayIdx) => (
        <motion.div
          key={`${day.day}-${day.date}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: dayIdx * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />

            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#4F46E5]">
                Day {dayIdx + 1}
              </span>
              <span className="text-sm font-semibold text-[#111827]">
                {day.day}
              </span>
            </div>

            <span className="text-xs text-[#6B7280]">{day.date}</span>
          </div>

          <div className="flex flex-col gap-3 pl-4 border-l-2 border-[#F3F4F6]">
            {day.items.map((item, itemIdx) => {
              const style =
                TASK_STYLES[
                  item.taskType.toLowerCase() as keyof typeof TASK_STYLES
                ] ?? TASK_STYLES.other;

              return (
                <motion.div
                  key={item.id}
                  initial={{
                    opacity: 0,
                    x: -8,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.38,
                    delay: dayIdx * 0.12 + itemIdx * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="relative rounded-2xl border border-[#F3F4F6] bg-white p-4 shadow-sm hover:shadow-md hover:border-[#E5E7EB] transition-all duration-200">
                    <div
                      className="absolute left-0 top-4 bottom-4 w-1 rounded-full"
                      style={{
                        backgroundColor: style.color,
                      }}
                    />

                    <div className="pl-4 flex flex-col gap-2">
                      <div className="flex justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{style.icon}</span>

                            <h3 className="font-semibold text-[15px] text-[#111827]">
                              {item.title}
                            </h3>
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={`text-[10px] font-medium px-2 py-1 rounded-full ${
                                item.priority === "High"
                                  ? "bg-red-100 text-red-700"
                                  : item.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {item.priority}
                            </span>

                            <span
                              className={`text-[10px] font-medium px-2 py-1 rounded-full ${PERIOD_COLORS[item.period].label}`}
                              style={{
                                backgroundColor: `${PERIOD_COLORS[item.period].dot.includes("bg-[#") ? "#" : ""}`,
                              }}
                            >
                              {item.period}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <span className="text-sm font-semibold text-gray-700">
                            {item.time}
                          </span>

                          <span
                            className="mt-1 text-[10px] font-medium px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: `${style.color}20`,
                              color: style.textColor,
                            }}
                          >
                            {item.duration}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 mt-1">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 11 11"
                          fill="none"
                          className="mt-1 flex-shrink-0"
                        >
                          <path
                            d="M5.5 1L6.7 3.9L9.8 4.4L7.65 6.5L8.2 9.6L5.5 8.2L2.8 9.6L3.35 6.5L1.2 4.4L4.3 3.9L5.5 1Z"
                            fill="#9CA3AF"
                          />
                        </svg>

                        <p className="text-[11px] text-[#6B7280] italic leading-relaxed">
                          {item.aiNote}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
