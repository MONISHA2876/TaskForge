"use client";

import { motion } from "motion/react";
import { BrainCircuit, Calendar, ListChecks, type LucideIcon } from "lucide-react";

const HINTS: { icon: LucideIcon; text: string }[] = [
  { icon: ListChecks, text: "Time-blocked daily schedule" },
  { icon: BrainCircuit, text: "AI reasoning for each block" },
  { icon: Calendar, text: "Google Calendar sync (soon)" },
];

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex min-h-[420px] flex-col items-center justify-center gap-7 py-16"
    >
      {/* Illustration */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-150 rounded-full bg-[#c9a45c]/15 blur-3xl"
        />
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="es-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ecd5a5" />
                <stop offset="1" stopColor="#c9a45c" />
              </linearGradient>
            </defs>

            <circle cx="80" cy="80" r="70" fill="#0f1a38" stroke="rgba(255,255,255,0.06)" />

            {/* Calendar */}
            <rect x="40" y="45" width="80" height="70" rx="10" fill="#0b1329" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
            <rect x="40" y="45" width="80" height="18" rx="10" fill="url(#es-gold)" />
            <rect x="40" y="55" width="80" height="8" fill="url(#es-gold)" />
            <circle cx="57" cy="40" r="3.5" fill="#d9b77a" stroke="#0b1329" strokeWidth="1.5" />
            <circle cx="103" cy="40" r="3.5" fill="#d9b77a" stroke="#0b1329" strokeWidth="1.5" />

            {[78, 92, 106].map((y) => (
              <line key={y} x1="52" y1={y} x2="108" y2={y} stroke="rgba(255,255,255,0.06)" />
            ))}
            {[72, 88, 104].map((x) => (
              <line key={x} x1={x} y1="72" x2={x} y2="108" stroke="rgba(255,255,255,0.06)" />
            ))}

            {/* Task blocks */}
            <rect x="52" y="74" width="14" height="10" rx="3" fill="#2f4380" />
            <rect x="72" y="74" width="20" height="10" rx="3" fill="#d9b77a" />
            <rect x="52" y="88" width="28" height="10" rx="3" fill="#26396e" />
            <rect x="84" y="88" width="8" height="10" rx="3" fill="#f0dcae" />
            <rect x="52" y="102" width="12" height="10" rx="3" fill="#2f8f74" />
            <rect x="68" y="102" width="24" height="10" rx="3" fill="#b4586a" />

            {/* AI sparkle */}
            <motion.g
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.92, 1.08, 0.92] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "125px 45px", transformBox: "view-box" }}
            >
              <circle cx="125" cy="45" r="14" fill="url(#es-gold)" />
              <path
                d="M125 38L126.5 42.5L131 44L126.5 45.5L125 50L123.5 45.5L119 44L123.5 42.5L125 38Z"
                fill="#1c1406"
              />
            </motion.g>
          </svg>
        </motion.div>
      </div>

      {/* Copy */}
      <div className="max-w-xs text-center">
        <h3 className="font-serif text-[21px] font-medium text-white">
          Your plan will appear here
        </h3>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-400">
          Describe your goals on the left and I’ll generate a personalized,
          time-blocked schedule.
        </p>
      </div>

      {/* Feature hints */}
      <ul className="flex w-full max-w-xs flex-col gap-2.5">
        {HINTS.map(({ icon: Icon, text }, i) => (
          <motion.li
            key={text}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.25 + i * 0.08 }}
            className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3.5 py-2.5"
          >
            <Icon className="size-4 shrink-0 stroke-[1.6] text-[#d9b77a]" />
            <span className="text-[12.5px] text-slate-300">{text}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}