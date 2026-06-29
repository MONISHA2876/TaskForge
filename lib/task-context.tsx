"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Plan } from "@/types";
import { buildInitialTaskState, getAllTasksFromPlan } from "@/lib/utils";
import { fetchPlans, updateTaskCompletion } from "@/lib/firestore";
import { useAuth } from "@/lib/auth-context";

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
  const [plans, setPlans] = useState<Plan[]>([]);
  const [taskState, setTaskState] = useState<Record<string, boolean>>({});
  const { user } = useAuth();

  useEffect(() => {
    let active = true;

    async function loadPlans() {
      const fetchedPlans = await fetchPlans(user?.uid ?? null);

      if (!active) return;

      setPlans(fetchedPlans);
      setTaskState(buildInitialTaskState(fetchedPlans));
    }

    void loadPlans();

    return () => {
      active = false;
    };
  }, [user?.uid]);

  const toggleTask = useCallback(
    (id: string) => {
      setTaskState((prev) => {
        const nextValue = !(prev[id] ?? false);

        const targetPlan = plans.find((plan) =>
          getAllTasksFromPlan(plan).some((task) => task.id === id),
        );

        if (targetPlan) {
          void updateTaskCompletion(targetPlan, id, nextValue);

          setPlans((currentPlans) =>
            currentPlans.map((plan) =>
              plan.id === targetPlan.id
                ? {
                    ...plan,
                    days: plan.days.map((day) => ({
                      ...day,
                      items: day.items.map((task) =>
                        task.id === id
                          ? { ...task, completed: nextValue }
                          : task,
                      ),
                    })),
                  }
                : plan,
            ),
          );
        }

        return { ...prev, [id]: nextValue };
      });
    },
    [plans],
  );

  const isTaskComplete = useCallback(
    (id: string) => taskState[id] ?? false,
    [taskState],
  );

  const value = useMemo(
    () => ({ plans, taskState, toggleTask, isTaskComplete }),
    [plans, taskState, toggleTask, isTaskComplete],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTaskContext(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx)
    throw new Error("useTaskContext must be used inside <TaskProvider>");
  return ctx;
}
