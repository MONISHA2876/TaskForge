"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import {
  BrainCircuit,
  Calendar,
  ChevronLeft,
  Circle,
  CircleCheck,
  Clock,
  Coffee,
  LoaderCircle,
  SendHorizontal,
  Sparkles,
  Target,
  Timer,
  X,
} from "lucide-react";
import { useTaskContext } from "@/lib/task-context";
import { getPlanStats } from "@/lib/utils";
import type { Plan, Task } from "@/types";
import Sidebar from "@/components/layout/SideBar";
import { card, focusRing, linkGold, page, rise, row } from "@/components/styles/styles"; 

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/* ------------------------------------------------------------------ */
/* Badges                                                               */
/* ------------------------------------------------------------------ */

const badgeBase =
  "rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap";
const badgeFallback = "border-white/10 bg-white/[0.05] text-slate-300";

const priorityStyles: Record<string, string> = {
  High: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  Medium: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  Low: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
};

const periodStyles: Record<string, string> = {
  Morning: "border-orange-400/25 bg-orange-400/10 text-orange-300",
  Afternoon: "border-sky-400/25 bg-sky-400/10 text-sky-300",
  Evening: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  Night: "border-slate-400/25 bg-slate-400/10 text-slate-300",
};

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`${badgeBase} ${priorityStyles[priority] ?? badgeFallback}`}>
      {priority}
    </span>
  );
}

