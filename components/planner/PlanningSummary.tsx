"use client";

import { motion } from "framer-motion";

interface PlanningSummaryProps {
  totalTasks: number;
  focusTime: string;
  breakTime: string;
  completionEstimate: string;
  productivityScore: number;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="4" />
        <motion.circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[13px] font-bold text-[#111827]">{score}</span>
        <span className="text-[8px] text-[#9CA3AF] font-medium -mt-0.5">/ 100</span>
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
  const stats = [
    { label: "Total Blocks", value: String(totalTasks), icon: "📋", color: "#EEF2FF", textColor: "#4F46E5" },
    { label: "Focus Time", value: focusTime, icon: "🎯", color: "#EFF6FF", textColor: "#2563EB" },
    { label: "Break Time", value: breakTime, icon: "☕", color: "#FEF3C7", textColor: "#92400E" },
    { label: "Done By", value: completionEstimate, icon: "✅", color: "#ECFDF5", textColor: "#065F46" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[#111827]">Planning Summary</h3>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5">AI-optimized schedule analysis</p>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <ScoreRing score={productivityScore} />
          <span className="text-[10px] text-[#6B7280] font-medium">Productivity</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.7 + i * 0.07 }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{ backgroundColor: stat.color }}
          >
            <span className="text-base">{stat.icon}</span>
            <div>
              <p className="text-[11px] text-[#6B7280] font-medium">{stat.label}</p>
              <p className="text-[13px] font-bold" style={{ color: stat.textColor }}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
