"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  BrainCircuit,
  SendHorizonal,
  X,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  Calendar,
  Target,
  Timer,
  Coffee,
} from "lucide-react";
import { useTaskContext } from "@/lib/task-context";
import { getPlanStats } from "@/lib/utils";
import type { Plan, Task } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── Priority badge ───────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    High:   { bg: "#FEF2F2", color: "#B91C1C" },
    Medium: { bg: "#FFFBEB", color: "#92400E" },
    Low:    { bg: "#ECFDF5", color: "#065F46" },
  };
  const s = styles[priority] ?? { bg: "#F3F4F6", color: "#374151" };
  return (
    <span style={{
      fontSize: "10px", fontWeight: 700, padding: "2px 8px",
      borderRadius: "99px", background: s.bg, color: s.color,
      letterSpacing: "0.3px",
    }}>
      {priority}
    </span>
  );
}

// ─── Period badge ─────────────────────────────────────────────────────────────

function PeriodBadge({ period }: { period: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    Morning:   { bg: "#FFF7ED", color: "#C2410C" },
    Afternoon: { bg: "#EFF6FF", color: "#1D4ED8" },
    Evening:   { bg: "#F5F3FF", color: "#6D28D9" },
    Night:     { bg: "#0F172A", color: "#94A3B8" },
  };
  const s = styles[period] ?? { bg: "#F3F4F6", color: "#374151" };
  return (
    <span style={{
      fontSize: "10px", fontWeight: 600, padding: "2px 8px",
      borderRadius: "99px", background: s.bg, color: s.color,
    }}>
      {period}
    </span>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div style={{ height: "6px", background: "#F3F4F6", borderRadius: "99px", overflow: "hidden" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        style={{
          height: "100%", borderRadius: "99px",
          background: "linear-gradient(90deg, #4F46E5, #7C3AED)",
        }}
      />
    </div>
  );
}

// ─── AI Chat Panel ────────────────────────────────────────────────────────────

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
        setMessages([{ role: "assistant", content: "Hi! I'm having trouble connecting right now. Please try again in a moment." }]);
      } finally {
        setLoading(false);
      }
    }
    void startSession();
  }, [task.id]);

  async function sendMessage() {
    const trimmed = draft.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
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
      setMessages([...nextMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      style={{
        display: "flex", flexDirection: "column",
        background: "#ffffff", border: "1px solid #E5E7EB",
        borderRadius: "20px", overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        height: "100%",
        position: "sticky",
        top: "20px",
      }}
    >
      {/* Chat header */}
      <div style={{
        padding: "16px 18px",
        borderBottom: "1px solid #F3F4F6",
        background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "10px",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Sparkles size={16} color="#ffffff" />
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff", lineHeight: 1.2 }}>
                AI Help Studio
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginTop: "2px", lineHeight: 1.2 }}>
                Powered by Gemini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "28px", height: "28px", borderRadius: "8px",
              background: "rgba(255,255,255,0.15)", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0,
            }}
          >
            <X size={14} color="#ffffff" />
          </button>
        </div>
        {/* Task chip */}
        <div style={{
          marginTop: "12px", padding: "8px 10px",
          background: "rgba(255,255,255,0.12)", borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.15)",
        }}>
          <p style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>
            Helping with
          </p>
          <p style={{ fontSize: "12.5px", fontWeight: 600, color: "#ffffff", lineHeight: 1.3 }}>
            {task.title}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1, overflowY: "auto", padding: "16px",
          display: "flex", flexDirection: "column", gap: "12px",
          background: "#FAFAFA",
          minHeight: 0,
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.role === "assistant" && (
                <div style={{
                  width: "26px", height: "26px", borderRadius: "8px",
                  background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginRight: "8px", marginTop: "2px",
                }}>
                  <Sparkles size={12} color="#fff" />
                </div>
              )}
              <div style={{
                maxWidth: "82%",
                padding: "10px 14px",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                background: msg.role === "user" ? "#4F46E5" : "#ffffff",
                color: msg.role === "user" ? "#ffffff" : "#111827",
                fontSize: "13px", lineHeight: 1.6,
                border: msg.role === "assistant" ? "1px solid #E5E7EB" : "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                whiteSpace: "pre-wrap",
              }}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading dots */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <div style={{
              width: "26px", height: "26px", borderRadius: "8px",
              background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Sparkles size={12} color="#fff" />
            </div>
            <div style={{
              padding: "10px 14px", background: "#ffffff", borderRadius: "4px 16px 16px 16px",
              border: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: "4px",
            }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4F46E5" }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input area */}
      <div style={{
        padding: "14px 16px",
        borderTop: "1px solid #F3F4F6",
        background: "#ffffff",
      }}>
        <div style={{
          display: "flex", gap: "10px", alignItems: "flex-end",
          background: "#F9FAFB", borderRadius: "14px",
          border: "1px solid #E5E7EB", padding: "10px 12px",
        }}>
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your reply... (Enter to send)"
            rows={2}
            style={{
              flex: 1, resize: "none", border: "none", background: "transparent",
              fontSize: "13px", color: "#111827", outline: "none",
              lineHeight: 1.5, fontFamily: "inherit",
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => void sendMessage()}
            disabled={!draft.trim() || loading}
            style={{
              width: "34px", height: "34px", borderRadius: "10px", flexShrink: 0,
              background: draft.trim() && !loading ? "#4F46E5" : "#E5E7EB",
              border: "none", cursor: draft.trim() && !loading ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
          >
            <SendHorizonal size={14} color={draft.trim() && !loading ? "#ffffff" : "#9CA3AF"} />
          </motion.button>
        </div>
        <p style={{ fontSize: "10.5px", color: "#9CA3AF", textAlign: "center", marginTop: "8px" }}>
          Shift+Enter for new line · Enter to send
        </p>
      </div>
    </motion.div>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: Task;
  isCompleted: boolean;
  isActive: boolean;
  onToggle: (task: Task) => void;
  onAskAI: (task: Task) => void;
}

function TaskCard({ task, isCompleted, isActive, onToggle, onAskAI }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: "16px 18px",
        background: isCompleted ? "#FAFAFA" : "#ffffff",
        border: isActive ? "1.5px solid #A5B4FC" : "1px solid #E5E7EB",
        borderRadius: "14px",
        opacity: isCompleted ? 0.7 : 1,
        boxShadow: isActive ? "0 0 0 3px rgba(79,70,229,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
        transition: "all 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task)}
          style={{
            marginTop: "2px", flexShrink: 0, background: "none",
            border: "none", cursor: "pointer", padding: 0,
            color: isCompleted ? "#4F46E5" : "#D1D5DB",
          }}
        >
          {isCompleted
            ? <CheckCircle2 size={20} color="#4F46E5" />
            : <Circle size={20} color="#D1D5DB" />
          }
        </button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: "14px", fontWeight: 600, color: isCompleted ? "#9CA3AF" : "#111827",
            textDecoration: isCompleted ? "line-through" : "none",
            lineHeight: 1.4, marginBottom: "6px",
          }}>
            {task.title}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: task.aiNote ? "8px" : "0" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#9CA3AF" }}>
              <Clock size={11} />
              {task.time} · {task.duration}
            </span>
            <PeriodBadge period={task.period} />
            <PriorityBadge priority={task.priority} />
            <span style={{
              fontSize: "10px", fontWeight: 600, padding: "2px 8px",
              borderRadius: "99px", background: "#F3F4F6", color: "#6B7280",
            }}>
              {task.taskType}
            </span>
          </div>

          {task.aiNote && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "5px 10px", borderRadius: "8px",
              background: "#EEF2FF", border: "1px solid #C7D2FE",
            }}>
              <Sparkles size={10} color="#4F46E5" />
              <span style={{ fontSize: "11.5px", color: "#4F46E5", fontWeight: 500 }}>
                {task.aiNote}
              </span>
            </div>
          )}
        </div>

        {/* Ask AI button */}
        {!isCompleted && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onAskAI(task)}
            style={{
              flexShrink: 0, display: "flex", alignItems: "center", gap: "6px",
              padding: "7px 12px", borderRadius: "10px", cursor: "pointer",
              background: isActive ? "#4F46E5" : "#EEF2FF",
              border: isActive ? "none" : "1px solid #C7D2FE",
              color: isActive ? "#ffffff" : "#4F46E5",
              fontSize: "12px", fontWeight: 600,
              transition: "all 0.15s",
            }}
          >
            <BrainCircuit size={13} />
            {isActive ? "Chatting" : "Ask AI"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Day Section ──────────────────────────────────────────────────────────────

interface DaySectionProps {
  day: Plan["days"][0];
  taskState: Record<string, boolean>;
  activeTaskId: string | null;
  onToggle: (task: Task) => void;
  onAskAI: (task: Task) => void;
}

function DaySection({ day, taskState, activeTaskId, onToggle, onAskAI }: DaySectionProps) {
  const completed = day.items.filter((t) => taskState[t.id] ?? t.completed).length;
  const total = day.items.length;

  return (
    <div style={{ marginBottom: "24px" }}>
      {/* Day header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "12px",
      }}>
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>{day.day}</h3>
          <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "1px" }}>{day.date}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 500 }}>
            {completed}/{total}
          </span>
          <div style={{ width: "60px", height: "4px", background: "#F3F4F6", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{
              width: `${total > 0 ? (completed / total) * 100 : 0}%`,
              height: "100%", background: "#4F46E5", borderRadius: "99px",
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>
      </div>

      {/* Task cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {day.items.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PlanDetailPage() {
  const params = useParams<{ planId: string }>();
  const { plans, taskState, toggleTask } = useTaskContext();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!params?.planId) return;
    const found = plans.find((p) => p.id === params.planId) ?? null;
    setPlan(found);
  }, [params?.planId, plans]);

  const stats = useMemo(() => {
    if (!plan) return null;
    return getPlanStats(plan, taskState);
  }, [plan, taskState]);

  function handleAskAI(task: Task) {
    setActiveTask((prev) => prev?.id === task.id ? null : task);
  }

  function handleTaskToggle(task: Task) {
    toggleTask(task.id);
    // Close chat if task is completed
    if (!(taskState[task.id] ?? task.completed) === false) {
      if (activeTask?.id === task.id) setActiveTask(null);
    }
  }

  if (!plan) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F6F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>Loading plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F3", color: "#111827" }}>

      {/* Top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E5E7EB", padding: "0 32px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            href="/"
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "13px", fontWeight: 600, color: "#4F46E5", textDecoration: "none",
            }}
          >
            <ChevronLeft size={16} />
            Dashboard
          </Link>
          <div style={{ width: "1px", height: "16px", background: "#E5E7EB" }} />
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>
            {plan.heading}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "13px", color: "#6B7280", fontWeight: 500 }}>
            {stats?.completedTasks ?? 0}/{stats?.totalTasks ?? 0} tasks
          </div>
          <div style={{
            padding: "5px 14px", borderRadius: "99px",
            background: "#EEF2FF", color: "#4F46E5",
            fontSize: "12px", fontWeight: 700,
          }}>
            {stats?.completionPercentage ?? 0}% complete
          </div>
        </div>
      </div>

      {/* Page body */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 32px" }}>

        {/* Plan header card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "#ffffff", border: "1px solid #E5E7EB",
            borderRadius: "20px", padding: "28px 32px",
            marginBottom: "28px", position: "relative", overflow: "hidden",
          }}
        >
          {/* Accent bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "3px",
            background: "linear-gradient(90deg, #4F46E5, #7C3AED)",
          }} />

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "260px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{
                  fontSize: "11px", fontWeight: 700, padding: "3px 12px",
                  borderRadius: "99px", background: "#EEF2FF", color: "#4F46E5",
                  textTransform: "uppercase", letterSpacing: "0.5px",
                }}>
                  {plan.planType}
                </span>
                <span style={{
                  fontSize: "11px", fontWeight: 600, padding: "3px 12px",
                  borderRadius: "99px", background: "#F0FDF4", color: "#166534",
                }}>
                  Score: {plan.productivityScore}
                </span>
              </div>
              <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#111827", letterSpacing: "-0.5px", marginBottom: "8px" }}>
                {plan.heading}
              </h1>
              <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6, maxWidth: "520px" }}>
                {plan.summary}
              </p>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {[
                { icon: <Timer size={15} />, label: "Focus", value: plan.focusTime },
                { icon: <Coffee size={15} />, label: "Breaks", value: plan.breakTime },
                { icon: <Calendar size={15} />, label: "Est. done", value: plan.completionEstimate },
                { icon: <Target size={15} />, label: "Remaining", value: `${stats?.remainingTasks ?? 0} tasks` },
              ].map((s) => (
                <div key={s.label} style={{
                  padding: "12px 16px", background: "#F9FAFB",
                  border: "1px solid #F3F4F6", borderRadius: "14px",
                  textAlign: "center", minWidth: "80px",
                }}>
                  <div style={{ color: "#4F46E5", display: "flex", justifyContent: "center", marginBottom: "4px" }}>
                    {s.icon}
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>{s.value}</div>
                  <div style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "2px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall progress */}
          <div style={{ marginTop: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "#6B7280", fontWeight: 500 }}>
                Overall progress — {stats?.completedTasks ?? 0} of {stats?.totalTasks ?? 0} tasks done
              </span>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#4F46E5" }}>
                {stats?.completionPercentage ?? 0}%
              </span>
            </div>
            <ProgressBar percentage={stats?.completionPercentage ?? 0} />
          </div>
        </motion.div>

        {/* 2-column: Tasks + Chat */}
        <div style={{
          display: "grid",
          gridTemplateColumns: activeTask ? "1fr 420px" : "1fr",
          gap: "24px",
          alignItems: "start",
          transition: "grid-template-columns 0.3s ease",
        }}>

          {/* Left — Task timeline */}
          <div>
            <div style={{
              background: "#ffffff", border: "1px solid #E5E7EB",
              borderRadius: "20px", padding: "24px 28px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <div>
                  <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#111827" }}>Plan Timeline</h2>
                  <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "3px" }}>
                    Work through your tasks · click "Ask AI" for guided help on any task
                  </p>
                </div>
                <div style={{
                  padding: "5px 14px", background: "#F3F4F6",
                  borderRadius: "99px", fontSize: "12px", fontWeight: 600, color: "#6B7280",
                }}>
                  {stats?.remainingTasks ?? 0} remaining
                </div>
              </div>

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
          </div>

          {/* Right — Chat panel */}
          <AnimatePresence>
            {activeTask && (
              <div style={{ height: "calc(100vh - 120px)", position: "sticky", top: "80px" }}>
                <ChatPanel
                  key={activeTask.id}
                  task={activeTask}
                  plan={plan}
                  onClose={() => setActiveTask(null)}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
