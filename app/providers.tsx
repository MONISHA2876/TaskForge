"use client";

import { AuthProvider } from "@/lib/auth-context";
import { TaskProvider } from "@/lib/task-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TaskProvider>{children}</TaskProvider>
    </AuthProvider>
  );
}
