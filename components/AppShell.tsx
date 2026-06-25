import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  CalendarRange,
  BarChart3,
  Settings,
  Search,
  Bell,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { FloatingAI } from "./FloatingAI";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/planner", label: "Planner", icon: CalendarRange },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-border bg-sidebar md:flex">
        <div className="flex items-center gap-2.5 px-6 pt-6 pb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-4.5 w-4.5" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">
              Deadline Guardian
            </div>
            <div className="text-[11px] text-muted-foreground">
              AI Execution Companion
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-3">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <button className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-muted">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-semibold text-white">
              AK
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-sm font-medium">Arjun Kapoor</div>
              <div className="truncate text-xs text-muted-foreground">
                arjun@guardian.ai
              </div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-6 backdrop-blur-md">
          <div className="relative flex-1 max-w-xl">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search tasks, notes, anything…"
              className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:flex">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              Google Calendar synced
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-semibold text-white">
              AK
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <FloatingAI />
    </div>
  );
}
