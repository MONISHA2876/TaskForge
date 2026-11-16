"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  Sparkles,
  X,
} from "lucide-react";
import { useTaskContext } from "@/lib/task-context";
import type { Plan, Task } from "@/types";
import { card, focusRing, rise } from "@/components/styles/styles";
import { Router } from "next/router";

/* ================================================================== */
/* Config                                                               */
/* ================================================================== */

type View = "month" | "week" | "day";

const VIEWS: { id: View; label: string }[] = [
  { id: "month", label: "Month" },
  { id: "week", label: "Week" },
  { id: "day", label: "Day" },
];

/** 0 = Sunday, 1 = Monday */
const WEEK_STARTS_ON = 0;
/** Height of one hour in the week / day grid (px) */
const HOUR_H = 56;
/** Minimum visual length of an event (minutes) */
const MIN_EVENT_MIN = 30;
/** Used when a task's time can't be parsed */
const DEFAULT_START_MIN = 9 * 60;
const DEFAULT_DURATION_MIN = 30;
const MAX_CHIPS = 3;

/* ================================================================== */
/* Date helpers                                                         */
/* ================================================================== */

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const startOfWeek = (d: Date) =>
  addDays(startOfDay(d), -((d.getDay() - WEEK_STARTS_ON + 7) % 7));
const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const minutesOfDay = (d: Date) => d.getHours() * 60 + d.getMinutes();

function shiftMonth(d: Date, dir: 1 | -1) {
  const target = new Date(d.getFullYear(), d.getMonth() + dir, 1);
  const day = Math.min(d.getDate(), daysInMonth(target.getFullYear(), target.getMonth()));
  return new Date(target.getFullYear(), target.getMonth(), day);
}

/* Fixed "en-US" formatting so server and client render the same text */
const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
const fmtHour = (h: number) =>
  new Date(2000, 0, 1, h).toLocaleTimeString("en-US", { hour: "numeric" });
const fmtWeekday = (d: Date, style: "short" | "narrow" | "long" = "short") =>
  d.toLocaleDateString("en-US", { weekday: style });
const fmtMonthYear = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
const fmtLongDate = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

/* ================================================================== */
/* Parsing your task data                                               */
/* If your date / time / duration strings look different, this is the   */
/* only place you need to touch.                                        */
/* ================================================================== */

/** "2026-11-17", "Nov 17, 2026", "Nov 17", "17/11/2026" … → local Date */
function parseDateString(raw: string): Date | null {
  const s = String(raw ?? "").trim();
  if (!s) return null;

  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return new Date(+iso[1], +iso[2] - 1, +iso[3]);

  const dmy = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (dmy) return new Date(+dmy[3], +dmy[2] - 1, +dmy[1]); // day / month / year

  const t = Date.parse(s);
  if (Number.isNaN(t)) return null;
  const d = new Date(t);
  // "Nov 17" has no year — JS would pick 2001, so use the current year
  if (!/\d{4}/.test(s)) d.setFullYear(new Date().getFullYear());
  return startOfDay(d);
}

/** "4:00 PM", "4 pm", "16:00" → minutes since midnight */
function parseTimeToMinutes(raw: string): number | null {
  const m = String(raw ?? "").match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!m) return null;
  let h = +m[1];
  const min = m[2] ? +m[2] : 0;
  const mer = m[3]?.toLowerCase();
  if (mer === "pm" && h < 12) h += 12;
  if (mer === "am" && h === 12) h = 0;
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/** "30 min", "1 hr", "1h 30m", "45m", "90" → minutes */
function parseDurationToMinutes(raw: string): number {
  const s = String(raw ?? "");
  const hours = s.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours)\b/i);
  const mins = s.match(/(\d+)\s*(?:m|min|mins|minute|minutes)\b/i);
  let total = 0;
  if (hours) total += parseFloat(hours[1]) * 60;
  if (mins) total += parseInt(mins[1], 10);
  if (!hours && !mins) {
    const n = parseInt(s, 10);
    if (!Number.isNaN(n)) total = n;
  }
  return total > 0 ? Math.round(total) : DEFAULT_DURATION_MIN;
}

/* ================================================================== */
/* Events (built from the real plans + task state)                      */
/* ================================================================== */

