"use client";

import { ProductivityCard } from "@/components/sidebar/ProductivityCard";
import { useTaskContext } from "@/lib/task-context";
import { getProductivitySummary } from "@/lib/utils";

export function ProductivitySummary() {
  const { plans, taskState } = useTaskContext();
  const summary = getProductivitySummary(plans, taskState);

  const stats = [
    { label: "Focus Time",   value: summary.focusTime,               icon: "⏱", accentColor: "#4F46E5", accentBg: "#EEF2FF" },
    { label: "Completed",    value: summary.completedTasks,          icon: "✓", accentColor: "#059669", accentBg: "#ECFDF5" },
    { label: "Pending",      value: summary.pendingTasks,            icon: "⋯", accentColor: "#D97706", accentBg: "#FFFBEB" },
    { label: "Score",        value: `${summary.productivityScore}%`, icon: "↑", accentColor: "#7C3AED", accentBg: "#F5F3FF" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "14px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", letterSpacing: "1px", textTransform: "uppercase" }}>
          Today's Summary
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {stats.map((stat) => (
          <ProductivityCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
}
