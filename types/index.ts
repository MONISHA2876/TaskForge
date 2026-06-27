// ─── Core Task Schema ───────────────────────────────────────────────────────

export type Priority = "High" | "Medium" | "Low";
export type Period = "Morning" | "Afternoon" | "Evening" | "Night";
export type PlanType = "Daily" | "Weekly" | "Monthly";

export interface Task {
  id: string;
  title: string;
  taskType: string;
  priority: Priority;
  period: Period;
  time: string;
  duration: string;
  completed: boolean;
  aiNote: string;
}

export interface PlanDay {
  day: string;
  date: string;
  items: Task[];
}

export interface Plan {
  id: string;
  heading: string;
  summary: string;
  planType: PlanType;
  productivityScore: number;
  focusTime: string;
  breakTime: string;
  completionEstimate: string;
  totalTasks: number;
  days: PlanDay[];
}

// ─── Derived / UI types ─────────────────────────────────────────────────────

export interface PlanStats {
  completedTasks: number;
  remainingTasks: number;
  completionPercentage: number;
  totalTasks: number;
  nextTask: Task | null;
}

export interface ProductivitySummary {
  focusTime: string;
  completedTasks: number;
  pendingTasks: number;
  productivityScore: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  time: string;
  type: "plan_generated" | "plan_saved" | "task_completed" | "task_rescheduled" | "sync";
}

export interface AIInsight {
  id: string;
  icon: string;
  text: string;
}