interface CalEvent {
  id: string;
  task: Task;
  plan: Plan;
  start: Date;
  end: Date;
  completed: boolean;
}

function buildEvents(plans: Plan[], taskState: Record<string, boolean>) {
  const events: CalEvent[] = [];
  let skipped = 0;

  for (const plan of plans) {
    for (const day of plan.days) {
      const date = parseDateString(day.date);
      for (const task of day.items) {
        if (!date) {
          skipped++;
          continue;
        }
        const startMin = parseTimeToMinutes(task.time) ?? DEFAULT_START_MIN;
        const durMin = parseDurationToMinutes(task.duration);
        const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, startMin);
        const end = new Date(start.getTime() + durMin * 60_000);
        events.push({
          id: task.id,
          task,
          plan,
          start,
          end,
          completed: taskState[task.id] ?? task.completed,
        });
      }
    }
  }

  events.sort((a, b) => a.start.getTime() - b.start.getTime());

  const byDay = new Map<string, CalEvent[]>();
  for (const ev of events) {
    const k = dayKey(ev.start);
    const list = byDay.get(k);
    if (list) list.push(ev);
    else byDay.set(k, [ev]);
  }

  return { events, byDay, skipped };
}

/* ================================================================== */
/* Colours                                                              */
/* ================================================================== */

const tones: Record<string, { chip: string; dot: string; text: string }> = {
  High: {
    chip: "border-l-rose-400 bg-rose-400/[0.14] text-rose-50",
    dot: "bg-rose-400",
    text: "text-rose-300",
  },
  Medium: {
    chip: "border-l-amber-400 bg-amber-400/[0.14] text-amber-50",
    dot: "bg-amber-400",
    text: "text-amber-300",
  },
  Low: {
    chip: "border-l-emerald-400 bg-emerald-400/[0.14] text-emerald-50",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
  },
};
const toneFallback = {
  chip: "border-l-[#d9b77a] bg-[#c9a45c]/[0.14] text-[#f6e7c6]",
  dot: "bg-[#d9b77a]",
  text: "text-[#f0d9a8]",
};
const toneOf = (priority: string) => tones[priority] ?? toneFallback;

/* ================================================================== */
/* Overlap layout for the time grid                                     */
/* ================================================================== */

function layoutDay(evs: CalEvent[]) {
  const sorted = [...evs].sort((a, b) => a.start.getTime() - b.start.getTime());
  const out: { ev: CalEvent; col: number; cols: number }[] = [];

  let cluster: { ev: CalEvent; col: number }[] = [];
  let colEnds: number[] = [];
  let clusterEnd = 0;

  const flush = () => {
    const cols = colEnds.length;
    cluster.forEach((c) => out.push({ ...c, cols }));
    cluster = [];
    colEnds = [];
    clusterEnd = 0;
  };

  for (const ev of sorted) {
    const s = ev.start.getTime();
    const e = Math.max(ev.end.getTime(), s + MIN_EVENT_MIN * 60_000);
    if (cluster.length && s >= clusterEnd) flush();

    let col = colEnds.findIndex((end) => end <= s);
    if (col === -1) {
      col = colEnds.length;
      colEnds.push(e);
    } else {
      colEnds[col] = e;
    }
    cluster.push({ ev, col });
    clusterEnd = Math.max(clusterEnd, e);
  }
  flush();
  return out;
}

/* ================================================================== */
/* Month view                                                           */
/* ================================================================== */

interface ViewProps {
  today: Date;
  byDay: Map<string, CalEvent[]>;
  onSelect: (ev: CalEvent) => void;
  onPickDay: (d: Date) => void;
}

