"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  percentage: number;
  completedTasks: number;
  totalTasks: number;
  showLabel?: boolean;
}

export function ProgressBar({ percentage, completedTasks, totalTasks, showLabel = true }: ProgressBarProps) {
  return (
    <div style={{ width: "100%" }}>
      {showLabel && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#6B7280" }}>
            {completedTasks} of {totalTasks} tasks completed
          </span>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#4F46E5" }}>{percentage}%</span>
        </div>
      )}
      <div style={{ height: "7px", background: "#F3F4F6", borderRadius: "99px", overflow: "hidden" }}>
        <motion.div
          style={{
            height: "100%", borderRadius: "99px",
            background: "linear-gradient(90deg, #4F46E5, #7C3AED)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
        />
      </div>
    </div>
  );
}
