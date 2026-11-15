"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  CalendarClock,
  ChartColumn,
  Crown,
  Folder,
  History,
  House,
  Menu,
  Sparkles,
  SquareCheckBig,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

const mainNav: NavItem[] = [
  { label: "Overview", href: "/", icon: House },
  { label: "My Tasks", href: "/tasks", icon: SquareCheckBig, badge: 12 },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Projects", href: "/projects", icon: Folder },
  { label: "Analytics", href: "/analytics", icon: ChartColumn },
];

const aiNav: NavItem[] = [
  { label: "Forge AI", href: "/forge-ai", icon: Sparkles },
  { label: "Automation Studio", href: "/automation-studio", icon: Workflow },
  { label: "Smart Scheduler", href: "/smart-scheduler", icon: CalendarClock },
  { label: "Execution History", href: "/execution-history", icon: History },
];

/** Four-point star used as the TaskForge logo mark */
function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tf-star" x1="8" y1="6" x2="40" y2="42">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#f3dfb8" />
          <stop offset="1" stopColor="#c9a45c" />
        </linearGradient>
      </defs>
      {/* main star */}
      <path
        d="M22 3c1.2 9.6 4.6 15.6 9.6 18.4C36.2 24 41.4 25.4 46 26c-9.4 1.4-15.2 5-18 10.4-1.6 3-2.8 6.6-3.6 11.6-1-9.4-4.2-15.4-9.2-18.4C10.6 27 6 25.4 1 24.6c9.6-1.6 15.4-5 18.4-10.2C21 11.6 21.6 8 22 3Z"
        fill="url(#tf-star)"
      />
      {/* small accent sparkles */}
      <path
        d="M40 4c.3 2.3 1.1 3.5 3 4-1.9.5-2.7 1.7-3 4-.3-2.3-1.1-3.5-3-4 1.9-.5 2.7-1.7 3-4Z"
        fill="#f3dfb8"
      />
      <path
        d="M9 38c.2 1.6.8 2.4 2 2.8-1.2.4-1.8 1.2-2 2.8-.2-1.6-.8-2.4-2-2.8 1.2-.4 1.8-1.2 2-2.8Z"
        fill="#f3dfb8"
      />
    </svg>
  );
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={[
        "group flex h-[46px] items-center gap-4 rounded-xl border px-5 text-[15.5px] font-medium transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9b77a]",
        active
          ? "border-white/10 bg-[#16223f] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_6px_18px_rgba(0,0,0,0.25)]"
          : "border-transparent text-slate-300 hover:bg-white/[0.04] hover:text-white",
      ].join(" ")}
    >
      <Icon
        className={[
          "size-[19px] shrink-0 stroke-[1.6]",
          active ? "text-white" : "text-slate-400 group-hover:text-slate-200",
        ].join(" ")}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge !== undefined && (
        <span className="rounded-full bg-[#1b2a4d] px-2.5 py-1 text-[13px] leading-none font-semibold text-slate-100">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const close = () => setOpen(false);

  // Close drawer on Escape and lock body scroll while it is open (mobile)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* Hamburger — visible below lg */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="taskforge-sidebar"
        className="fixed top-4 left-4 z-40 flex size-11 items-center justify-center rounded-xl border border-white/10 bg-[#0b1429]/90 text-slate-100 shadow-lg backdrop-blur transition-colors hover:bg-[#16223f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9b77a] lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      {/* Overlay — mobile only */}
      <div
        onClick={close}
        aria-hidden="true"
        className={[
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* Sidebar */}
      <aside
        id="taskforge-sidebar"
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[85vw] flex-col overflow-y-auto",
          "border-r border-white/[0.07] bg-gradient-to-b from-[#0c162c] via-[#0a1325] to-[#070d1e]",
          "px-7 pt-8 pb-7 transition-transform duration-300 ease-out",
          "lg:max-w-none lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Close button — mobile only */}
        <button
          type="button"
          onClick={close}
          aria-label="Close navigation menu"
          className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-[#d9b77a] lg:hidden"
        >
          <X className="size-5" />
        </button>

        {/* Brand */}
        <Link
          href="/"
          onClick={close}
          className="flex items-center gap-3 px-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9b77a]"
        >
          <LogoMark className="size-[46px] shrink-0 drop-shadow-[0_0_14px_rgba(243,223,184,0.35)]" />
          <div className="leading-tight">
            <p className="font-serif text-[25px] font-medium tracking-tight text-white">
              TaskForge
            </p>
            <p className="mt-0.5 text-[12.5px] text-slate-400">
              AI Productivity Workspace
            </p>
          </div>
        </Link>

        {/* Main navigation */}
        <nav aria-label="Main" className="mt-10 flex flex-col gap-1">
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
              onNavigate={close}
            />
          ))}
        </nav>

        <div className="my-6 h-px bg-white/[0.08]" />

        {/* AI workspace */}
        <p className="mb-3 px-5 text-[11.5px] font-medium tracking-[0.16em] text-slate-400 uppercase">
          AI Workspace
        </p>
        <nav aria-label="AI workspace" className="flex flex-col gap-1">
          {aiNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
              onNavigate={close}
            />
          ))}
        </nav>

        {/* Upgrade card */}
        <div className="mt-auto pt-10">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#111c36] to-[#0b1429] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="flex size-10 items-center justify-center rounded-xl border border-[#c9a45c]/40 bg-[#1a1d2b] text-[#e6c78f]">
              <Crown className="size-5 stroke-[1.7]" />
            </div>
            <h3 className="mt-3 font-serif text-[21px] font-medium text-white">
              Upgrade to Pro
            </h3>
            <p className="mt-1.5 text-[14px] leading-[1.45] text-slate-300">
              Unlock AI automation, advanced insights and more.
            </p>
            <Link
              href="/upgrade"
              onClick={close}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ecd5a5] via-[#e0bf86] to-[#c9a45c] text-[15px] font-semibold text-[#1c1406] shadow-[0_6px_18px_rgba(201,164,92,0.25)] transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecd5a5]"
            >
              Upgrade Now
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
