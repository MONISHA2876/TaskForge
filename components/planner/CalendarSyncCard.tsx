"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Info, LoaderCircle, Save } from "lucide-react";
import { savePlan } from "@/lib/firestore";
import { useAuth } from "@/lib/auth-context";
import type { GeneratedPlan } from "@/lib/mockPlanner";
import { card, focusRing, linkGold } from "@/components/styles/styles";

type Status = "idle" | "saving" | "saved" | "error";

export default function SavePlanCard({ plan }: { plan: GeneratedPlan }) {
  const { user } = useAuth();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSave() {
    if (status === "saving" || status === "saved") return;

    if (!user) {
      setError("Please sign in to save your plan.");
      setStatus("error");
      return;
    }

    setStatus("saving");
    setError("");

    try {
      const res = await savePlan(plan, user.uid);
      if (res.success) {
        setStatus("saved");
      } else {
        throw new Error("save failed");
      }
    } catch {
      setError("We couldn’t save your plan. Please try again.");
      setStatus("error");
    }
  }

  const saving = status === "saving";
  const saved = status === "saved";

  return (
    <section className={`${card} p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#c9a45c]/40 bg-[#1a1d2b] text-[#e6c78f]">
            <Save className="size-[18px] stroke-[1.7]" />
          </span>
          <div>
            <p className="font-serif text-[16px] leading-tight font-medium text-white">
              Save plan
            </p>
            <p className="mt-1 text-[12.5px] text-slate-400">
              {saved
                ? "Plan saved successfully."
                : "Store this AI-generated plan securely."}
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          whileHover={!saving && !saved ? { scale: 1.03 } : undefined}
          whileTap={!saving && !saved ? { scale: 0.97 } : undefined}
          onClick={() => void handleSave()}
          disabled={saving || saved}
          className={[
            "flex h-10 min-w-[116px] items-center justify-center gap-2 rounded-full px-5 text-[13px] font-semibold transition-[filter,background-color]",
            focusRing,
            saved
              ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              : saving
                ? "bg-white/[0.08] text-slate-300"
                : "bg-gradient-to-r from-[#ecd5a5] via-[#e0bf86] to-[#c9a45c] text-[#1c1406] hover:brightness-110",
          ].join(" ")}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={status === "error" ? "idle" : status}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              {saving ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Saving…
                </>
              ) : saved ? (
                <>
                  <Check className="size-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  {status === "error" ? "Try again" : "Save"}
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {status === "error" && (
          <motion.p
            key="error"
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex items-center gap-2 overflow-hidden rounded-xl border border-rose-400/25 bg-rose-400/10 px-3.5 py-2.5 text-[12.5px] text-rose-200"
          >
            <Info className="size-4 shrink-0" />
            {error}
          </motion.p>
        )}

        {saved && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-2.5">
              <p className="text-[12.5px] text-emerald-200">
                Your plan is saved. You can open it any time from My Plans.
              </p>
              <Link href="/plans" className={linkGold}>
                View my plans <ArrowRight className="size-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}