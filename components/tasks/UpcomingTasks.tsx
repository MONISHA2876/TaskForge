"use client";

import { UpcomingTaskCard } from "@/components/tasks/UpcomingTaskCard";
import { useTaskContext } from "@/lib/task-context";
import { getTasksForDate, getTodayDateString } from "@/lib/utils";

const MAX_VISIBLE = 5;

export function UpcomingTasks() {
  const { plans, taskState, toggleTask } = useTaskContext();
  const allTasks = getTasksForDate(plans, getTodayDateString())
    .filter((task) => !(taskState[task.id] ?? task.completed))
    .slice(0, MAX_VISIBLE);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#9CA3AF",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Upcoming today
        </span>
        <button
          style={{
            fontSize: "12px",
            color: "#4F46E5",
            fontWeight: 600,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          View all
        </button>
      </div>

      {allTasks.length === 0 ? (
        <p
          style={{
            fontSize: "13px",
            color: "#9CA3AF",
            textAlign: "center",
            padding: "20px 0",
          }}
        >
          No tasks scheduled for today.
        </p>
      ) : (
        <div>
          {allTasks.map((task, idx) => (
            <UpcomingTaskCard
              key={task.id}
              task={task}
              isCompleted={taskState[task.id] ?? task.completed}
              isHighlighted={idx === 0}
              onToggle={toggleTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
