"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarSyncCard() {
  const [synced, setSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    if (synced || syncing) return;
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSynced(true);
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Google Calendar icon */}
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="14" height="14" rx="2.5" fill="white" stroke="#E5E7EB" strokeWidth="1.2"/>
              <rect x="3" y="3" width="14" height="5" rx="2.5" fill="#4285F4"/>
              <rect x="3" y="6" width="14" height="2" fill="#4285F4"/>
              <line x1="7" y1="3" x2="7" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="13" y1="3" x2="13" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <rect x="6" y="10" width="3" height="2.5" rx="0.5" fill="#EA4335" fillOpacity="0.8"/>
              <rect x="11" y="10" width="3" height="2.5" rx="0.5" fill="#34A853" fillOpacity="0.8"/>
              <rect x="6" y="14" width="3" height="2" rx="0.5" fill="#FBBC04" fillOpacity="0.8"/>
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#111827]">Add to Google Calendar</p>
            <p className="text-[11px] text-[#9CA3AF]">
              {synced ? "Schedule synced successfully" : "OAuth integration (coming soon)"}
            </p>
          </div>
        </div>

        {/* Button */}
        <motion.button
          whileHover={!synced && !syncing ? { scale: 1.04 } : {}}
          whileTap={!synced && !syncing ? { scale: 0.97 } : {}}
          onClick={handleSync}
          disabled={syncing}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 min-w-[100px] justify-center ${
            synced
              ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
              : syncing
              ? "bg-[#F5F3FF] text-[#6B7280] border border-[#E5E7EB]"
              : "bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm"
          }`}
        >
          <AnimatePresence mode="wait">
            {syncing ? (
              <motion.div
                key="syncing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5"
              >
                <motion.svg
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  width="13" height="13" viewBox="0 0 13 13" fill="none"
                >
                  <path d="M6.5 1.5C3.74 1.5 1.5 3.74 1.5 6.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                </motion.svg>
                Syncing
              </motion.div>
            ) : synced ? (
              <motion.div
                key="synced"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2.5 6.5L5.3 9.3L10.5 4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Synced!
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1.5"
              >
                <span>📅</span>
                Sync
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Success strip */}
      <AnimatePresence>
        {synced && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" fill="#10B981"/>
                <path d="M4.5 7L6.3 8.8L9.5 5.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-[11px] font-medium text-[#059669]">
                Your schedule is ready to sync — Google Calendar API integration coming soon.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
