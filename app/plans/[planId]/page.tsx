"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  ChevronLeft,
  MessageSquareText,
  SendHorizonal,
  Sparkles,
} from "lucide-react";
import { useTaskContext } from "@/lib/task-context";
import { getPlanStats } from "@/lib/utils";
import { updateTaskCompletion } from "@/lib/firestore";
import type { Plan, Task } from "@/types";

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

function formatHelpContent(data: any): string {
  const chunks: string[] = [];

  if (data?.message) {
    chunks.push(data.message);
  }

  if (Array.isArray(data?.questions) && data.questions.length > 0) {
    chunks.push(`Questions to answer:\n- ${data.questions.join("\n- ")}`);
  }

  if (data?.summary) {
    chunks.push(`Summary:\n${data.summary}`);
  }

  if (Array.isArray(data?.steps) && data.steps.length > 0) {
    chunks.push(`Suggested steps:\n- ${data.steps.join("\n- ")}`);
  }

  if (
    Array.isArray(data?.researchChecklist) &&
    data.researchChecklist.length > 0
  ) {
    chunks.push(
      `Research checklist:\n- ${data.researchChecklist.join("\n- ")}`,
    );
  }

  return chunks.join("\n\n");
}

export default function PlanDetailPage() {
  const params = useParams<{ planId: string }>();
  const { plans, taskState, toggleTask } = useTaskContext();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [selectedHelpTask, setSelectedHelpTask] = useState<Task | null>(null);
  const [helpMessages, setHelpMessages] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [helpDraft, setHelpDraft] = useState("");
  const [isHelpLoading, setIsHelpLoading] = useState(false);

  useEffect(() => {
    if (!params?.planId) return;

    const found = plans.find((item) => item.id === params.planId) ?? null;
    setPlan(found);
  }, [params?.planId, plans]);

  useEffect(() => {
    if (!plan || !selectedHelpTask) return;

    const taskId = selectedHelpTask.id;
    if ((helpMessages[taskId] ?? []).length > 0) return;

    let active = true;

    const currentTask = selectedHelpTask;

    async function startHelpSession() {
      setIsHelpLoading(true);

      try {
        const res = await fetch("/api/plan-help", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskTitle: currentTask.title,
            planHeading: plan?.heading ?? "General plan",
            userInput: "",
            conversation: [],
          }),
        });

        const data = await res.json();

        if (!active) return;

        const assistantMessage = {
          role: "assistant" as const,
          content: formatHelpContent(data),
        };

        setHelpMessages((prev) => ({
          ...prev,
          [taskId]: [assistantMessage],
        }));
      } catch (error) {
        if (!active) return;
        setHelpMessages((prev) => ({
          ...prev,
          [taskId]: [
            {
              role: "assistant",
              content:
                "I’m sorry, I couldn’t start the guided help session right now. Please try again in a moment.",
            },
          ],
        }));
      } finally {
        if (active) {
          setIsHelpLoading(false);
        }
      }
    }

    void startHelpSession();

    return () => {
      active = false;
    };
  }, [plan, selectedHelpTask?.id, helpMessages]);

  const stats = useMemo(() => {
    if (!plan) return null;
    return getPlanStats(plan, taskState);
  }, [plan, taskState]);

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] p-8 text-[#111827]">
        <p>Loading plan details...</p>
      </div>
    );
  }

  async function handleTaskToggle(task: Task) {
    if (!plan) return;

    const nextValue = !(taskState[task.id] ?? task.completed);
    const success = await updateTaskCompletion(plan, task.id, nextValue);
    if (success) {
      toggleTask(task.id);
    }
  }

  async function handleSendHelpMessage() {
    if (!plan || !selectedHelpTask) return;

    const trimmed = helpDraft.trim();
    if (!trimmed || isHelpLoading) return;

    const taskId = selectedHelpTask.id;
    const previousMessages = helpMessages[taskId] ?? [];
    const nextMessages: ChatMessage[] = [
      ...previousMessages,
      { role: "user", content: trimmed },
    ];

    setHelpMessages((prev) => ({ ...prev, [taskId]: nextMessages }));
    setHelpDraft("");
    setIsHelpLoading(true);

    try {
      const res = await fetch("/api/plan-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle: selectedHelpTask.title,
          planHeading: plan.heading,
          userInput: trimmed,
          conversation: nextMessages,
        }),
      });

      const data = await res.json();
      setHelpMessages((prev) => ({
        ...prev,
        [taskId]: [
          ...nextMessages,
          { role: "assistant", content: formatHelpContent(data) },
        ],
      }));
    } catch (error) {
      setHelpMessages((prev) => ({
        ...prev,
        [taskId]: [
          ...nextMessages,
          {
            role: "assistant",
            content:
              "I’m sorry, I couldn’t answer that request right now. Please try again in a moment.",
          },
        ],
      }));
    } finally {
      setIsHelpLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] p-6 text-[#111827] md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4F46E5]"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-bold">{plan.heading}</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#6B7280]">
              {plan.summary}
            </p>
          </div>
          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm shadow-sm">
            <div className="font-semibold">
              {stats?.completedTasks ?? 0}/{stats?.totalTasks ?? 0} tasks done
            </div>
            <div className="text-[#6B7280]">
              {stats?.completionPercentage ?? 0}% complete
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
                <div className="text-sm text-[#6B7280]">Focus time</div>
                <div className="text-xl font-semibold">{plan.focusTime}</div>
              </div>
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
                <div className="text-sm text-[#6B7280]">Break time</div>
                <div className="text-xl font-semibold">{plan.breakTime}</div>
              </div>
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
                <div className="text-sm text-[#6B7280]">Estimate</div>
                <div className="text-xl font-semibold">
                  {plan.completionEstimate}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Plan timeline</h2>
                  <p className="text-sm text-[#6B7280]">
                    Work through your tasks and ask for guided support whenever
                    you need a nudge.
                  </p>
                </div>
                <div className="rounded-full bg-[#EEF2FF] px-3 py-1 text-sm font-semibold text-[#4F46E5]">
                  {stats?.remainingTasks ?? 0} left
                </div>
              </div>

              <div className="space-y-4">
                {plan.days.map((day) => (
                  <div
                    key={`${day.day}-${day.date}`}
                    className="rounded-2xl border border-[#E5E7EB] bg-[#FAFBFC] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{day.day}</h3>
                        <p className="text-sm text-[#6B7280]">{day.date}</p>
                      </div>
                      <div className="text-sm text-[#6B7280]">
                        {day.items.length} tasks
                      </div>
                    </div>

                    <div className="space-y-3">
                      {day.items.map((task) => {
                        const completed = taskState[task.id] ?? task.completed;

                        return (
                          <motion.div
                            key={task.id}
                            layout
                            className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex flex-1 items-start gap-3">
                                <input
                                  type="checkbox"
                                  checked={completed}
                                  onChange={() => void handleTaskToggle(task)}
                                  className="mt-1 h-4 w-4 rounded border-[#D1D5DB]"
                                />
                                <div>
                                  <div className="font-semibold text-[#111827]">
                                    {task.title}
                                  </div>
                                  <div className="mt-1 text-sm text-[#6B7280]">
                                    {task.period} · {task.time} ·{" "}
                                    {task.duration} · {task.taskType}
                                  </div>
                                  {task.aiNote && (
                                    <div className="mt-2 inline-flex rounded-full bg-[#EEF2FF] px-2.5 py-1 text-sm text-[#4F46E5]">
                                      {task.aiNote}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setSelectedHelpTask(task)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#C7D2FE] bg-[#EEF2FF] px-3 py-2 text-sm font-semibold text-[#4F46E5] transition hover:bg-[#E0E7FF]"
                              >
                                <BrainCircuit className="h-4 w-4" />
                                Ask AI to help
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#4F46E5]" />
                <h2 className="font-semibold text-[#111827]">AI help studio</h2>
              </div>
              <p className="mt-2 text-sm text-[#6B7280]">
                Open a guided chat for any task and let AI ask the questions
                that matter before giving a plan.
              </p>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-slate-950 p-4 shadow-lg">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-100">
                  <MessageSquareText className="h-5 w-5 text-[#A5B4FC]" />
                  <h3 className="font-semibold">Help chat</h3>
                </div>
                {selectedHelpTask ? (
                  <div className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-300">
                    {selectedHelpTask.title}
                  </div>
                ) : null}
              </div>

              {selectedHelpTask ? (
                <div className="flex h-[480px] flex-col rounded-2xl border border-white/10 bg-white/10 backdrop-blur">
                  <div className="border-b border-white/10 p-3">
                    <div className="text-sm font-semibold text-white">
                      {selectedHelpTask.title}
                    </div>
                    <div className="text-xs text-slate-300">{plan.heading}</div>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto p-3">
                    {(helpMessages[selectedHelpTask.id] ?? []).map(
                      (message, index) => (
                        <div
                          key={`${selectedHelpTask.id}-${index}`}
                          className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                            message.role === "assistant"
                              ? "bg-white/15 text-slate-50"
                              : "ml-auto bg-[#4F46E5] text-white"
                          }`}
                        >
                          <div className="whitespace-pre-line">
                            {message.content}
                          </div>
                        </div>
                      ),
                    )}

                    {isHelpLoading ? (
                      <div className="max-w-[90%] rounded-2xl bg-white/15 px-3 py-2 text-sm text-slate-200">
                        Thinking...
                      </div>
                    ) : null}
                  </div>

                  <div className="border-t border-white/10 p-3">
                    <textarea
                      value={helpDraft}
                      onChange={(event) => setHelpDraft(event.target.value)}
                      placeholder="Type your answer or ask something else..."
                      className="min-h-[90px] w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => void handleSendHelpMessage()}
                      className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#4338CA]"
                    >
                      <SendHorizonal className="h-4 w-4" />
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-300">
                  Select a task from the list to start a guided chat. The
                  assistant will ask the key questions first, then help you move
                  forward.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
