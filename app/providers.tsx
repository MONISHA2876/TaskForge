"use client";

import { TaskProvider } from "@/lib/task-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <TaskProvider>{children}</TaskProvider>;
}
