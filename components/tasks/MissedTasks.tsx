"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, CircleCheck, Clock } from "lucide-react";
import { useTaskContext } from "@/lib/task-context";
import { getMissedTasks } from "@/lib/utils";
import type { Task } from "@/types";
import { card, focusRing, rise, row } from "@/components/styles/styles"; 

const MAX_MISSED = 3;

/* ------------------------------------------------------------------ */
/* Small pieces                                                         */
/* ------------------------------------------------------------------ */

function TaskCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      whileTap={{ scale: 0.88 }}
      onClick={onChange}
      className={[
        "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
        focusRing,
        checked
          ? "border-[#e0bf86] bg-gradient-to-br from-[#ecd5a5] to-[#c9a45c] text-[#1c1406]"
          : "border-rose-300/40 text-transparent hover:border-[#d9b77a]",
      ].join(" ")}
    >
      <Check className="size-3 stroke-[3]" />
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Task card                                                            */
/* ------------------------------------------------------------------ */

interface MissedTaskCardProps {
  task: Task;
  isCompleted: boolean;
  onToggle: (id: string) => void;
  onReschedule?: (id: string) => void;
}

export function MissedTaskCard({
  task,
  isCompleted,
  onToggle,
  onReschedule,
}: MissedTaskCardProps) {
  return (
    <div
      className={`flex flex-col gap-3.5 rounded-xl border border-rose-400/20 bg-rose-400/[0.05] p-4 transition-opacity duration-200 ${
        isCompleted ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className="mt-0.5">
          <TaskCheckbox
            checked={isCompleted}
            onChange={() => onToggle(task.id)}
            label={`Mark "${task.title}" as ${isCompleted ? "incomplete" : "complete"}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-[14px] leading-snug font-medium ${
              isCompleted ? "text-slate-500 line-through" : "text-white"
            }`}
          >
            {task.title}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-[12px] text-slate-400">
              <Clock className="size-3" />
              {task.time} · {task.duration}
            </span>
            <span className="rounded-full border border-rose-400/25 bg-rose-400/10 px-2.5 py-0.5 text-[11px] font-medium text-rose-300">
              Overdue
            </span>
          </div>
        </div>
      </div>

      {!isCompleted && (
        <div className="flex flex-wrap gap-2.5 pl-[34px]">
          <button
            type="button"
            onClick={() => onToggle(task.id)}
            className={`rounded-full bg-gradient-to-r from-[#ecd5a5] via-[#e0bf86] to-[#c9a45c] px-4 py-1.5 text-[12px] font-semibold text-[#1c1406] transition-[filter] hover:brightness-110 active:scale-[0.97] ${focusRing}`}
          >
            Mark complete
          </button>
          <button
            type="button"
            onClick={() => onReschedule?.(task.id)}
            className={`rounded-full border border-white/15 px-4 py-1.5 text-[12px] font-medium text-slate-200 transition-colors hover:bg-white/[0.06] hover:text-white active:scale-[0.97] ${focusRing}`}
          >
            Reschedule
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

interface MissedTasksProps {
  maxVisible?: number;
  onReschedule?: (id: string) => void;
}

export function MissedTasks({
  maxVisible = MAX_MISSED,
  onReschedule,
}: MissedTasksProps) {
  const { plans, taskState, toggleTask } = useTaskContext();

  const allMissed = getMissedTasks(plans, taskState);
  const missed = allMissed.slice(0, maxVisible);

  return (
    <motion.section variants={rise} className={`${card} p-6`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-[16.5px] font-medium text-white">Missed</h2>
        {allMissed.length > 0 && (
          <span className="rounded-full border border-rose-400/25 bg-rose-400/10 px-2.5 py-0.5 text-[11.5px] font-medium text-rose-300">
            {allMissed.length}
          </span>
        )}
      </div>

      {missed.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-6 flex flex-col items-center gap-3 py-8 text-center"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20">
            <CircleCheck className="size-5 stroke-[1.5]" />
          </span>
          <p className="text-[13px] text-slate-400">All caught up</p>
        </motion.div>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {missed.map((task, idx) => (
              <motion.li
                key={task.id}
                layout
                variants={row}
                custom={idx}
                exit={{ opacity: 0, x: 16, transition: { duration: 0.2 } }}
              >
                <MissedTaskCard
                  task={task}
                  isCompleted={taskState[task.id] ?? task.completed}
                  onToggle={toggleTask}
                  onReschedule={onReschedule}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.section>
  );
}

export default MissedTasks;
