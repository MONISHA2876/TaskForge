"use client";

import { motion } from "framer-motion";

export default function PlannerHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between px-8 py-5 border-b border-[#E5E7EB] bg-[#FAFBFC]"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#4F46E5] flex items-center justify-center shadow-sm">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1.5C8 1.5 3 4 3 8.5C3 11.26 5.24 13.5 8 13.5C10.76 13.5 13 11.26 13 8.5C13 4 8 1.5 8 1.5Z" fill="white" fillOpacity="0.9"/>
            <circle cx="8" cy="8.5" r="2" fill="white"/>
          </svg>
        </div>
        <div>
          <h1 className="text-[15px] font-semibold text-[#111827] tracking-tight">Deadline Guardian</h1>
          <p className="text-[11px] text-[#6B7280] font-medium">AI Planner</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[11px] font-medium text-[#059669]">AI Ready</span>
        </div>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F3F4F6] transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="#9CA3AF" strokeWidth="1.5"/>
            <path d="M8 5.5V8.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="8" cy="10.5" r="0.75" fill="#9CA3AF"/>
          </svg>
        </button>
      </div>
    </motion.header>
  );
}
