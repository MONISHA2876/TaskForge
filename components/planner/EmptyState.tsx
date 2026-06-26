"use client";

import { motion } from "framer-motion";

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center h-full gap-6 py-16"
    >
      {/* Illustration */}
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-[#EEF2FF] blur-2xl scale-150 opacity-60" />

        {/* Main illustration */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background circle */}
            <circle cx="80" cy="80" r="70" fill="#F5F3FF" />

            {/* Calendar base */}
            <rect x="40" y="45" width="80" height="70" rx="10" fill="white" stroke="#E5E7EB" strokeWidth="1.5"/>
            <rect x="40" y="45" width="80" height="18" rx="10" fill="#4F46E5"/>
            <rect x="40" y="55" width="80" height="8" fill="#4F46E5"/>

            {/* Calendar dots */}
            <circle cx="57" cy="40" r="3.5" fill="#C4B5FD" stroke="white" strokeWidth="1.5"/>
            <circle cx="103" cy="40" r="3.5" fill="#C4B5FD" stroke="white" strokeWidth="1.5"/>

            {/* Grid lines */}
            {[78, 92, 106].map((y) => (
              <line key={y} x1="52" y1={y} x2="108" y2={y} stroke="#F3F4F6" strokeWidth="1"/>
            ))}
            {[72, 88, 104].map((x) => (
              <line key={x} x1={x} y1="72" x2={x} y2="108" stroke="#F3F4F6" strokeWidth="1"/>
            ))}

            {/* Task blocks */}
            <rect x="52" y="74" width="14" height="10" rx="3" fill="#C7D2FE"/>
            <rect x="72" y="74" width="20" height="10" rx="3" fill="#4F46E5"/>
            <rect x="52" y="88" width="28" height="10" rx="3" fill="#BFDBFE"/>
            <rect x="84" y="88" width="8" height="10" rx="3" fill="#FDE68A"/>
            <rect x="52" y="102" width="12" height="10" rx="3" fill="#A7F3D0"/>
            <rect x="68" y="102" width="24" height="10" rx="3" fill="#FECACA"/>

            {/* AI sparkle */}
            <motion.g
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "125px 45px" }}
            >
              <circle cx="125" cy="45" r="14" fill="#4F46E5"/>
              <path d="M125 38L126.5 42.5L131 44L126.5 45.5L125 50L123.5 45.5L119 44L123.5 42.5L125 38Z" fill="white"/>
            </motion.g>
          </svg>
        </motion.div>
      </div>

      {/* Copy */}
      <div className="text-center max-w-xs">
        <h3 className="text-[17px] font-semibold text-[#111827] tracking-tight">Your plan will appear here</h3>
        <p className="text-[13px] text-[#6B7280] mt-2 leading-relaxed">
          Describe your goals on the left and I'll generate a personalized, time-blocked schedule.
        </p>
      </div>

      {/* Mini feature hints */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {[
          { icon: "📋", text: "Time-blocked daily schedule" },
          { icon: "🧠", text: "AI reasoning for each block" },
          { icon: "📅", text: "Google Calendar sync (soon)" },
        ].map((hint, i) => (
          <motion.div
            key={hint.text}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.2 + i * 0.08 }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#FAFBFC] border border-[#F3F4F6]"
          >
            <span className="text-base">{hint.icon}</span>
            <span className="text-[12px] text-[#6B7280] font-medium">{hint.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
