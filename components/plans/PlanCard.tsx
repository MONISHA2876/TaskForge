"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ScoreRing } from "@/components/ui/ScoreRing";
import type { Plan, PlanStats } from "@/types";

interface PlanCardProps {
  plan: Plan;
  stats: PlanStats;
  onDelete?: (id: string) => void;
}

const planTypeBadge: Record<string, { bg: string; color: string }> = {
  Daily: { bg: "#ECFDF5", color: "#065F46" },
  Weekly: { bg: "#EEF2FF", color: "#3730A3" },
  Monthly: { bg: "#F5F3FF", color: "#5B21B6" },
};

export function PlanCard({ plan, stats, onDelete }: PlanCardProps) {
  const badge = planTypeBadge[plan.planType] ?? {
    bg: "#F3F4F6",
    color: "#374151",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(0,0,0,0.09)" }}
      style={{
        background: "#ffffff",
        border: "1px solid #E5E7EB",
        borderRadius: "20px",
        padding: "28px",
        marginBottom: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #4F46E5, #7C3AED)",
          borderRadius: "20px 20px 0 0",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "20px",
          paddingTop: "4px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.4px",
              lineHeight: 1.3,
              marginBottom: "8px",
            }}
          >
            {plan.heading}
          </h3>
          <p style={{ fontSize: "13.5px", color: "#6B7280", lineHeight: 1.6 }}>
            {plan.summary}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <ScoreRing score={plan.productivityScore} size={56} />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              padding: "3px 12px",
              borderRadius: "99px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              background: badge.bg,
              color: badge.color,
            }}
          >
            {plan.planType}
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {[
          {
            label: "Tasks",
            value: `${stats.completedTasks}/${stats.totalTasks}`,
          },
          { label: "Focus time", value: plan.focusTime },
          { label: "Est. done", value: plan.completionEstimate },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              textAlign: "center",
              padding: "14px 8px",
              background: "#F9FAFB",
              borderRadius: "12px",
              border: "1px solid #F3F4F6",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "4px",
              }}
            >
              {m.value}
            </div>
            <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: "20px" }}>
        <ProgressBar
          percentage={stats.completionPercentage}
          completedTasks={stats.completedTasks}
          totalTasks={stats.totalTasks}
        />
      </div>

      {/* Next task */}
      {stats.nextTask && (
        <div
          style={{
            marginBottom: "20px",
            padding: "14px 16px",
            background: "#EEF2FF",
            borderRadius: "12px",
            border: "1px solid #C7D2FE",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#4F46E5",
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              marginBottom: "6px",
            }}
          >
            Next up
          </p>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "4px",
            }}
          >
            {stats.nextTask.title}
          </p>
          <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
            {stats.nextTask.period} · {stats.nextTask.time} ·{" "}
            {stats.nextTask.duration} · {stats.nextTask.taskType}
          </p>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px" }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          style={{
            flex: 1,
            padding: "12px 0",
            fontSize: "13.5px",
            fontWeight: 700,
            background: "#4F46E5",
            color: "#ffffff",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            letterSpacing: "-0.1px",
          }}
        >
          Continue plan →
        </motion.button>
        <Link
          href={`/plans/${plan.id}`}
          style={{
            padding: "12px 18px",
            fontSize: "13px",
            fontWeight: 600,
            background: "#ffffff",
            color: "#6B7280",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            cursor: "pointer",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          View details
        </Link>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onDelete?.(plan.id)}
          aria-label="Delete plan"
          style={{
            padding: "12px 14px",
            background: "#ffffff",
            color: "#F87171",
            border: "1px solid #FEE2E2",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Trash2 size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}
