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

function normalizeDateValue(value: string | undefined): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const lowered = trimmed.toLowerCase();
  if (lowered === "today") {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  }

  if (lowered === "tomorrow") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  }

  if (lowered === "yesterday") {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().slice(0, 10);
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toISOString().slice(0, 10);
}

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTasksForDate(plans: Plan[], dateValue: string): Task[] {
  const normalizedDate = normalizeDateValue(dateValue);
  if (!normalizedDate) return [];

  return plans.flatMap((plan) =>
    plan.days.flatMap((day) => {
      const dayDate = normalizeDateValue(day.date);
      const dayLabel = day.day?.trim().toLowerCase();
      const isTodayLabel = dayLabel === "today";

      if (dayDate === normalizedDate || isTodayLabel) {
        return day.items;
      }

      return [];
    }),
  );
}

export function getMissedTasks(
  plans: Plan[],
  taskState: Record<string, boolean>,
  dateValue: string = getTodayDateString(),
): Task[] {
  const normalizedDate = normalizeDateValue(dateValue);
  if (!normalizedDate) return [];

  return plans.flatMap((plan) =>
    plan.days.flatMap((day) => {
      const dayDate = normalizeDateValue(day.date);
      const dayLabel = day.day?.trim().toLowerCase();
      const isTodayLabel = dayLabel === "today";

      if (!dayDate && !isTodayLabel) {
        return [];
      }

      if (dayDate && dayDate >= normalizedDate) {
        return [];
      }

      if (
        isTodayLabel &&
        normalizedDate === normalizeDateValue(getTodayDateString())
      ) {
        return [];
      }

      return day.items.filter(
        (task) => !(taskState[task.id] ?? task.completed),
      );
    }),
  );
}

/**
 * Calculate derived stats for a plan given a live task state map.
 */
export function getPlanStats(
  plan: Plan,
  taskState: Record<string, boolean>,
): PlanStats {
  const allTasks = getAllTasksFromPlan(plan);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(
    (t) => taskState[t.id] ?? t.completed,
  ).length;
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
  taskState: Record<string, boolean>,
): boolean {
  return getAllTasksFromPlan(plan).some(
    (t) => !(taskState[t.id] ?? t.completed),
  );
}

// ─── Task State Initialization ───────────────────────────────────────────────

/**
 * Build the initial task state map from plan data.
 * Keys are task IDs; values are the initial `completed` flag.
 */
export function buildInitialTaskState(plans: Plan[]): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  plans.forEach((plan) =>
    plan.days.forEach((day) =>
      day.items.forEach((task) => {
        state[task.id] = task.completed;
      }),
    ),
  );
  return state;
}

// ─── Productivity Summary ────────────────────────────────────────────────────

function parseFocusTimeToMinutes(value: string): number {
  const match = value.match(/(\d+)h(?:\s*(\d+)m)?/i);
  if (!match) return 0;

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  return hours * 60 + minutes;
}

function formatMinutesToFocusTime(minutes: number): string {
  if (minutes <= 0) return "0h";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getProductivitySummary(
  plans: Plan[],
  taskState: Record<string, boolean>,
) {
  const all = getAllTasks(plans);
  const completedTasks = all.filter(
    (t) => taskState[t.id] ?? t.completed,
  ).length;
  const pendingTasks = all.length - completedTasks;
  const productivityScore =
    all.length > 0 ? Math.round((completedTasks / all.length) * 100) : 0;
  const totalFocusMinutes = plans.reduce(
    (sum, plan) => sum + parseFocusTimeToMinutes(plan.focusTime),
    0,
  );

  return {
    focusTime: formatMinutesToFocusTime(totalFocusMinutes),
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
