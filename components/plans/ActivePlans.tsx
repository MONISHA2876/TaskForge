"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PlanCard } from "@/components/plans/PlanCard";
import { useTaskContext } from "@/lib/task-context";
import { getPlanStats, isPlanActive } from "@/lib/utils";

export function ActivePlans() {
  const { plans, taskState } = useTaskContext();
  const activePlans = plans.filter((p) => isPlanActive(p, taskState));

  return (
    <section>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", letterSpacing: "-0.4px" }}>
          Active Plans
        </h2>
        <button style={{ fontSize: "13px", color: "#4F46E5", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}>
          View history
        </button>
      </div>

      {activePlans.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center", padding: "80px 0", color: "#9CA3AF", fontSize: "15px" }}
        >
          🎉 All plans completed! Start a new one.
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          {activePlans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ delay: idx * 0.07, duration: 0.25 }}
            >
              <PlanCard plan={plan} stats={getPlanStats(plan, taskState)} />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </section>
  );
}
