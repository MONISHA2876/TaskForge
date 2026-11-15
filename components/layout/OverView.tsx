"use client";

import { useState, type ReactNode, type SyntheticEvent } from "react";
import { motion, MotionConfig, type Variants } from "motion/react";
import {
  ArrowRight,
  Bell,
  Calendar,
  ChartColumn,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Flame,
  Hourglass,
  Layers,
  Plus,
  Presentation,
  Rocket,
  Search,
  SendHorizontal,
  SquareCheckBig,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Greeting from "../overview/Greeting";
import StatCards from "../overview/StatCards";


/* ------------------------------------------------------------------ */
/* Data — replace with real data from your API / Firebase / React Query */
/* ------------------------------------------------------------------ */


const aiSuggestions: { icon: LucideIcon; label: string }[] = [
  { icon: Zap, label: "Prioritize your hackathon tasks" },
  { icon: Calendar, label: "Reschedule 2 pending tasks" },
  { icon: Layers, label: "Break down the next milestone" },
];

const weekly = [
  { day: "Mon", hours: 2.8 },
  { day: "Tue", hours: 3.9 },
  { day: "Wed", hours: 2.7 },
  { day: "Thu", hours: 4.9 },
  { day: "Fri", hours: 4.2 },
  { day: "Sat", hours: 3.3 },
  { day: "Sun", hours: 6.3 },
];
const CHART_MAX = 8;
const CHART_TICKS = [8, 6, 4, 2, 0];

const upcoming: { icon: LucideIcon; title: string; time: string }[] = [
  { icon: Calendar, title: "1st Mentor Round", time: "Today · 4:00 PM – 4:30 PM" },
  { icon: Rocket, title: "Hackathon Submission", time: "Tomorrow · 11:59 PM" },
  { icon: Presentation, title: "Final Presentation", time: "Nov 17 · 2:00 PM" },
];

const activity: { kind: "done" | "add" | "ai"; text: string; time: string }[] = [
  { kind: "done", text: "Completed: Design UI for dashboard", time: "2m ago" },
  { kind: "add", text: "Added new task: Prepare for interview", time: "12m ago" },
  { kind: "ai", text: "Forge AI suggested 2 new tasks", time: "15m ago" },
];

const PLAN_PROGRESS = 41;

/* ------------------------------------------------------------------ */
/* Animation variants                                                   */
/* ------------------------------------------------------------------ */

/** Page-level container: staggers each top-level block */
const page: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

/** Fade + rise for each block */
const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

/** Staggered list rows inside a block (custom = row index) */
const row: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

/** Chart bars grow up from the baseline (custom = bar index) */
const bar: Variants = {
  hidden: { scaleY: 0 },
  show: (i: number) => ({
    scaleY: 1,
    transition: { delay: 0.4 + i * 0.07, duration: 0.7, ease: "easeOut" },
  }),
};

/** Progress bar fill */
const fill: Variants = {
  hidden: { width: "0%" },
  show: {
    width: `${PLAN_PROGRESS}%`,
    transition: { delay: 0.6, duration: 1.1, ease: "easeOut" },
  },
};

/* ------------------------------------------------------------------ */
/* Shared styles                                                        */
/* ------------------------------------------------------------------ */

const card =
  "rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#0e1832]/80 to-[#0a1228]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]";
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9b77a]";
const linkGold =
  "inline-flex items-center gap-1.5 text-[12px] font-medium text-[#ecd5a5] transition-colors hover:text-white " +
  focusRing;

/* ------------------------------------------------------------------ */
/* Small pieces                                                         */
/* ------------------------------------------------------------------ */

function Spark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="dash-star" x1="8" y1="6" x2="40" y2="42">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#f3dfb8" />
          <stop offset="1" stopColor="#c9a45c" />
        </linearGradient>
      </defs>
      <path
        d="M22 3c1.2 9.6 4.6 15.6 9.6 18.4C36.2 24 41.4 25.4 46 26c-9.4 1.4-15.2 5-18 10.4-1.6 3-2.8 6.6-3.6 11.6-1-9.4-4.2-15.4-9.2-18.4C10.6 27 6 25.4 1 24.6c9.6-1.6 15.4-5 18.4-10.2C21 11.6 21.6 8 22 3Z"
        fill="url(#dash-star)"
      />
      <path
        d="M40 4c.3 2.3 1.1 3.5 3 4-1.9.5-2.7 1.7-3 4-.3-2.3-1.1-3.5-3-4 1.9-.5 2.7-1.7 3-4Z"
        fill="#f3dfb8"
      />
    </svg>
  );
}

