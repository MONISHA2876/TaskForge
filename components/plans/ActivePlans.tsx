"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { PlanCard } from "@/components/plans/PlanCard";
import { useTaskContext } from "@/lib/task-context";
import { getPlanStats, isPlanActive } from "@/lib/utils";
import { card, focusRing, linkGold, rise, item } from "@/components/styles/styles"; 


export function ActivePlans() {
  const { plans, taskState } = useTaskContext();
  const activePlans = plans.filter((p) => isPlanActive(p, taskState));

  return (
    <motion.section variants={rise}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-serif text-[19px] font-medium text-white">
          Active Plans
        </h2>
        <button type="button" className={`${linkGold} ${focusRing}`}>
          View history <ArrowRight className="size-3" />
        </button>
      </div>

      {activePlans.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`${card} flex flex-col items-center gap-3 px-6 py-16 text-center`}
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-[#c9a45c]/10 text-[#ecd5a5] ring-1 ring-[#c9a45c]/25">
            <Sparkles className="size-5 stroke-[1.5]" />
          </span>
          <p className="font-serif text-[17px] text-white">All plans completed</p>
          <p className="text-[13px] text-slate-400">
            Start a new plan to keep your streak going.
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {activePlans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                layout
                variants={item}
                custom={idx}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
              >
                <PlanCard plan={plan} stats={getPlanStats(plan, taskState)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
}

export default ActivePlans;
