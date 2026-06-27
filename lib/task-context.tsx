"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { Plan } from "@/types";
import { PLACEHOLDER_PLANS } from "@/lib/placeholder-data";
import { buildInitialTaskState } from "@/lib/utils";

// ─── Context Shape ────────────────────────────────────────────────────────────

interface TaskContextValue {
  plans: Plan[];
  taskState: Record<string, boolean>;
  toggleTask: (id: string) => void;
  isTaskComplete: (id: string) => boolean;
}

const TaskContext = createContext<TaskContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [plans] = useState<Plan[]>(PLACEHOLDER_PLANS);
  const [taskState, setTaskState] = useState<Record<string, boolean>>(
    () => buildInitialTaskState(PLACEHOLDER_PLANS)
  );

  const toggleTask = useCallback((id: string) => {
    setTaskState((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const isTaskComplete = useCallback(
    (id: string) => taskState[id] ?? false,
    [taskState]
  );

  const value = useMemo(
    () => ({ plans, taskState, toggleTask, isTaskComplete }),
    [plans, taskState, toggleTask, isTaskComplete]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTaskContext(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTaskContext must be used inside <TaskProvider>");
  return ctx;
}