function Mountain() {
  return (
    <svg
      viewBox="0 0 250 220"
      preserveAspectRatio="xMidYMid slice"
      className="size-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2b5a" />
          <stop offset="1" stopColor="#0c1530" />
        </linearGradient>
        <linearGradient id="mt-lit" x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f2b78a" />
          <stop offset="0.45" stopColor="#b86f6b" />
          <stop offset="1" stopColor="#2a3a72" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="mt-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24376e" />
          <stop offset="1" stopColor="#101c40" />
        </linearGradient>
      </defs>
      <rect width="250" height="220" fill="url(#mt-sky)" />
      <path d="M0 150 L58 98 L108 134 L165 84 L250 142 L250 220 L0 220Z" fill="#15234a" />
      <path d="M10 220 L122 38 L150 72 L176 58 L250 165 L250 220Z" fill="url(#mt-body)" />
      <path d="M122 38 L150 72 L130 98 L108 92 L86 138 L58 182 L10 220 L74 220 L112 150 L130 98Z" fill="url(#mt-lit)" />
      <path d="M122 38 L132 56 L118 64 L110 80 L100 70Z" fill="#fbd9b8" opacity="0.85" />
      <path d="M0 200 Q80 170 160 195 T250 188 L250 220 L0 220Z" fill="#0b1430" opacity="0.8" />
    </svg>
  );
}

function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-serif text-[16.5px] font-medium text-white">{title}</h2>
      {action}
    </div>
  );
}