function MonthView({
  anchor,
  today,
  byDay,
  onSelect,
  onPickDay,
}: ViewProps & { anchor: Date }) {
  const y = anchor.getFullYear();
  const m = anchor.getMonth();
  const first = new Date(y, m, 1);
  const offset = (first.getDay() - WEEK_STARTS_ON + 7) % 7;
  const total = Math.ceil((offset + daysInMonth(y, m)) / 7) * 7;
  const gridStart = addDays(first, -offset);
  const days = Array.from({ length: total }, (_, i) => addDays(gridStart, i));

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.07]">
      <div className="grid grid-cols-7 gap-px bg-white/[0.07]">
        {days.slice(0, 7).map((d) => (
          <div
            key={d.getDay()}
            className="bg-[#0d1731] py-2.5 text-center text-[11px] tracking-[0.08em] text-slate-400 uppercase"
          >
            {fmtWeekday(d)}
          </div>
        ))}

        {days.map((d) => {
          const inMonth = d.getMonth() === m;
          const isToday = isSameDay(d, today);
          const list = byDay.get(dayKey(d)) ?? [];
          const visible = list.slice(0, MAX_CHIPS);
          const extra = list.length - visible.length;

          return (
            <div
              key={dayKey(d)}
              className={`min-h-[78px] p-1 sm:min-h-[118px] sm:p-2 ${
                inMonth ? "bg-[#0b1329]" : "bg-[#080e1f]"
              }`}
            >
              <div className="flex justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => onPickDay(d)}
                  aria-label={fmtLongDate(d)}
                  className={[
                    "flex size-7 items-center justify-center rounded-full text-[12.5px] transition-colors",
                    focusRing,
                    isToday
                      ? "bg-gradient-to-br from-[#ecd5a5] to-[#c9a45c] font-semibold text-[#1c1406]"
                      : inMonth
                        ? "text-slate-200 hover:bg-white/10"
                        : "text-slate-600 hover:bg-white/5",
                  ].join(" ")}
                >
                  {d.getDate()}
                </button>
              </div>

              {/* chips (sm+) */}
              <div className="mt-1.5 hidden flex-col gap-1 sm:flex">
                {visible.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => onSelect(ev)}
                    title={ev.task.title}
                    className={`w-full truncate rounded-md border-l-[3px] px-1.5 py-0.5 text-left text-[11.5px] transition-[filter] hover:brightness-125 ${toneOf(ev.task.priority).chip} ${
                      ev.completed ? "line-through opacity-50" : ""
                    } ${focusRing}`}
                  >
                    <span className="mr-1 text-slate-400">{fmtTime(ev.start)}</span>
                    {ev.task.title}
                  </button>
                ))}
                {extra > 0 && (
                  <button
                    type="button"
                    onClick={() => onPickDay(d)}
                    className={`rounded-md px-1.5 text-left text-[11.5px] text-[#ecd5a5] hover:text-white ${focusRing}`}
                  >
                    +{extra} more
                  </button>
                )}
              </div>

              {/* dots (mobile) */}
              {list.length > 0 && (
                <button
                  type="button"
                  onClick={() => onPickDay(d)}
                  aria-label={`${list.length} tasks on ${fmtLongDate(d)}`}
                  className="mt-1 flex flex-wrap justify-center gap-0.5 sm:hidden"
                >
                  {list.slice(0, 4).map((ev) => (
                    <span
                      key={ev.id}
                      className={`size-1.5 rounded-full ${toneOf(ev.task.priority).dot} ${
                        ev.completed ? "opacity-40" : ""
                      }`}
                    />
                  ))}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Week / Day time grid                                                 */
/* ================================================================== */

const GUTTER = 56;

function TimeGrid({
  days,
  today,
  now,
  byDay,
  onSelect,
  onPickDay,
}: ViewProps & { days: Date[]; now: Date }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const allEvents = days.flatMap((d) => byDay.get(dayKey(d)) ?? []);
  const minStart = allEvents.length
    ? Math.min(...allEvents.map((e) => minutesOfDay(e.start)))
    : null;
  const maxEnd = allEvents.length
    ? Math.max(
        ...allEvents.map((e) =>
          Math.min(
            24 * 60,
            minutesOfDay(e.start) +
              Math.max(MIN_EVENT_MIN, (e.end.getTime() - e.start.getTime()) / 60_000),
          ),
        ),
      )
    : 0;

  const startHour = Math.max(0, Math.min(7, Math.floor((minStart ?? 7 * 60) / 60)));
  const endHour = Math.min(24, Math.max(20, Math.ceil(maxEnd / 60)));
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const totalH = (endHour - startHour) * HOUR_H;
  const nowMin = minutesOfDay(now);

  // Scroll to the first event (or "now") when the grid opens
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const focus = minStart ?? nowMin;
    el.scrollTop = Math.max(0, ((focus - startHour * 60) / 60) * HOUR_H - HOUR_H);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cols = { gridTemplateColumns: `${GUTTER}px repeat(${days.length}, minmax(0, 1fr))` };
  const single = days.length === 1;

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#0b1329]">
      <div ref={scrollRef} className="max-h-[640px] overflow-auto">
        <div className={single ? "" : "min-w-[640px]"}>
          {/* Day headers */}
          <div
            className="sticky top-0 z-20 grid border-b border-white/[0.07] bg-[#0d1731]"
            style={cols}
          >
            <div />
            {days.map((d) => {
              const isToday = isSameDay(d, today);
              return (
                <div key={dayKey(d)} className="flex flex-col items-center gap-1 py-2.5">
                  <span
                    className={`text-[11px] tracking-[0.08em] uppercase ${
                      isToday ? "text-[#ecd5a5]" : "text-slate-400"
                    }`}
                  >
                    {fmtWeekday(d)}
                  </span>
                  <button
                    type="button"
                    onClick={() => !single && onPickDay(d)}
                    disabled={single}
                    aria-label={fmtLongDate(d)}
                    className={[
                      "flex size-8 items-center justify-center rounded-full text-[14px] transition-colors",
                      focusRing,
                      isToday
                        ? "bg-gradient-to-br from-[#ecd5a5] to-[#c9a45c] font-semibold text-[#1c1406]"
                        : "text-slate-100 hover:bg-white/10 disabled:hover:bg-transparent",
                    ].join(" ")}
                  >
                    {d.getDate()}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Body */}
          <div className="grid" style={cols}>
            {/* hour labels */}
            <div className="relative" style={{ height: totalH }}>
              {hours.slice(1, -1).map((h) => (
                <span
                  key={h}
                  className="absolute right-2 -translate-y-1/2 text-[10.5px] text-slate-500"
                  style={{ top: (h - startHour) * HOUR_H }}
                >
                  {fmtHour(h)}
                </span>
              ))}
            </div>

            {/* day columns */}
            {days.map((d) => {
              const isToday = isSameDay(d, today);
              const placed = layoutDay(byDay.get(dayKey(d)) ?? []);
              const showNow = isToday && nowMin >= startHour * 60 && nowMin <= endHour * 60;

              return (
                <div
                  key={dayKey(d)}
                  className={`relative border-l border-white/[0.06] ${
                    isToday ? "bg-[#c9a45c]/[0.03]" : ""
                  }`}
                  style={{ height: totalH }}
                >
                  {hours.map((h) => (
                    <span
                      key={h}
                      className="absolute inset-x-0 border-t border-white/[0.06]"
                      style={{ top: (h - startHour) * HOUR_H }}
                    />
                  ))}

                  {placed.map(({ ev, col, cols: n }, i) => {
                    const startMin = minutesOfDay(ev.start);
                    const durMin = Math.max(
                      MIN_EVENT_MIN,
                      Math.min(24 * 60 - startMin, (ev.end.getTime() - ev.start.getTime()) / 60_000),
                    );
                    const height = Math.max(26, (durMin / 60) * HOUR_H - 2);
                    const tone = toneOf(ev.task.priority);
                    return (
                      <motion.button
                        key={ev.id}
                        type="button"
                        onClick={() => onSelect(ev)}
                        aria-label={`${ev.task.title}, ${fmtTime(ev.start)}`}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: ev.completed ? 0.55 : 1, scale: 1 }}
                        transition={{ duration: 0.25, delay: Math.min(i, 12) * 0.03 }}
                        whileHover={{ scale: 1.015 }}
                        className={`absolute overflow-hidden rounded-md border-l-[3px] px-2 py-1 text-left ${tone.chip} ${focusRing}`}
                        style={{
                          top: ((startMin - startHour * 60) / 60) * HOUR_H + 1,
                          height,
                          left: `calc(${(col / n) * 100}% + 2px)`,
                          width: `calc(${100 / n}% - 4px)`,
                        }}
                      >
                        <p
                          className={`truncate text-[12px] leading-tight font-medium ${
                            ev.completed ? "line-through" : ""
                          }`}
                        >
                          {ev.task.title}
                        </p>
                        {height > 40 && (
                          <p className="mt-0.5 truncate text-[10.5px] text-slate-300/80">
                            {fmtTime(ev.start)} – {fmtTime(ev.end)}
                          </p>
                        )}
                      </motion.button>
                    );
                  })}

                  {showNow && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 z-10 h-px bg-[#e0bf86]"
                      style={{ top: ((nowMin - startHour * 60) / 60) * HOUR_H }}
                    >
                      <span className="absolute -top-[3px] -left-1 size-[7px] rounded-full bg-[#e0bf86]" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Side panel: mini month, summary, legend                              */
/* ================================================================== */

function MiniMonth({
  anchor,
  today,
  byDay,
  onPick,
  onShift,
}: {
  anchor: Date;
  today: Date;
  byDay: Map<string, CalEvent[]>;
  onPick: (d: Date) => void;
  onShift: (dir: 1 | -1) => void;
}) {
  const y = anchor.getFullYear();
  const m = anchor.getMonth();
  const first = new Date(y, m, 1);
  const offset = (first.getDay() - WEEK_STARTS_ON + 7) % 7;
  const total = Math.ceil((offset + daysInMonth(y, m)) / 7) * 7;
  const gridStart = addDays(first, -offset);
  const days = Array.from({ length: total }, (_, i) => addDays(gridStart, i));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="font-serif text-[14.5px] text-white">
          {fmtMonthYear(anchor)}
        </span>
        <div className="flex gap-0.5">
          <button
            type="button"
            onClick={() => onShift(-1)}
            aria-label="Previous month"
            className={`rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white ${focusRing}`}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onShift(1)}
            aria-label="Next month"
            className={`rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white ${focusRing}`}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-0.5 text-center">
        {days.slice(0, 7).map((d) => (
          <span key={d.getDay()} className="pb-1 text-[10.5px] text-slate-500">
            {fmtWeekday(d, "narrow")}
          </span>
        ))}
        {days.map((d) => {
          const isToday = isSameDay(d, today);
          const isAnchor = isSameDay(d, anchor);
          const inMonth = d.getMonth() === m;
          const has = byDay.has(dayKey(d));
          return (
            <button
              key={dayKey(d)}
              type="button"
              onClick={() => onPick(d)}
              aria-label={fmtLongDate(d)}
              className={[
                "relative mx-auto flex size-7 items-center justify-center rounded-full text-[11.5px] transition-colors",
                focusRing,
                isToday
                  ? "bg-gradient-to-br from-[#ecd5a5] to-[#c9a45c] font-semibold text-[#1c1406]"
                  : isAnchor
                    ? "bg-white/10 text-white ring-1 ring-[#c9a45c]/50"
                    : inMonth
                      ? "text-slate-200 hover:bg-white/10"
                      : "text-slate-600 hover:bg-white/5",
              ].join(" ")}
            >
              {d.getDate()}
              {has && !isToday && (
                <span className="absolute bottom-0.5 size-[3px] rounded-full bg-[#d9b77a]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Event dialog                                                         */
/* ================================================================== */

function EventDialog({
  ev,
  onClose,
  onToggle,
}: {
  ev: CalEvent;
  onClose: () => void;
  onToggle: (id: string) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { task, plan } = ev;
  const tone = toneOf(task.priority);
  const pill =
    "rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-medium text-slate-300";

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={task.title}
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`${card} relative w-full max-w-[440px] overflow-hidden bg-[#0a1228] p-6 shadow-2xl shadow-black/50`}
      >
        <span className={`absolute inset-x-0 top-0 h-1 ${tone.dot}`} />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.07] hover:text-white ${focusRing}`}
        >
          <X className="size-4" />
        </button>

        <h3
          className={`pr-8 font-serif text-[20px] leading-snug font-medium ${
            ev.completed ? "text-slate-500 line-through" : "text-white"
          }`}
        >
          {task.title}
        </h3>

        <p className="mt-3 flex items-center gap-2 text-[13px] text-slate-300">
          <Clock className="size-3.5 text-slate-400" />
          {fmtLongDate(ev.start)} · {fmtTime(ev.start)} – {fmtTime(ev.end)}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-medium ${tone.text}`}>
            {task.priority} priority
          </span>
          <span className={pill}>{task.period}</span>
          <span className={pill}>{task.taskType}</span>
        </div>

        {task.aiNote && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#c9a45c]/25 bg-[#c9a45c]/[0.07] px-3 py-2.5">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-[#e6c78f]" />
            <span className="text-[12.5px] leading-relaxed text-[#f0d9a8]">
              {task.aiNote}
            </span>
          </div>
        )}

        <p className="mt-4 text-[12.5px] text-slate-400">
          Part of <span className="text-slate-200">{plan.heading}</span>
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onToggle(task.id)}
            className={[
              "flex h-10 flex-1 items-center justify-center gap-2 rounded-full px-5 text-[13px] font-semibold transition-[filter,background-color] active:scale-[0.98]",
              focusRing,
              ev.completed
                ? "border border-white/15 text-slate-200 hover:bg-white/[0.06]"
                : "bg-gradient-to-r from-[#ecd5a5] via-[#e0bf86] to-[#c9a45c] text-[#1c1406] hover:brightness-110",
            ].join(" ")}
          >
            <Check className="size-4" />
            {ev.completed ? "Mark incomplete" : "Mark complete"}
          </button>
          <Link
            href={`/plans/${plan.id}`}
            className={`flex h-10 items-center gap-1.5 rounded-full border border-white/15 px-5 text-[13px] font-medium text-slate-200 transition-colors hover:bg-white/[0.06] hover:text-white ${focusRing}`}
          >
            Open plan <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

/* ================================================================== */
/* Calendar                                                             */
/* ================================================================== */

function CalendarSkeleton() {
  return (
    <section className={`${card} p-6`} aria-busy="true" aria-label="Loading calendar">
      <div className="flex animate-pulse items-center justify-between">
        <div className="h-7 w-48 rounded-lg bg-white/[0.06]" />
        <div className="h-9 w-48 rounded-full bg-white/[0.06]" />
      </div>
      <div className="mt-6 h-[420px] animate-pulse rounded-xl bg-white/[0.04]" />
    </section>
  );
}

function CalendarView({ now }: { now: Date }) {
  const { plans, taskState, toggleTask } = useTaskContext();
  const today = startOfDay(now);

  const [view, setView] = useState<View>("month");
  const [anchor, setAnchor] = useState<Date>(today);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { events, byDay, skipped } = useMemo(
    () => buildEvents(plans, taskState),
    [plans, taskState],
  );
  const selected = selectedId ? events.find((e) => e.id === selectedId) ?? null : null;

  /* visible range */
  const range = useMemo(() => {
    if (view === "day") return { start: anchor, end: addDays(anchor, 1) };
    if (view === "week") {
      const s = startOfWeek(anchor);
      return { start: s, end: addDays(s, 7) };
    }
    return {
      start: new Date(anchor.getFullYear(), anchor.getMonth(), 1),
      end: new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1),
    };
  }, [view, anchor]);

  const inView = events.filter((e) => e.start >= range.start && e.start < range.end);
  const doneInView = inView.filter((e) => e.completed).length;
  const pct = inView.length ? Math.round((doneInView / inView.length) * 100) : 0;

  /* navigation */
  function shift(dir: 1 | -1) {
    setAnchor((a) =>
      view === "month" ? shiftMonth(a, dir) : addDays(a, dir * (view === "week" ? 7 : 1)),
    );
  }
  function goDay(d: Date) {
    setAnchor(startOfDay(d));
    setView("day");
  }

  /* title */
  let title: string;
  if (view === "month") title = fmtMonthYear(anchor);
  else if (view === "day")
    title = anchor.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  else {
    const s = range.start;
    const e = addDays(s, 6);
    const mon = (d: Date) => d.toLocaleDateString("en-US", { month: "short" });
    title =
      s.getMonth() === e.getMonth()
        ? `${mon(s)} ${s.getDate()} – ${e.getDate()}, ${e.getFullYear()}`
        : `${mon(s)} ${s.getDate()} – ${mon(e)} ${e.getDate()}, ${e.getFullYear()}`;
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(range.start, i));
  const viewProps = { today, byDay, onSelect: (ev: CalEvent) => setSelectedId(ev.id), onPickDay: goDay };
  const iconBtn = `flex size-9 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/[0.08] hover:text-white ${focusRing}`;

  const router = Router;

  return (
    <motion.section variants={rise} className={`${card} p-4 sm:p-6 min-h-screen `}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className={`h-9 rounded-full flex flex-row items-center justify-center gap-2 pl-1 px-4 text-[16px] font-medium text-slate-100 transition-colors hover:bg-white/[0.06] ${focusRing}`}
          >
            <ChevronLeft className="size-[18px]" />
            DashBoard
          </Link>
          <button
            type="button"
            onClick={() => setAnchor(today)}
            className={`h-9 rounded-full border border-white/15 px-4 text-[13px] font-medium text-slate-100 transition-colors hover:bg-white/[0.06] ${focusRing}`}
          >
            Today
          </button>
          <div className="flex items-center">
            <button type="button" onClick={() => shift(-1)} aria-label="Previous" className={iconBtn}>
              <ChevronLeft className="size-[18px]" />
            </button>
            <button type="button" onClick={() => shift(1)} aria-label="Next" className={iconBtn}>
              <ChevronRight className="size-[18px]" />
            </button>
          </div>
          <h2 className="font-serif text-[19px] font-medium text-white sm:text-[22px]">
            {title}
          </h2>
        </div>

        <div
          role="tablist"
          aria-label="Calendar view"
          className="flex rounded-full border border-white/10 bg-white/[0.04] p-1"
        >
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              onClick={() => setView(v.id)}
              className={`relative isolate rounded-full px-4 py-1.5 text-[12.5px] font-medium transition-colors ${focusRing} ${
                view === v.id ? "text-[#1c1406]" : "text-slate-300 hover:text-white"
              }`}
            >
              {view === v.id && (
                <motion.span
                  layoutId="calendar-view-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#ecd5a5] to-[#c9a45c]"
                />
              )}
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data notices */}
      {events.length === 0 && (
        <p className="mt-4 flex items-center gap-2 text-[12.5px] text-slate-400">
          <Info className="size-3.5" />
          No scheduled tasks yet — create a plan and it will show up here.
        </p>
      )}
      {skipped > 0 && (
        <p className="mt-4 flex items-center gap-2 text-[12.5px] text-amber-300/90">
          <Info className="size-3.5 shrink-0" />
          {skipped} {skipped === 1 ? "task has" : "tasks have"} a date format the calendar
          couldn’t read, so they’re not shown.
        </p>
      )}

      <div className="mt-5 flex gap-6">
        {/* Left panel (xl+) */}
        <aside className="hidden w-[232px] shrink-0 flex-col gap-7 xl:flex">
          <MiniMonth
            anchor={anchor}
            today={today}
            byDay={byDay}
            onPick={(d) => setAnchor(startOfDay(d))}
            onShift={(dir) => setAnchor((a) => shiftMonth(a, dir))}
          />

          <div className="border-t border-white/[0.07] pt-6">
            <p className="text-[12px] text-slate-400">
              This {view}
            </p>
            <p className="mt-1.5 font-serif text-[22px] leading-none text-white">
              {doneInView} / {inView.length}
              <span className="ml-2 font-sans text-[12px] text-slate-400">done</span>
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#d8bb84] to-[#f0dcae]"
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="border-t border-white/[0.07] pt-6">
            <p className="mb-3 text-[12px] text-slate-400">Priority</p>
            <ul className="flex flex-col gap-2.5 text-[12.5px] text-slate-300">
              {(["High", "Medium", "Low"] as const).map((p) => (
                <li key={p} className="flex items-center gap-2.5">
                  <span className={`size-2.5 rounded-full ${tones[p].dot}`} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main view */}
        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${view}-${dayKey(range.start)}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {view === "month" && <MonthView anchor={anchor} {...viewProps} />}
              {view === "week" && (
                <TimeGrid days={weekDays} now={now} {...viewProps} />
              )}
              {view === "day" && (
                <TimeGrid days={[anchor]} now={now} {...viewProps} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <EventDialog
            key={selected.id}
            ev={selected}
            onClose={() => setSelectedId(null)}
            onToggle={toggleTask}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default function Calendar() {
  // "now" is set after mount so server and client never disagree on the date / timezone
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <CalendarSkeleton />;
  return <CalendarView now={now} />;
}