"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { savePlan } from "@/lib/firestore";
import { useAuth } from "@/lib/auth-context";

interface SavePlanCardProps {
  plan: any;
}

export default function SavePlanCard({ plan }: SavePlanCardProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();

  async function handleSave() {
    if (saving || saved) return;

    setSaving(true);

    if (!user) {
      alert("Please sign in to save your plan.");
      setSaving(false);
      return;
    }

    const res = await savePlan(plan, user.uid);

    setSaving(false);

    if (res.success) {
      setSaved(true);
    } else {
      alert("Failed to save plan.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: 0.75,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
            💾
          </div>

          <div>
            <p className="text-[13px] font-semibold text-[#111827]">
              Save Plan
            </p>

            <p className="text-[11px] text-[#9CA3AF]">
              {saved
                ? "Plan saved successfully."
                : "Store this AI generated plan securely."}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={!saved && !saving ? { scale: 1.04 } : {}}
          whileTap={!saved && !saving ? { scale: 0.97 } : {}}
          onClick={handleSave}
          disabled={saving || saved}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 min-w-[110px] justify-center ${
            saved
              ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
              : saving
                ? "bg-[#F5F3FF] text-[#6B7280] border border-[#E5E7EB]"
                : "bg-[#4F46E5] text-white hover:bg-[#4338CA]"
          }`}
        >
          <AnimatePresence mode="wait">
            {saving ? (
              <motion.div
                key="saving"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  ⏳
                </motion.div>
                Saving...
              </motion.div>
            ) : saved ? (
              <motion.div
                key="saved"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                ✅ Saved
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                💾 Save
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-4"
          >
            <div className="rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-2">
              <p className="text-[11px] font-medium text-[#059669]">
                🎉 Your AI plan has been saved successfully. You will be able to
                access it later from the MY PLANS section.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