function PeriodBadge({ period }: { period: string }) {
  return (
    <span className={`${badgeBase} ${periodStyles[period] ?? badgeFallback}`}>
      {period}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Progress bar                                                         */
/* ------------------------------------------------------------------ */

function ProgressBar({
  percentage,
  className = "h-1.5",
  delay = 0.5,
}: {
  percentage: number;
  className?: string;
  delay?: number;
}) {
  const pct = Math.max(0, Math.min(100, percentage));
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`overflow-hidden rounded-full bg-white/[0.08] ${className}`}
    >
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-[#d8bb84] to-[#f0dcae]"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: "easeOut", delay }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AI Chat Panel                                                        */
/* ------------------------------------------------------------------ */

interface ChatPanelProps {
  task: Task;
  plan: Plan;
  onClose: () => void;
}

function ChatPanel({ task, plan, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Kick off first Gemini call automatically
  useEffect(() => {
    async function startSession() {
      setLoading(true);
      try {
        const res = await fetch("/api/plan-help", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskTitle: task.title,
            taskType: task.taskType,
            priority: task.priority,
            duration: task.duration,
            period: task.period,
            aiNote: task.aiNote,
            planHeading: plan.heading,
            planSummary: plan.summary,
            userInput: "",
            conversation: [],
          }),
        });
        const data = await res.json();
        setMessages([{ role: "assistant", content: data.message }]);
      } catch {
        setMessages([
          {
            role: "assistant",
            content:
              "Hi! I'm having trouble connecting right now. Please try again in a moment.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    void startSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id]);

  async function sendMessage() {
    const trimmed = draft.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setDraft("");
    setLoading(true);

    try {
      const res = await fetch("/api/plan-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle: task.title,
          taskType: task.taskType,
          priority: task.priority,
          duration: task.duration,
          period: task.period,
          aiNote: task.aiNote,
          planHeading: plan.heading,
          planSummary: plan.summary,
          userInput: trimmed,
          conversation: nextMessages,
        }),
      });
      const data = await res.json();
      setMessages([...nextMessages, { role: "assistant", content: data.message }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  const canSend = draft.trim().length > 0 && !loading;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      aria-label="AI Help Studio"
      className={`${card} fixed inset-x-3 bottom-3 z-50 flex h-[78vh] flex-col overflow-hidden border-[#c9a45c]/20 bg-[#0a1228] shadow-2xl shadow-black/50 lg:sticky lg:inset-auto lg:top-24 lg:z-auto lg:h-[calc(100vh-8rem)] lg:shadow-none`}
    >
      {/* Header */}
      <div className="border-b border-white/[0.07] bg-gradient-to-br from-[#c9a45c]/[0.12] to-transparent px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl border border-[#c9a45c]/40 bg-[#1a1d2b] text-[#e6c78f]">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="font-serif text-[16px] leading-tight font-medium text-white">
                AI Help Studio
              </p>
              <p className="mt-0.5 text-[11.5px] text-slate-400">Powered by Gemini</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className={`flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.07] hover:text-white ${focusRing}`}
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5">
          <p className="text-[11px] text-slate-400">Helping with</p>
          <p className="mt-0.5 text-[13px] leading-snug font-medium text-white">
            {task.title}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-5"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <span className="mt-0.5 mr-2.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#c9a45c]/30 bg-[#1a1d2b] text-[#e6c78f]">
                  <Sparkles className="size-3.5" />
                </span>
              )}
              <div
                className={[
                  "max-w-[82%] px-3.5 py-2.5 text-[13px] leading-[1.6] whitespace-pre-wrap",
                  msg.role === "user"
                    ? "rounded-2xl rounded-br-sm bg-gradient-to-r from-[#ecd5a5] to-[#c9a45c] font-medium text-[#1c1406]"
                    : "rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.05] text-slate-100",
                ].join(" ")}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#c9a45c]/30 bg-[#1a1d2b] text-[#e6c78f]">
              <Sparkles className="size-3.5" />
            </span>
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.05] px-3.5 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  className="size-1.5 rounded-full bg-[#d9b77a]"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.07] px-4 py-4">
        <div className="flex items-end gap-2.5 rounded-2xl border border-white/15 bg-white/[0.04] py-2.5 pr-2.5 pl-4 focus-within:border-[#d9b77a]/70">
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your reply..."
            aria-label="Message Forge AI"
            rows={2}
            className="min-w-0 flex-1 resize-none bg-transparent text-[13px] leading-[1.5] text-white outline-none placeholder:text-slate-500"
          />
          <motion.button
            type="button"
            whileHover={canSend ? { scale: 1.06 } : undefined}
            whileTap={canSend ? { scale: 0.94 } : undefined}
            onClick={() => void sendMessage()}
            disabled={!canSend}
            aria-label="Send message"
            className={[
              "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
              focusRing,
              canSend
                ? "bg-gradient-to-r from-[#ecd5a5] to-[#c9a45c] text-[#1c1406]"
                : "bg-white/[0.08] text-slate-500",
            ].join(" ")}
          >
            <SendHorizontal className="size-4" />
          </motion.button>
        </div>
        <p className="mt-2.5 text-center text-[11px] text-slate-500">
          Shift+Enter for new line · Enter to send
        </p>
      </div>
    </motion.aside>
  );
}

/* ------------------------------------------------------------------ */
/* Task card                                                            */
/* ------------------------------------------------------------------ */

interface TaskCardProps {
  task: Task;
  index: number;
  isCompleted: boolean;
  isActive: boolean;
  onToggle: (task: Task) => void;
  onAskAI: (task: Task) => void;
}

function TaskCard({
  task,
  index,
  isCompleted,
  isActive,
  onToggle,
  onAskAI,
}: TaskCardProps) {
  return (
    <motion.div
      variants={row}
      custom={index}
      className={[
        "rounded-xl border p-4 transition-colors duration-200",
        isActive
          ? "border-[#c9a45c]/50 bg-[#c9a45c]/[0.06] ring-1 ring-[#c9a45c]/15"
          : "border-white/[0.07] bg-white/[0.035] hover:bg-white/[0.05]",
        isCompleted ? "opacity-60" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-3.5">
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(task)}
          role="checkbox"
          aria-checked={isCompleted}
          aria-label={`Mark "${task.title}" as ${isCompleted ? "incomplete" : "complete"}`}
          className={`mt-0.5 shrink-0 rounded-full transition-colors ${focusRing} ${
            isCompleted ? "text-[#e0bf86]" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {isCompleted ? (
            <CircleCheck className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p
            className={`text-[14px] leading-snug font-medium ${
              isCompleted ? "text-slate-500 line-through" : "text-white"
            }`}
          >
            {task.title}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-[12px] text-slate-400">
              <Clock className="size-3" />
              {task.time} · {task.duration}
            </span>
            <PeriodBadge period={task.period} />
            <PriorityBadge priority={task.priority} />
            <span className={`${badgeBase} ${badgeFallback}`}>{task.taskType}</span>
          </div>

          {task.aiNote && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#c9a45c]/25 bg-[#c9a45c]/[0.07] px-2.5 py-1.5">
              <Sparkles className="size-3 shrink-0 text-[#e6c78f]" />
              <span className="text-[12px] text-[#f0d9a8]">{task.aiNote}</span>
            </div>
          )}
        </div>

        {/* Ask AI */}
        {!isCompleted && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onAskAI(task)}
            aria-pressed={isActive}
            className={[
              "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors",
              focusRing,
              isActive
                ? "bg-gradient-to-r from-[#ecd5a5] to-[#c9a45c] text-[#1c1406]"
                : "border border-[#c9a45c]/40 text-[#ecd5a5] hover:bg-[#c9a45c]/10",
            ].join(" ")}
          >
            <BrainCircuit className="size-3.5" />
            {isActive ? "Chatting" : "Ask AI"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Day section                                                          */
/* ------------------------------------------------------------------ */

interface DaySectionProps {
  day: Plan["days"][0];
  taskState: Record<string, boolean>;
  activeTaskId: string | null;
  onToggle: (task: Task) => void;
  onAskAI: (task: Task) => void;
}

function DaySection({
  day,
  taskState,
  activeTaskId,
  onToggle,
  onAskAI,
}: DaySectionProps) {
  const completed = day.items.filter((t) => taskState[t.id] ?? t.completed).length;
  const total = day.items.length;
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="border-t border-white/[0.06] pt-7 first:border-t-0 first:pt-0">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-[16px] font-medium text-white">{day.day}</h3>
          <p className="mt-0.5 text-[12px] text-slate-400">{day.date}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-slate-300">
            {completed}/{total}
          </span>
          <ProgressBar percentage={pct} className="h-1 w-16" delay={0.4} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {day.items.map((task, i) => (
          <TaskCard
            key={task.id}
            task={task}
            index={i}
            isCompleted={taskState[task.id] ?? task.completed}
            isActive={activeTaskId === task.id}
            onToggle={onToggle}
            onAskAI={onAskAI}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function PlanDetailPage() {
  const params = useParams<{ planId: string }>();
  const { plans, taskState, toggleTask } = useTaskContext();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const plan = useMemo(
    () => plans.find((p) => p.id === params?.planId) ?? null,
    [plans, params?.planId],
  );

  const stats = useMemo(
    () => (plan ? getPlanStats(plan, taskState) : null),
    [plan, taskState],
  );

  function handleAskAI(task: Task) {
    setActiveTask((prev) => (prev?.id === task.id ? null : task));
  }

  function handleTaskToggle(task: Task) {
    const wasCompleted = taskState[task.id] ?? task.completed;
    toggleTask(task.id);
    // Close the chat when the task being discussed gets completed
    if (!wasCompleted && activeTask?.id === task.id) setActiveTask(null);
  }

  /* Loading */
  if (!plan) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070d1e]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <LoaderCircle className="size-6 animate-spin text-[#d9b77a]" />
          <p className="text-[13px]">Loading plan...</p>
        </div>
      </div>
    );
  }

  const completionPct = stats?.completionPercentage ?? 0;
  const tiles = [
    { icon: Timer, label: "Focus", value: plan.focusTime },
    { icon: Coffee, label: "Breaks", value: plan.breakTime },
    { icon: Calendar, label: "Est. done", value: plan.completionEstimate },
    { icon: Target, label: "Remaining", value: `${stats?.remainingTasks ?? 0} tasks` },
  ];

  return (
    <>
    <Sidebar/>
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-screen bg-[#070d1e] text-white lg:pl-[300px]">
        {/* soft ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_70%_45%_at_85%_-10%,rgba(90,125,230,0.12),transparent_70%)]"
        />

        <motion.div variants={page} initial="hidden" animate="show">
          {/* Top bar */}
          <motion.header
            variants={rise}
            className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#070d1e]/80 backdrop-blur-md"
          >
            <div className="flex h-[60px] items-center justify-between gap-4 pr-4 pl-16 sm:pr-8 lg:px-12">
              <div className="flex min-w-0 items-center gap-4">
                <span className="hidden truncate font-serif text-[15px] text-white sm:block">
                  {plan.heading}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden text-[12.5px] text-slate-400 sm:block">
                  {stats?.completedTasks ?? 0}/{stats?.totalTasks ?? 0} tasks
                </span>
                <span className="rounded-full border border-[#c9a45c]/50 bg-[#c9a45c]/10 px-3 py-1 text-[12px] font-medium text-[#f0d9a8]">
                  {completionPct}% complete
                </span>
              </div>
            </div>
          </motion.header>

          <div className="mx-auto flex max-w-[1360px] flex-col gap-8 px-4 pt-8 pb-14 sm:px-8 lg:px-12">
            {/* Plan header */}
            <motion.section variants={rise} className={`${card} relative p-6 sm:p-7`}>
              <span
                aria-hidden="true"
                className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/60 to-transparent"
              />

              <div className="flex flex-wrap items-start justify-between gap-8">
                <div className="min-w-[260px] flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="rounded-full border border-[#c9a45c]/40 bg-[#c9a45c]/10 px-3 py-0.5 text-[11.5px] font-medium text-[#f0d9a8]">
                      {plan.planType}
                    </span>
                    <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-0.5 text-[11.5px] font-medium text-emerald-300">
                      Score: {plan.productivityScore}
                    </span>
                  </div>
                  <h1 className="mt-4 font-serif text-[26px] leading-tight font-medium text-white sm:text-[30px]">
                    {plan.heading}
                  </h1>
                  <p className="mt-2.5 max-w-[520px] text-[13.5px] leading-[1.65] text-slate-400">
                    {plan.summary}
                  </p>
                </div>

                <div className="grid w-full grid-cols-2 gap-3 sm:w-auto sm:grid-cols-4">
                  {tiles.map(({ icon: Icon, label, value }, i) => (
                    <motion.div
                      key={label}
                      variants={row}
                      custom={i}
                      className="min-w-[96px] rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3.5"
                    >
                      <Icon className="size-4 stroke-[1.6] text-[#d9b77a]" />
                      <p className="mt-2.5 font-serif text-[16px] leading-none text-white">
                        {value}
                      </p>
                      <p className="mt-1.5 text-[11.5px] text-slate-400">{label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <span className="text-[12.5px] text-slate-400">
                    Overall progress — {stats?.completedTasks ?? 0} of{" "}
                    {stats?.totalTasks ?? 0} tasks done
                  </span>
                  <span className="font-serif text-[16px] text-white">
                    {completionPct}%
                  </span>
                </div>
                <ProgressBar percentage={completionPct} className="h-1.5" />
              </div>
            </motion.section>

            {/* Timeline + chat */}
            <div
              className={`grid grid-cols-1 items-start gap-6 transition-[grid-template-columns] duration-300 ${
                activeTask ? "lg:grid-cols-[minmax(0,1fr)_400px]" : "lg:grid-cols-[minmax(0,1fr)]"
              }`}
            >
              <motion.section variants={rise} className={`${card} p-6 sm:p-7`}>
                <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-[19px] font-medium text-white">
                      Plan Timeline
                    </h2>
                    <p className="mt-1 text-[12.5px] text-slate-400">
                      Work through your tasks · tap “Ask AI” for guided help on any task
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[12px] text-slate-300">
                    {stats?.remainingTasks ?? 0} remaining
                  </span>
                </div>

                <div className="flex flex-col gap-7">
                  {plan.days.map((day) => (
                    <DaySection
                      key={`${day.day}-${day.date}`}
                      day={day}
                      taskState={taskState}
                      activeTaskId={activeTask?.id ?? null}
                      onToggle={handleTaskToggle}
                      onAskAI={handleAskAI}
                    />
                  ))}
                </div>
              </motion.section>

              <AnimatePresence mode="wait">
                {activeTask && (
                  <ChatPanel
                    key={activeTask.id}
                    task={activeTask}
                    plan={plan}
                    onClose={() => setActiveTask(null)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </MotionConfig>
    </>
  );
}
