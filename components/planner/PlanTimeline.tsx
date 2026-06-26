"use client";

import { motion } from "framer-motion";

export interface TimelineItem {
  id: string;
  period: "Morning" | "Afternoon" | "Evening" | "Night";
  time: string;
  activity: string;
  duration: string;
  aiNote: string;
  color: string;
  textColor: string;
  icon: string;
}

const PERIOD_COLORS: Record<TimelineItem["period"], { dot: string; label: string }> = {
  Morning:   { dot: "bg-[#FDE68A]",  label: "text-[#92400E]" },
  Afternoon: { dot: "bg-[#BFDBFE]",  label: "text-[#1E40AF]" },
  Evening:   { dot: "bg-[#C7D2FE]",  label: "text-[#3730A3]" },
  Night:     { dot: "bg-[#A7F3D0]",  label: "text-[#065F46]" },
};

interface PlanTimelineProps {
  items: TimelineItem[];
}

export default function PlanTimeline({ items }: PlanTimelineProps) {
  // Group by period
  const grouped = items.reduce<Record<string, TimelineItem[]>>((acc, item) => {
    if (!acc[item.period]) acc[item.period] = [];
    acc[item.period].push(item);
    return acc;
  }, {});

  const periods = ["Morning", "Afternoon", "Evening", "Night"] as const;
  const presentPeriods = periods.filter((p) => grouped[p]?.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {presentPeriods.map((period, groupIdx) => (
        <motion.div
          key={period}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: groupIdx * 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Period label */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-2 h-2 rounded-full ${PERIOD_COLORS[period].dot}`} />
            <span className={`text-[11px] font-semibold uppercase tracking-widest ${PERIOD_COLORS[period].label}`}>
              {period}
            </span>
          </div>

          {/* Cards for this period */}
          <div className="flex flex-col gap-2.5 pl-4 border-l-2 border-[#F3F4F6]">
            {grouped[period].map((item, itemIdx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.38,
                  delay: groupIdx * 0.12 + itemIdx * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div
                  className="relative rounded-2xl border border-[#F3F4F6] bg-white p-4 shadow-sm hover:shadow-md hover:border-[#E5E7EB] transition-all duration-200 group"
                >
                  {/* Colored left accent */}
                  <div
                    className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />

                  <div className="pl-3 flex flex-col gap-1.5">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">{item.icon}</span>
                        <span className="text-[14px] font-semibold text-[#111827] leading-tight">
                          {item.activity}
                        </span>
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-end gap-0.5">
                        <span className="text-[12px] font-semibold text-[#374151]">{item.time}</span>
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: `${item.color}20`, color: item.textColor }}
                        >
                          {item.duration}
                        </span>
                      </div>
                    </div>

                    {/* AI note */}
                    <div className="flex items-start gap-1.5 mt-0.5">
                      <svg className="mt-0.5 flex-shrink-0" width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 1L6.7 3.9L9.8 4.4L7.65 6.5L8.2 9.6L5.5 8.2L2.8 9.6L3.35 6.5L1.2 4.4L4.3 3.9L5.5 1Z" fill="#9CA3AF"/>
                      </svg>
                      <p className="text-[11px] text-[#9CA3AF] leading-relaxed italic">{item.aiNote}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
