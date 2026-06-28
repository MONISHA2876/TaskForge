import { useMemo } from "react";
import { useTaskContext } from "@/lib/task-context";
import type { ActivityItem } from "@/types";

const dotStyles: Record<
  ActivityItem["type"],
  { bg: string; border: string; color: string }
> = {
  plan_generated: { bg: "#ECFDF5", border: "#A7F3D0", color: "#059669" },
  plan_saved: { bg: "#ECFDF5", border: "#A7F3D0", color: "#059669" },
  task_completed: { bg: "#EEF2FF", border: "#C7D2FE", color: "#4F46E5" },
  task_rescheduled: { bg: "#FFFBEB", border: "#FDE68A", color: "#D97706" },
  sync: { bg: "#F5F3FF", border: "#DDD6FE", color: "#7C3AED" },
};

const dotIcons: Record<ActivityItem["type"], string> = {
  plan_generated: "✦",
  plan_saved: "✓",
  task_completed: "✓",
  task_rescheduled: "⟳",
  sync: "⚡",
};

export function RecentActivity() {
  const { plans } = useTaskContext();

  const items = useMemo<ActivityItem[]>(() => {
    if (plans.length === 0) {
      return [
        {
          id: "empty-activity",
          action: "No plans have been loaded yet.",
          time: "Save a plan from the planner to see it here.",
          type: "sync",
        },
      ];
    }

    return plans.map((plan) => ({
      id: plan.id,
      action: `Plan synced from Firebase: ${plan.heading}`,
      time: `${plan.totalTasks} tasks • ${plan.planType}`,
      type: "plan_saved",
    }));
  }, [plans]);

  return (
    <div>
      <div style={{ marginBottom: "14px" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#9CA3AF",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Recent Activity
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((item, idx) => {
          const dot = dotStyles[item.type];
          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: "12px",
                padding: "10px 0",
                position: "relative",
              }}
            >
              {idx < items.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "36px",
                    bottom: "-10px",
                    width: "1px",
                    background: "#F3F4F6",
                  }}
                />
              )}
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  background: dot.bg,
                  border: `1.5px solid ${dot.border}`,
                  color: dot.color,
                }}
              >
                {dotIcons[item.type]}
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingTop: "4px" }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#111827",
                    lineHeight: 1.45,
                  }}
                >
                  {item.action}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#9CA3AF",
                    marginTop: "3px",
                  }}
                >
                  {item.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
