"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck, Check, Clock } from "lucide-react";
import { useTaskContext } from "@/lib/task-context";
import { getTasksForDate, getTodayDateString } from "@/lib/utils";
import type { Task } from "@/types";
import { card, focusRing, rise, row } from "@/components/styles/styles";

/* ------------------------------------------------------------------ */
/* Small pieces                                                         */
/* ------------------------------------------------------------------ */

const priorityStyles: Record<string, string> = {
  High: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  Medium: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  Low: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
};

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${
        priorityStyles[priority] ?? "border-white/10 bg-white/[0.05] text-slate-300"
      }`}
    >
      {priority}
    </span>
  );
}

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
          : "border-white/30 text-transparent hover:border-[#d9b77a]",
      ].join(" ")}
    >
      <Check className="size-3 stroke-[3]" />
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Task card                                                            */
/* ------------------------------------------------------------------ */

interface UpcomingTaskCardProps {
  task: Task;
  isCompleted: boolean;
  isHighlighted?: boolean;
  onToggle: (id: string) => void;
}

export function UpcomingTaskCard({
  task,
  isCompleted,
  isHighlighted,
  onToggle,
}: UpcomingTaskCardProps) {
  const highlighted = isHighlighted && !isCompleted;

  return (
    <div
      className={[
        "flex gap-3.5 rounded-xl border p-4 transition-colors duration-200",
        highlighted
          ? "border-[#c9a45c]/50 bg-[#c9a45c]/[0.06] ring-1 ring-[#c9a45c]/15"
          : "border-white/[0.07] bg-white/[0.035] hover:bg-white/[0.05]",
        isCompleted ? "opacity-50" : "",
      ].join(" ")}
    >
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
          {highlighted && (
            <span className="rounded-full border border-[#c9a45c]/50 bg-[#c9a45c]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#f0d9a8]">
              Next up
            </span>
          )}
          <PriorityBadge priority={task.priority} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

export function UpcomingTasks() {
  const { plans, taskState, toggleTask } = useTaskContext();

  const tasks = getTasksForDate(plans, getTodayDateString())
    .filter((task) => !(taskState[task.id] ?? task.completed))

  return (
    <motion.section variants={rise} className={`${card} p-6`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-[16.5px] font-medium text-white">
          Upcoming today
        </h2>
      </div>

      {tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-6 flex flex-col items-center gap-3 py-8 text-center"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-white/[0.06] text-slate-300 ring-1 ring-white/[0.06]">
            <CalendarCheck className="size-5 stroke-[1.5]" />
          </span>
          <p className="text-[13px] text-slate-400">
            No tasks scheduled for today.
          </p>
        </motion.div>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {tasks.map((task, idx) => (
              <motion.li
                key={task.id}
                layout
                variants={row}
                custom={idx}
                exit={{ opacity: 0, x: 16, transition: { duration: 0.2 } }}
              >
                <UpcomingTaskCard
                  task={task}
                  isCompleted={taskState[task.id] ?? task.completed}
                  isHighlighted={idx === 0}
                  onToggle={toggleTask}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.section>
  );
}

export default UpcomingTasks;