"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { TaskCheckbox } from "@/components/ui/TaskCheckbox";
import type { Task } from "@/types";

interface MissedTaskCardProps {
  task: Task;
  isCompleted: boolean;
  onToggle: (id: string) => void;
  onReschedule?: (id: string) => void;
}

export function MissedTaskCard({ task, isCompleted, onToggle, onReschedule }: MissedTaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: isCompleted ? 0.5 : 1, y: 0 }}
      style={{
        display: "flex", flexDirection: "column", gap: "10px",
        padding: "14px", borderRadius: "14px",
        background: "#FFF7F7", border: "1px solid #FECACA",
        marginBottom: "8px",
      }}
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div style={{ marginTop: "2px" }}>
          <TaskCheckbox checked={isCompleted} onChange={() => onToggle(task.id)} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: "14px", fontWeight: 500, lineHeight: 1.4,
            marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            color: isCompleted ? "#9CA3AF" : "#111827",
            textDecoration: isCompleted ? "line-through" : "none",
          }}>
            {task.title}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#9CA3AF" }}>
              <Clock size={11} />
              {task.time} · {task.duration}
            </span>
            <span style={{
              fontSize: "10px", fontWeight: 700, padding: "2px 8px",
              borderRadius: "99px", background: "#FEF2F2", color: "#B91C1C",
            }}>
              Overdue
            </span>
          </div>
        </div>
      </div>

      {!isCompleted && (
        <div style={{ display: "flex", gap: "8px", paddingLeft: "28px" }}>
          <button
            onClick={() => onToggle(task.id)}
            style={{
              fontSize: "12px", fontWeight: 600, padding: "6px 14px",
              borderRadius: "8px", border: "none", cursor: "pointer",
              background: "#4F46E5", color: "#ffffff",
            }}
          >
            Mark complete
          </button>
          <button
            onClick={() => onReschedule?.(task.id)}
            style={{
              fontSize: "12px", fontWeight: 500, padding: "6px 14px",
              borderRadius: "8px", cursor: "pointer",
              background: "#ffffff", color: "#6B7280", border: "1px solid #E5E7EB",
            }}
          >
            Reschedule
          </button>
        </div>
      )}
    </motion.div>
  );
}
