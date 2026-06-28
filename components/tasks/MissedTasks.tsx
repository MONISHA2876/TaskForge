"use client";

import { MissedTaskCard } from "@/components/tasks/MissedTaskCard";
import { useTaskContext } from "@/lib/task-context";
import { getMissedTasks } from "@/lib/utils";

const MAX_MISSED = 3;

export function MissedTasks() {
  const { plans, taskState, toggleTask } = useTaskContext();
  const missed = getMissedTasks(plans, taskState).slice(0, MAX_MISSED);

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
          Missed
        </span>
        {missed.length > 0 && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              padding: "2px 10px",
              borderRadius: "99px",
              background: "#FEF2F2",
              color: "#B91C1C",
            }}
          >
            {missed.length}
          </span>
        )}
      </div>

      {missed.length === 0 ? (
        <p
          style={{
            fontSize: "13px",
            color: "#9CA3AF",
            textAlign: "center",
            padding: "16px 0",
          }}
        >
          All caught up ✓
        </p>
      ) : (
        <div>
          {missed.map((task) => (
            <MissedTaskCard
              key={task.id}
              task={task}
              isCompleted={taskState[task.id] ?? task.completed}
              onToggle={toggleTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
