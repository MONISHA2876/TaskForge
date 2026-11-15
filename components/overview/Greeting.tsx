"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { useAuth } from "@/lib/auth-context";

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning, ";
  if (hour < 17) return "Good afternoon, ";
  return "Good evening, ";
}

export function useUserName(): string {
  const { user } = useAuth();
  const raw = user?.email?.split("@")[0] ?? "User";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/* ------------------------------------------------------------------ */
/* Local styles / variants (same values as Dashboard.tsx)               */
/* ------------------------------------------------------------------ */

const card =
  "rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#0e1832]/80 to-[#0a1228]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]";
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9b77a]";

const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

function Spark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="greeting-star" x1="8" y1="6" x2="40" y2="42">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#f3dfb8" />
          <stop offset="1" stopColor="#c9a45c" />
        </linearGradient>
      </defs>
      <path
        d="M22 3c1.2 9.6 4.6 15.6 9.6 18.4C36.2 24 41.4 25.4 46 26c-9.4 1.4-15.2 5-18 10.4-1.6 3-2.8 6.6-3.6 11.6-1-9.4-4.2-15.4-9.2-18.4C10.6 27 6 25.4 1 24.6c9.6-1.6 15.4-5 18.4-10.2C21 11.6 21.6 8 22 3Z"
        fill="url(#greeting-star)"
      />
      <path
        d="M40 4c.3 2.3 1.1 3.5 3 4-1.9.5-2.7 1.7-3 4-.3-2.3-1.1-3.5-3-4 1.9-.5 2.7-1.7 3-4Z"
        fill="#f3dfb8"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export default function Greeting() {
  const [autopilot, setAutopilot] = useState(true);
  const userName = useUserName(); // ✔ hook called inside a component

  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      variants={rise}
      className="flex flex-wrap items-start justify-between gap-5"
    >
      <div>
        <p
          suppressHydrationWarning
          className="text-[12px] tracking-[0.1em] text-slate-400 uppercase"
        >
          {dateLabel}
        </p>
        <h1
          suppressHydrationWarning
          className="mt-3 font-serif text-[28px] leading-tight font-medium text-white sm:text-[34px]"
        >
          {getGreeting()}
          <em className="font-serif text-[#e6c78f] italic">{userName}</em>
        </h1>
        <p className="mt-2 text-[14px] text-slate-300">
          Your AI productivity workspace
        </p>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
          className="mt-4 block h-px w-12 origin-left bg-white/60"
        />
      </div>

      <div className={`${card} flex min-w-[210px] flex-col gap-1.5 px-4 py-3.5`}>
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-[14px] font-medium text-white">
            <Spark className="size-[18px]" />
            Autopilot
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={autopilot}
            aria-label="Autopilot"
            onClick={() => setAutopilot((v) => !v)}
            className={[
              "relative h-6 w-11 rounded-full transition-colors",
              focusRing,
              autopilot ? "bg-[#c9a45c]" : "bg-white/15",
            ].join(" ")}
          >
            <span
              className={[
                "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform",
                autopilot ? "translate-x-5" : "translate-x-0",
              ].join(" ")}
            />
          </button>
        </div>
        <p className="flex items-center gap-2 text-[12px] text-slate-400">
          <span
            className={`size-1.5 rounded-full ${autopilot ? "bg-emerald-400" : "bg-slate-500"}`}
          />
          {autopilot ? "AI managing your plan" : "Autopilot paused"}
        </p>
      </div>
    </motion.div>
  );
}
