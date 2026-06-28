import { useMemo } from "react";
import { useTaskContext } from "@/lib/task-context";
import { getProductivitySummary } from "@/lib/utils";

export function AIInsights() {
  const { plans, taskState } = useTaskContext();
  const summary = useMemo(
    () => getProductivitySummary(plans, taskState),
    [plans, taskState],
  );

  const insights = [
    {
      id: "plan-count",
      icon: "🧠",
      text: `${plans.length} saved plan${plans.length === 1 ? "" : "s"} are currently available from Firebase.`,
    },
    {
      id: "task-progress",
      icon: "✓",
      text: `${summary.completedTasks} of ${summary.completedTasks + summary.pendingTasks} tasks are completed.`,
    },
    {
      id: "focus-time",
      icon: "⏱",
      text: `Current focus time is ${summary.focusTime} with a ${summary.productivityScore}% productivity score.`,
    },
  ];

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
          AI Insights
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {insights.map((insight) => (
          <div
            key={insight.id}
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
              padding: "14px",
              background: "#ffffff",
              border: "1px solid #E5E7EB",
              borderRadius: "14px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#EEF2FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "17px",
                flexShrink: 0,
              }}
            >
              {insight.icon}
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "#6B7280",
                lineHeight: 1.55,
                paddingTop: "2px",
              }}
            >
              {insight.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