/** Soft animated rings behind the page */
function BackgroundRings() {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6 }}
      className="pointer-events-none absolute -top-[500px] -right-[340px] -z-10 size-[900px]"
    >
      {/* drifting glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_72%,rgba(90,125,230,0.13),transparent_60%)]"
        animate={{ x: [0, -26, 0], y: [0, 18, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* outer ring — breathes */}
      <motion.div
        className="absolute inset-0 rounded-full border border-[#7d98f0]/[0.1]"
        animate={{ scale: [1, 1.035, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* inner ring — breathes the other way */}
      <motion.div
        className="absolute inset-[110px] rounded-full border border-[#7d98f0]/[0.06]"
        animate={{ scale: [1, 0.97, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* light travelling along the outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(150,175,255,0.3)_45deg,transparent_110deg)] [mask-image:radial-gradient(farthest-side,transparent_calc(100%_-_1.5px),#000_calc(100%_-_1.5px))]"
        animate={{ rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                             */
/* ------------------------------------------------------------------ */

function TopBar() {
  return (
    <motion.div variants={rise} className="flex items-center gap-4 pl-14 lg:pl-0">
      <label className="flex h-10 max-w-[640px] min-w-0 flex-1 items-center gap-3 rounded-full border border-white/[0.09] bg-[#0c1530]/70 px-4 text-slate-400 backdrop-blur focus-within:border-[#d9b77a]/60">
        <Search className="size-4 shrink-0" />
        <input
          type="search"
          placeholder="Search tasks, projects, automations..."
          className="min-w-0 flex-1 bg-transparent text-[13px] text-slate-100 outline-none placeholder:text-slate-400"
        />
        <kbd className="hidden shrink-0 rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-sans text-[11px] text-slate-300 sm:block">
          ⌘ K
        </kbd>
      </label>

      <div className="ml-auto flex items-center gap-3.5">
        <button
          type="button"
          aria-label="Notifications"
          className={`rounded-full p-2 text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white ${focusRing}`}
        >
          <Bell className="size-[18px] stroke-[1.6]" />
        </button>
        <span className="hidden h-6 w-px bg-white/10 sm:block" />
        <button
          type="button"
          aria-label="Account menu"
          className={`flex items-center gap-1.5 rounded-full ${focusRing}`}
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#e8cf9c] to-[#8a5a3c] font-serif text-[16px] font-medium text-[#1c1406] ring-2 ring-white/15">
            U
          </span>
          <ChevronDown className="hidden size-3.5 text-slate-400 sm:block" />
        </button>
      </div>
    </motion.div>
  );
}


function ActivePlan() {
  return (
    <motion.section variants={rise} className={`${card} p-6`}>
      <SectionHeader
        title="Active Plan"
        action={
          <a href="/plans" className={linkGold}>
            View all plans <ArrowRight className="size-3" />
          </a>
        }
      />

      <div className="mt-5 flex flex-col gap-6 md:flex-row">
        <div className="h-[190px] w-full shrink-0 overflow-hidden rounded-xl border border-white/10 md:w-[216px]">
          <Mountain />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-[19px] font-medium text-white">
            Hackathon Sprint Execution Plan
          </h3>
          <p className="mt-2 max-w-[440px] text-[13px] leading-[1.6] text-slate-400">
            A detailed 24-hour execution plan for a hackathon, focusing on MVP
            development, presentation and mentor rounds.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {["Hackathon", "MVP"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1 text-[12px] text-slate-200"
              >
                {t}
              </span>
            ))}
            <span className="rounded-full border border-[#c9a45c]/50 bg-[#c9a45c]/10 px-3.5 py-1 text-[12px] font-medium text-[#f0d9a8]">
              High Priority
            </span>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div
              role="progressbar"
              aria-valuenow={PLAN_PROGRESS}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Plan progress"
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]"
            >
              <motion.div
                variants={fill}
                className="h-full rounded-full bg-gradient-to-r from-[#d8bb84] to-[#f0dcae]"
              />
            </div>
            <span className="font-serif text-[16px] text-white">{PLAN_PROGRESS}%</span>
          </div>

          <div className="mt-5 grid grid-cols-3 divide-x divide-white/[0.08]">
            {[
              { icon: SquareCheckBig, value: "9 / 22", label: "Tasks" },
              { icon: Clock, value: "24 hours", label: "Focus time" },
              { icon: Calendar, value: "1 day left", label: "Est. completion" },
            ].map(({ icon: Icon, value, label }, i) => (
              <div
                key={label}
                className={`flex items-center gap-2.5 ${i === 0 ? "pr-3" : "px-3 sm:px-5"}`}
              >
                <Icon className="hidden size-[17px] shrink-0 stroke-[1.5] text-slate-400 sm:block" />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-white">{value}</p>
                  <p className="truncate text-[11.5px] text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function ForgeAI() {
  const [prompt, setPrompt] = useState("");

  const submit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    // TODO: hook up to your Gemini / Forge AI handler
    setPrompt("");
  };

  return (
    <motion.section
      variants={rise}
      className={`${card} relative overflow-hidden border-[#c9a45c]/20 p-6`}
    >
      {/* gold corner arc */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-px -right-px size-[110px] rounded-tr-2xl border-t border-r border-[#c9a45c]/60 [mask-image:radial-gradient(circle_at_100%_0%,black,transparent_70%)]"
      />

      <div className="flex items-center gap-3.5">
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Spark className="size-10 shrink-0 drop-shadow-[0_0_12px_rgba(243,223,184,0.3)]" />
        </motion.div>
        <div>
          <h2 className="font-serif text-[20px] leading-tight font-medium text-white">
            Forge AI
          </h2>
          <p className="mt-0.5 text-[12.5px] text-slate-400">
            Your intelligent productivity partner
          </p>
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-2.5">
        {aiSuggestions.map(({ icon: Icon, label }, i) => (
          <motion.li key={label} variants={row} custom={i}>
            <button
              type="button"
              className={`group flex h-11 w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] px-4 text-left text-[13px] font-medium text-slate-100 transition-colors hover:bg-white/[0.07] ${focusRing}`}
            >
              <Icon className="size-[17px] shrink-0 stroke-[1.6] text-slate-300" />
              <span className="flex-1 truncate">{label}</span>
              <ChevronRight className="size-4 text-slate-500 transition-transform group-hover:translate-x-0.5" />
            </button>
          </motion.li>
        ))}
      </ul>

      <form
        onSubmit={submit}
        className="mt-4 flex h-11 items-center rounded-full border border-white/30 pr-1.5 pl-5 focus-within:border-[#d9b77a]"
      >
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Forge AI anything..."
          aria-label="Ask Forge AI"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          aria-label="Send"
          className={`flex size-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 ${focusRing}`}
        >
          <SendHorizontal className="size-4" />
        </button>
      </form>
    </motion.section>
  );
}

function WeeklyProductivity() {
  const lastIndex = weekly.length - 1;
  return (
    <motion.section variants={rise} className={`${card} p-6`}>
      <SectionHeader
        title="Weekly Productivity"
        action={
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 text-[12px] text-slate-300 ${focusRing}`}
          >
            This Week <ChevronDown className="size-3" />
          </button>
        }
      />

      <div className="mt-6 flex gap-3">
        <div className="flex h-[120px] flex-col justify-between text-right text-[11px] leading-none text-slate-400">
          {CHART_TICKS.map((t) => (
            <span key={t}>{t}h</span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-[120px]">
            <div className="absolute inset-0 flex flex-col justify-between">
              {CHART_TICKS.map((t) => (
                <span key={t} className="h-px w-full bg-white/[0.06]" />
              ))}
            </div>
            <div className="relative flex h-full items-end justify-between gap-2 px-1">
              {weekly.map((d, i) => (
                <motion.div
                  key={d.day}
                  variants={bar}
                  custom={i}
                  role="img"
                  aria-label={`${d.day}: ${d.hours} hours`}
                  title={`${d.hours}h`}
                  style={{ height: `${(d.hours / CHART_MAX) * 100}%` }}
                  className={[
                    "w-full max-w-[30px] origin-bottom rounded-t-md",
                    i === lastIndex
                      ? "bg-gradient-to-b from-[#f0dcae] to-[#a98448]"
                      : "bg-gradient-to-b from-[#26396e] to-[#18264d]",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 flex justify-between gap-2 px-1 text-[11px] text-slate-400">
            {weekly.map((d, i) => (
              <span
                key={d.day}
                className={`w-full max-w-[30px] text-center ${i === lastIndex ? "font-medium text-white" : ""}`}
              >
                {d.day}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function Upcoming() {
  return (
    <motion.section variants={rise} className={`${card} p-6`}>
      <SectionHeader
        title="Upcoming"
        action={
          <a href="/calendar" className={linkGold}>
            View calendar <ArrowRight className="size-3" />
          </a>
        }
      />
      <ul className="mt-5 flex flex-col divide-y divide-white/[0.06]">
        {upcoming.map(({ icon: Icon, title, time }, i) => (
          <motion.li
            key={title}
            variants={row}
            custom={i}
            className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-slate-200 ring-1 ring-white/[0.06]">
              <Icon className="size-[18px] stroke-[1.5]" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-medium text-white">{title}</p>
              <p className="mt-0.5 truncate text-[11.5px] text-slate-400">{time}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}

function RecentActivity() {
  return (
    <motion.section variants={rise} className={`${card} p-6`}>
      <SectionHeader
        title="Recent Activity"
        action={
          <a href="/execution-history" className={linkGold}>
            View all <ArrowRight className="size-3" />
          </a>
        }
      />
      <ul className="mt-5 flex flex-col gap-5">
        {activity.map(({ kind, text, time }, i) => (
          <motion.li
            key={text}
            variants={row}
            custom={i}
            className="flex items-center gap-3.5"
          >
            <span
              className={[
                "flex size-7 shrink-0 items-center justify-center rounded-full",
                kind === "done" && "bg-slate-500/50 text-white",
                kind === "add" && "border border-white/25 bg-[#16223f] text-white",
                kind === "ai" && "text-slate-300",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {kind === "done" && <Check className="size-3.5" />}
              {kind === "add" && <Plus className="size-3.5" />}
              {kind === "ai" && <Zap className="size-4 stroke-[1.5]" />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-white">{text}</p>
              <p className="mt-0.5 text-[11.5px] text-slate-400">{time}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                            */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-screen min-w-screen overflow-hidden bg-[#070d1e] px-4 pt-5 pb-14 sm:px-8 sm:pt-7 lg:px-12 lg:pl-[324px]">
        <BackgroundRings />

        <motion.div
          variants={page}
          initial="hidden"
          animate="show"
          className="mx-auto flex max-w-[1360px] flex-col gap-8"
        >
          <TopBar />
          <Greeting />
          <StatCards />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <ActivePlan />
            <ForgeAI />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-[1.05fr_1fr_0.9fr]">
            <WeeklyProductivity />
            <Upcoming />
            <RecentActivity />
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
