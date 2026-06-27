"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { TaskCheckbox } from "@/components/ui/TaskCheckbox";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import type { Task } from "@/types";

interface UpcomingTaskCardProps {
  task: Task;
  isCompleted: boolean;
  isHighlighted?: boolean;
  onToggle: (id: string) => void;
}

export function UpcomingTaskCard({ task, isCompleted, isHighlighted, onToggle }: UpcomingTaskCardProps) {
  const highlighted = isHighlighted && !isCompleted;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: isCompleted ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => onToggle(task.id)}
      style={{
        display: "flex", gap: "12px", alignItems: "flex-start",
        padding: "14px", borderRadius: "14px", cursor: "pointer",
        marginBottom: "8px",
        background: highlighted ? "#EEF2FF" : "#ffffff",
        border: highlighted ? "1.5px solid #A5B4FC" : "1px solid #E5E7EB",
      }}
    >
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
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#9CA3AF" }}>
            <Clock size={11} />
            {task.time} · {task.duration}
          </span>
          {highlighted && (
            <span style={{
              fontSize: "10px", fontWeight: 700, padding: "2px 8px",
              borderRadius: "99px", background: "#EEF2FF", color: "#4F46E5",
            }}>
              Next up
            </span>
          )}
          <PriorityBadge priority={task.priority} />
        </div>
      </div>
    </motion.div>
  );
}
