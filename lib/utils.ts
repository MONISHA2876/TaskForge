import type { Plan, Task, PlanStats } from "@/types";

// ─── Plan Calculations ───────────────────────────────────────────────────────

/**
 * Get all tasks across all days of a plan.
 */
export function getAllTasksFromPlan(plan: Plan): Task[] {
  return plan.days.flatMap((day) => day.items);
}

/**
 * Get all tasks across all plans.
 */
export function getAllTasks(plans: Plan[]): Task[] {
  return plans.flatMap((plan) => getAllTasksFromPlan(plan));
}

/**
 * Calculate derived stats for a plan given a live task state map.
 */
export function getPlanStats(
  plan: Plan,
  taskState: Record<string, boolean>
): PlanStats {
  const allTasks = getAllTasksFromPlan(plan);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => taskState[t.id] ?? t.completed).length;
  const remainingTasks = totalTasks - completedTasks;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const nextTask =
    allTasks.find((t) => !(taskState[t.id] ?? t.completed)) ?? null;

  return {
    completedTasks,
    remainingTasks,
    completionPercentage,
    totalTasks,
    nextTask,
  };
}

/**
 * A plan is "active" when at least one task is not completed.
 */
export function isPlanActive(
  plan: Plan,
  taskState: Record<string, boolean>
): boolean {
  return getAllTasksFromPlan(plan).some(
    (t) => !(taskState[t.id] ?? t.completed)
  );
}

// ─── Task State Initialization ───────────────────────────────────────────────

/**
 * Build the initial task state map from plan data.
 * Keys are task IDs; values are the initial `completed` flag.
 */
export function buildInitialTaskState(
  plans: Plan[]
): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  plans.forEach((plan) =>
    plan.days.forEach((day) =>
      day.items.forEach((task) => {
        state[task.id] = task.completed;
      })
    )
  );
  return state;
}

// ─── Productivity Summary ────────────────────────────────────────────────────

export function getProductivitySummary(
  plans: Plan[],
  taskState: Record<string, boolean>
) {
  const all = getAllTasks(plans);
  const completedTasks = all.filter((t) => taskState[t.id] ?? t.completed).length;
  const pendingTasks = all.length - completedTasks;
  const productivityScore =
    all.length > 0 ? Math.round((completedTasks / all.length) * 100) : 0;

  return {
    focusTime: "3h 40m", // Replace with real calculation when integrating Firebase
    completedTasks,
    pendingTasks,
    productivityScore,
  };
}

// ─── Priority Helpers ────────────────────────────────────────────────────────

export function getPriorityColor(priority: string): {
  bg: string;
  text: string;
} {
  switch (priority) {
    case "High":
      return { bg: "bg-red-50", text: "text-red-700" };
    case "Medium":
      return { bg: "bg-amber-50", text: "text-amber-700" };
    case "Low":
      return { bg: "bg-emerald-50", text: "text-emerald-700" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-600" };
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#059669";
  if (score >= 60) return "#D97706";
  return "#DC2626";
}
