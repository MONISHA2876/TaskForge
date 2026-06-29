"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Bot,
  Lock,
  Cloud,
  BarChart3,
  Calendar,
  ImageIcon,
  Mic,
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Star,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

// ─── ANIMATION HELPER ─────────────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── SECTION EYEBROW ──────────────────────────────────────────────────────────

function Eyebrow({
  label,
  centered = false,
}: {
  label: string;
  centered?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 mb-5 ${centered ? "justify-center" : ""}`}
    >
      <span className="w-7 h-[1.5px] bg-indigo-500 rounded-full" />
      <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-indigo-600">
        {label}
      </span>
      {centered && (
        <span className="w-7 h-[1.5px] bg-indigo-500 rounded-full" />
      )}
    </div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const problems = [
  {
    icon: "⏰",
    title: "Deadlines sneak up on you",
    desc: "You remember tasks exist — only when it's too late to complete them properly. Reminders fire without context or a plan.",
  },
  {
    icon: "📋",
    title: "To-do lists pile up endlessly",
    desc: "Tasks accumulate faster than you clear them. Without intelligent prioritization, everything feels equally urgent — and nothing gets done.",
  },
  {
    icon: "🤷",
    title: "Planning takes longer than doing",
    desc: "Figuring out how to structure your day is a task in itself. You spend your best energy deciding, not executing.",
  },
];

const features = [
  {
    icon: <Bot size={22} />,
    title: "AI-Powered Planning",
    desc: "Generate intelligent daily, weekly, and monthly plans using Gemini AI in seconds.",
  },
  {
    icon: <Lock size={22} />,
    title: "Secure Authentication",
    desc: "Private accounts via Firebase Authentication. Your plans are yours alone — always.",
  },
  {
    icon: <Cloud size={22} />,
    title: "Cloud Storage",
    desc: "Plans are securely persisted in Firestore and available across all your devices.",
  },
  {
    icon: <BarChart3 size={22} />,
    title: "Productivity Dashboard",
    desc: "Analyze completed tasks, focus time, and productivity trends with a clear visual overview.",
  },
  {
    icon: <Calendar size={22} />,
    title: "Google Calendar Sync",
    desc: "Push your AI-generated plan directly into Google Calendar, seamlessly.",
    upcoming: true,
  },
  {
    icon: <ImageIcon size={22} />,
    title: "Image Understanding",
    desc: "Drop a photo of your notes or whiteboard — the AI reads it and plans from it.",
    upcoming: true,
  },
  {
    icon: <Mic size={22} />,
    title: "Voice Commands",
    desc: "Tell your AI companion what you need to do — no typing required.",
    upcoming: true,
  },
  {
    icon: <Sparkles size={22} />,
    title: "AI Task Workspace",
    desc: "A full AI-powered workspace to research, draft, and complete tasks without leaving the app.",
    upcoming: true,
  },
];

const steps = [
  {
    icon: "🎯",
    title: "Describe Goals",
    desc: "Tell the AI what you need to accomplish today, this week, or this month.",
  },
  {
    icon: "🧠",
    title: "AI Generates Plan",
    desc: "Gemini AI creates a personalized, time-blocked execution plan in seconds.",
  },
  {
    icon: "⚡",
    title: "Execute Tasks",
    desc: "Work through your plan with clear priorities, durations, and next steps.",
  },
  {
    icon: "📊",
    title: "Track Progress",
    desc: "Monitor completion rates and productivity insights on your dashboard.",
  },
  {
    icon: "🏆",
    title: "Achieve Goals",
    desc: "Consistently hit deadlines and build the productive habits that matter.",
  },
];

const traditionalItems = [
  "Passive reminders with no context",
  "You figure out when and how to do tasks",
  "No prioritization based on your goals",
  "Tasks accumulate without a clear path",
  "Planning is manual and time-consuming",
];

const dgItems = [
  "Proactive AI execution planning",
  "Time-blocked schedules generated instantly",
  "Intelligent prioritization aligned to goals",
  "Clear next steps and progress always visible",
  "Gemini AI plans your day for you",
];

// ─── MOCK DASHBOARD ILLUSTRATION ─────────────────────────────────────────────

function MockDashboard() {
  return (
    <div className="bg-white rounded-[24px] overflow-hidden text-[13px] border border-gray-100/80">
      {/* Nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[10px] bg-indigo-600 flex items-center justify-center text-white">
            <Star size={14} fill="white" />
          </div>
          <div>
            <p className="font-bold text-[13px] text-gray-900 leading-none">
              Deadline Guardian
            </p>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">
              AI Productivity
            </p>
          </div>
        </div>
        <div className="flex gap-7">
          <span className="text-[12px] text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5">
            Home
          </span>
          <span className="text-[12px] text-gray-400 font-medium">
            AI Planner
          </span>
        </div>
        <div className="text-[11px] px-4 py-1.5 rounded-xl bg-gray-100 text-gray-600 font-semibold">
          Sign Out
        </div>
      </div>

      {/* Body */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-[210px] border-r border-gray-100 p-4 bg-[#FAFBFC] flex-shrink-0">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3">
            Upcoming Today
          </p>
          {[
            {
              name: "Morning Routine & Prep",
              time: "08:00 · 30 min",
              badge: "Low",
              bc: "text-emerald-600 bg-emerald-50",
            },
            {
              name: "Hackathon Registration",
              time: "08:30 · 1 hr",
              badge: "High",
              bc: "text-red-500 bg-red-50",
            },
            {
              name: "Deep Work Block",
              time: "09:30 · 3 hrs",
              badge: "High",
              bc: "text-red-500 bg-red-50",
            },
            {
              name: "Lunch & Mental Reset",
              time: "12:30 · 1 hr",
              badge: null,
              bc: "",
            },
          ].map((t) => (
            <div
              key={t.name}
              className="flex gap-2.5 p-2.5 rounded-2xl bg-white border border-gray-100 mb-2"
            >
              <div className="w-3.5 h-3.5 rounded-md border-[1.5px] border-gray-200 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-gray-900 leading-tight">
                  {t.name}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[9px] text-gray-400">{t.time}</span>
                  {t.badge && (
                    <span
                      className={`text-[8px] font-bold px-1.5 py-0.5 rounded-lg ${t.bc}`}
                    >
                      {t.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 p-6">
          <p className="text-[22px] font-black tracking-tight text-gray-900 mb-0.5">
            Good afternoon 👋
          </p>
          <p className="text-[11px] text-gray-400 mb-5">
            Monday, June 29, 2026
          </p>
          <p className="text-[13px] font-bold text-gray-900 mb-3">
            Active Plans
          </p>
          <div className="bg-white rounded-[20px] border border-gray-100 p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[13px] font-bold text-gray-900 mb-1">
                  Your Deadline Guardian Daily Plan
                </p>
                <p className="text-[10px] text-gray-400 max-w-[260px] leading-relaxed">
                  A focused plan to tackle hackathon goals and make significant
                  progress on key deliverables today.
                </p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-full border-[3px] border-emerald-500 flex items-center justify-center text-[13px] font-black text-emerald-600">
                  85
                </div>
                <span className="text-[8px] text-gray-400 uppercase tracking-widest">
                  Daily
                </span>
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              {[
                { val: "0/9", lbl: "Tasks" },
                { val: "12 hrs", lbl: "Focus time" },
                { val: "10:00 PM", lbl: "Est. done" },
              ].map((s) => (
                <div
                  key={s.lbl}
                  className="flex-1 bg-[#FAFBFC] rounded-2xl p-2.5 text-center"
                >
                  <p className="text-[13px] font-black text-gray-900">
                    {s.val}
                  </p>
                  <p className="text-[9px] text-gray-400">{s.lbl}</p>
                </div>
              ))}
            </div>
            <div className="h-[3px] bg-gray-100 rounded-full mb-2">
              <motion.div
                className="h-full bg-indigo-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "38%" }}
                transition={{ duration: 1.6, delay: 0.6, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] text-gray-400">
                3 of 9 tasks completed
              </span>
              <span className="text-[9px] text-indigo-600 font-bold">38%</span>
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="w-[170px] flex-shrink-0 border-l border-gray-100 p-4">
          <div className="rounded-[20px] bg-indigo-600 p-4 mb-4 text-white">
            <Sparkles size={14} className="mb-2" />
            <p className="text-[12px] font-bold mb-1.5">Create a new AI plan</p>
            <p className="text-[9px] opacity-80 mb-3 leading-relaxed">
              Generate a personalised productivity plan powered by Gemini AI.
            </p>
            <button className="w-full py-2 rounded-xl bg-white/20 text-[9px] font-bold text-white">
              ✦ Launch AI Planner
            </button>
          </div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
            Recent Activity
          </p>
          <div className="flex gap-1.5 items-start mb-2">
            <CheckCircle2
              size={10}
              className="text-emerald-500 flex-shrink-0 mt-0.5"
            />
            <span className="text-[9px] text-gray-400">
              Daily Plan synced · 9 tasks
            </span>
          </div>
          <div className="flex gap-1.5 items-start">
            <CheckCircle2
              size={10}
              className="text-emerald-500 flex-shrink-0 mt-0.5"
            />
            <span className="text-[9px] text-gray-400">
              Exam Prep Plan · 70 tasks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFC] text-gray-900 overflow-x-hidden">
      {/* ══ NAV ══════════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-14 h-[68px] bg-[rgba(250,251,252,0.88)] backdrop-blur-2xl border-b border-gray-100">
        <a href="#" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 rounded-[14px] bg-indigo-600 flex items-center justify-center text-white shadow-[0_2px_8px_rgba(79,70,229,0.35)]">
            <Star size={16} fill="white" />
          </div>
          <div>
            <p className="font-extrabold text-[15px] text-gray-900 leading-none tracking-tight">
              TaskForge
            </p>
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.1em] mt-0.5">
              AI Productivity
            </p>
          </div>
        </a>
        <div className="hidden md:flex gap-8">
          {[
            ["Problem", "#problem"],
            ["Features", "#features"],
            ["How it works", "#how-it-works"],
            ["Preview", "#preview"],
          ].map(([l, h]) => (
            <a
              key={l}
              href={h}
              className="text-[13.5px] font-medium text-gray-500 hover:text-gray-900 transition-colors no-underline"
            >
              {l}
            </a>
          ))}
        </div>
        <motion.button
          whileHover={{ y: -1.5, boxShadow: "0 6px 20px rgba(79,70,229,0.38)" }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold shadow-[0_2px_10px_rgba(79,70,229,0.3)] transition-colors hover:bg-indigo-700"
        >
          ✨ Get Started
        </motion.button>
      </nav>

      {/* ══ HERO ═════════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative pt-40 pb-28 px-6 md:px-14 flex flex-col items-center text-center overflow-hidden"
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[860px] h-[560px] bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.09)_0%,transparent_68%)]" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-indigo-200/80 bg-indigo-50 mb-8"
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-emerald-500"
            animate={{ opacity: [1, 0.4, 1], scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <span className="text-[11.5px] font-bold tracking-[0.1em] uppercase text-indigo-600">
            Powered by Gemini AI
          </span>
        </motion.div>

        {/* Headline — significantly bigger */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="font-black leading-[1.04] tracking-[-3px] text-gray-900 max-w-[900px] mb-7"
          style={{ fontSize: "clamp(52px, 7.5vw, 88px)" }}
        >
          Stop Missing Deadlines.{" "}
          <span className="text-indigo-600">Start Executing</span> Smarter.
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-[19px] text-gray-500 max-w-[520px] leading-[1.7] mb-11 font-normal"
        >
          Deadline Guardian turns your goals into personalized, time-blocked
          execution plans — automatically. Your AI companion for the days that
          actually matter.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="flex flex-col sm:flex-row gap-3.5 mb-20"
        >
          <motion.button
            whileHover={{
              y: -2.5,
              boxShadow: "0 10px 32px rgba(79,70,229,0.42)",
            }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-indigo-600 text-white text-[15.5px] font-semibold shadow-[0_4px_20px_rgba(79,70,229,0.35)] hover:bg-indigo-700 transition-colors"
          >
            <Sparkles size={17} />
            Get Started
          </motion.button>
        </motion.div>

        {/* Dashboard illustration */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[960px]"
        >
          <motion.div
            animate={{ y: [0, -9, 0] }}
            transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }}
            className="rounded-[28px] overflow-hidden shadow-[0_28px_72px_rgba(79,70,229,0.16),0_8px_28px_rgba(0,0,0,0.08)] border border-gray-100/80"
          >
            <Image
              src="/DashBoard.png"
              alt="Dashboard Illustration"
              width={960}
              height={540}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ══ PROBLEM ══════════════════════════════════════════════════════════════ */}
      <section
        id="problem"
        className="py-28 px-6 md:px-14 bg-white border-y border-gray-100"
      >
        <div className="max-w-[1120px] mx-auto">
          <FadeUp>
            <Eyebrow label="The Problem" />
            <h2
              className="font-black tracking-[-1.8px] leading-[1.08] text-gray-900 mb-5"
              style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
            >
              Productivity tools were built
              <br />
              for reminders, not execution.
            </h2>
            <p className="text-[17px] text-gray-500 max-w-[480px] leading-[1.75]">
              Most apps tell you what to do. None of them tell you how, when, or
              in what order to actually do it.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
            {problems.map((p, i) => (
              <FadeUp key={p.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{
                    y: -5,
                    boxShadow: "0 16px 48px rgba(0,0,0,0.09)",
                  }}
                  className="p-8 rounded-[24px] border border-gray-100 bg-[#FAFBFC] hover:border-indigo-100 transition-all h-full"
                >
                  <div className="w-12 h-12 rounded-[16px] bg-indigo-50 flex items-center justify-center text-[22px] mb-5">
                    {p.icon}
                  </div>
                  <h3 className="text-[17px] font-bold text-gray-900 mb-3">
                    {p.title}
                  </h3>
                  <p className="text-[14px] text-gray-500 leading-[1.7]">
                    {p.desc}
                  </p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SOLUTION ═════════════════════════════════════════════════════════════ */}
      <section id="solution" className="py-28 px-6 md:px-14 bg-[#FAFBFC]">
        <div className="max-w-[1120px] mx-auto">
          <FadeUp>
            <Eyebrow label="The Solution" />
            <h2
              className="font-black tracking-[-1.8px] leading-[1.08] text-gray-900 mb-5"
              style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
            >
              Your AI thinks ahead,
              <br />
              so you don&apos;t have to.
            </h2>
            <p className="text-[17px] text-gray-500 max-w-[500px] leading-[1.75]">
              Deadline Guardian doesn&apos;t remind you of tasks. It builds a
              complete execution plan around your goals — and keeps you on track
              every step of the way.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-16 items-center">
            {/* AI Planner Mock */}
            <FadeUp delay={0.1}>
              <motion.div
                whileHover={{
                  y: -5,
                  boxShadow: "0 16px 48px rgba(79,70,229,0.1)",
                }}
                className="rounded-[28px] overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] bg-white transition-all"
              >
                <div className="p-7">
                  <h3 className="text-[17px] font-bold text-gray-900 mb-1.5">
                    What would you like to accomplish?
                  </h3>
                  <p className="text-[13px] text-gray-400 mb-5">
                    Chat with AI to refine your plan — then generate it.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {[
                      "📅 Plan My Day",
                      "📅 Plan My Week",
                      "📚 Study Plan",
                      "⚡ Hackathon",
                      "💪 Workout",
                    ].map((c) => (
                      <span
                        key={c}
                        className="px-3.5 py-1.5 rounded-2xl border border-gray-100 text-[12px] font-medium text-gray-700 bg-[#FAFBFC]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="bg-[#FAFBFC] rounded-[20px] p-5 mb-4">
                    <div className="w-8 h-8 rounded-[10px] bg-indigo-600 flex items-center justify-center text-white text-[13px] mb-3">
                      ✦
                    </div>
                    <p className="text-[13px] text-gray-500 leading-[1.7]">
                      Hi! 👋 I&apos;m your AI productivity coach. Tell me what
                      you&apos;d like to accomplish — a study session, interview
                      prep, workout plan, or anything else — and I&apos;ll ask a
                      few questions to build the perfect plan for you.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-100 bg-[#FAFBFC]">
                    <span className="flex-1 text-[13px] text-gray-300">
                      Type your goal… or drop an image
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </FadeUp>

            {/* Points */}
            <div className="flex flex-col gap-8">
              {[
                {
                  icon: <Target size={20} />,
                  title: "Understands your goals",
                  desc: "Describe what you need to achieve in plain language. The AI asks clarifying questions and maps out the full scope automatically.",
                  delay: 0.1,
                },
                {
                  icon: <Zap size={20} />,
                  title: "Generates a personalized plan",
                  desc: "Time-blocked schedules tailored to your priorities, energy levels, and available time — not a generic template.",
                  delay: 0.2,
                },
                {
                  icon: <TrendingUp size={20} />,
                  title: "Tracks your progress",
                  desc: "A live dashboard shows completion percentages, upcoming tasks, and productivity trends — all private and secure.",
                  delay: 0.3,
                },
                {
                  icon: <RefreshCw size={20} />,
                  title: "Adapts as you work",
                  desc: "Plans saved to Firestore are accessible across devices. Generate daily, weekly, or monthly plans whenever you need them.",
                  delay: 0.4,
                },
              ].map((pt) => (
                <FadeUp key={pt.title} delay={pt.delay}>
                  <div className="flex gap-5 items-start">
                    <div className="w-11 h-11 rounded-[14px] bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      {pt.icon}
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-gray-900 mb-1.5">
                        {pt.title}
                      </h3>
                      <p className="text-[14px] text-gray-500 leading-[1.7]">
                        {pt.desc}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ═════════════════════════════════════════════════════════════ */}
      <section
        id="features"
        className="py-28 px-6 md:px-14 bg-white border-y border-gray-100"
      >
        <div className="max-w-[1120px] mx-auto">
          <FadeUp>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <Eyebrow label="Features" />
                <h2
                  className="font-black tracking-[-1.8px] leading-[1.08] text-gray-900"
                  style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
                >
                  Everything you need.
                  <br />
                  Nothing you don&apos;t.
                </h2>
              </div>
              <p className="text-[16px] text-gray-500 max-w-[300px] leading-[1.75]">
                Available today, with more coming soon as Deadline Guardian
                keeps evolving.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.06}>
                <motion.div
                  whileHover={{
                    y: -5,
                    boxShadow: "0 16px 48px rgba(0,0,0,0.09)",
                  }}
                  className={`relative p-7 rounded-[24px] border bg-[#FAFBFC] hover:border-indigo-100 transition-all h-full ${f.upcoming ? "opacity-80 hover:opacity-100" : ""} border-gray-100`}
                >
                  {f.upcoming && (
                    <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200/80">
                      Coming Soon
                    </span>
                  )}
                  <div className="text-indigo-600 mb-4">{f.icon}</div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-[1.7]">
                    {f.desc}
                  </p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-28 px-6 md:px-14 bg-[#FAFBFC]">
        <div className="max-w-[1120px] mx-auto">
          <FadeUp>
            <div className="text-center mb-20">
              <Eyebrow label="How It Works" centered />
              <h2
                className="font-black tracking-[-1.8px] leading-[1.08] text-gray-900"
                style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
              >
                From goal to done.
                <br />
                In five steps.
              </h2>
            </div>
          </FadeUp>

          <div className="relative flex flex-col md:flex-row items-start gap-0">
            <div
              className="hidden md:block absolute top-7 left-[10%] right-[10%] h-px bg-gray-150 z-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #e5e7eb 15%, #e5e7eb 85%, transparent)",
              }}
            />
            {steps.map((step, i) => (
              <FadeUp key={step.title} delay={i * 0.1} className="flex-1 z-10">
                <div className="flex flex-col items-center text-center px-5">
                  <motion.div
                    whileHover={{
                      scale: 1.12,
                      borderColor: "#4F46E5",
                      backgroundColor: "rgba(79,70,229,0.06)",
                    }}
                    className="w-14 h-14 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-[22px] mb-5 shadow-sm transition-all"
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-[1.7] max-w-[150px]">
                    {step.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SCREENSHOTS / PREVIEW ════════════════════════════════════════════════ */}
      <section
        id="preview"
        className="py-28 px-6 md:px-14 bg-white border-y border-gray-100"
      >
        <div className="max-w-[1120px] mx-auto">
          <FadeUp>
            <div className="text-center mb-16">
              <Eyebrow label="Product Preview" centered />
              <h2
                className="font-black tracking-[-1.8px] leading-[1.08] text-gray-900 mb-5"
                style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
              >
                Built for people who actually
                <br />
                need to get things done.
              </h2>
              <p className="text-[17px] text-gray-500 max-w-[430px] mx-auto leading-[1.75]">
                Every screen minimizes friction and maximizes clarity — so you
                spend less time in the app and more time executing.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {/* Dashboard preview */}
            <FadeUp delay={0.1}>
              <motion.div
                whileHover={{
                  y: -7,
                  boxShadow: "0 28px 72px rgba(79,70,229,0.14)",
                }}
                className="rounded-[28px] overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all"
              >
                <div className="flex items-center gap-2 px-5 py-3.5 bg-white border-b border-gray-100">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <div className="flex-1 mx-3 px-3 py-1.5 rounded-xl bg-[#FAFBFC] text-[9px] text-gray-400 flex items-center gap-2">
                    <span className="text-emerald-500">🔒</span>{" "}
                    deadlineguardian.app/dashboard
                  </div>
                </div>
                <div className="bg-[#FAFBFC] p-6">
                  <p className="text-[20px] font-black tracking-tight text-gray-900 mb-1">
                    Good afternoon 👋
                  </p>
                  <p className="text-[11px] text-gray-400 mb-5">
                    Monday, June 29, 2026
                  </p>
                  <div className="grid grid-cols-3 gap-2.5 mb-4">
                    {[
                      { val: "9", lbl: "Tasks today" },
                      { val: "12h", lbl: "Focus time" },
                      { val: "85", lbl: "Plan score", accent: true },
                    ].map((s) => (
                      <div
                        key={s.lbl}
                        className="bg-white rounded-2xl border border-gray-100 p-3 text-center"
                      >
                        <p
                          className={`text-[17px] font-black ${s.accent ? "text-indigo-600" : "text-gray-900"}`}
                        >
                          {s.val}
                        </p>
                        <p className="text-[9px] text-gray-400">{s.lbl}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-[20px] border border-gray-100 p-5">
                    <p className="text-[13px] font-bold text-gray-900 mb-1.5">
                      Your Deadline Guardian Daily Plan
                    </p>
                    <p className="text-[10px] text-gray-400 mb-4 leading-relaxed">
                      A focused plan to tackle hackathon goals and make
                      significant progress on key deliverables.
                    </p>
                    <div className="h-[3px] bg-gray-100 rounded-full mb-2">
                      <motion.div
                        className="h-full bg-indigo-600 rounded-full"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "38%" }}
                        transition={{ duration: 1.3, ease: "easeOut" }}
                        viewport={{ once: true }}
                      />
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-[9px] text-gray-400">
                        3 of 9 tasks completed
                      </span>
                      <span className="text-[9px] text-indigo-600 font-bold">
                        38%
                      </span>
                    </div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-indigo-600 mb-1.5">
                      Next Up
                    </p>
                    <p className="text-[12px] font-semibold text-gray-900">
                      Hackathon Project — Deep Work Phase
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      09:30 · 3 hours · High priority
                    </p>
                  </div>
                </div>
              </motion.div>
            </FadeUp>

            {/* Planner preview */}
            <FadeUp delay={0.2}>
              <motion.div
                whileHover={{
                  y: -7,
                  boxShadow: "0 28px 72px rgba(79,70,229,0.14)",
                }}
                className="rounded-[28px] overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all"
              >
                <div className="flex items-center gap-2 px-5 py-3.5 bg-white border-b border-gray-100">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <div className="flex-1 mx-3 px-3 py-1.5 rounded-xl bg-[#FAFBFC] text-[9px] text-gray-400 flex items-center gap-2">
                    <span className="text-emerald-500">🔒</span>{" "}
                    deadlineguardian.app/planner
                  </div>
                </div>
                <div className="bg-[#FAFBFC] p-6 flex gap-4">
                  <div className="flex-1">
                    <p className="text-[17px] font-black tracking-tight text-gray-900 mb-1.5">
                      What would you like to accomplish?
                    </p>
                    <p className="text-[11px] text-gray-400 mb-4">
                      Chat with AI to refine your plan — then generate it.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {[
                        "📅 Plan My Day",
                        "📅 Plan My Week",
                        "📚 Study Plan",
                        "⚡ Hackathon",
                      ].map((c) => (
                        <span
                          key={c}
                          className="px-3 py-1.5 rounded-2xl bg-white border border-gray-100 text-[10px] font-medium text-gray-600"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="bg-white rounded-[18px] border border-gray-100 p-4">
                      <div className="w-7 h-7 rounded-[9px] bg-indigo-600 flex items-center justify-center text-white text-[11px] mb-2.5">
                        ✦
                      </div>
                      <p className="text-[11px] text-gray-500 leading-[1.7]">
                        Hi! 👋 I&apos;m your AI productivity coach. Tell me what
                        you&apos;d like to accomplish and I&apos;ll build the
                        perfect plan for you.
                      </p>
                    </div>
                  </div>
                  <div className="w-[130px] flex-shrink-0">
                    <div className="bg-white rounded-[18px] border border-gray-100 p-4">
                      <p className="text-[10px] font-bold text-gray-900 text-center mb-3">
                        Your plan will appear here
                      </p>
                      <div className="text-center text-[22px] mb-3">📋</div>
                      {[
                        "📋 Time-blocked schedule",
                        "🧠 AI reasoning",
                        "📅 Calendar sync (soon)",
                      ].map((f) => (
                        <p key={f} className="text-[9px] text-gray-400 mb-2">
                          {f}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ══ COMPARISON ═══════════════════════════════════════════════════════════ */}
      <section id="comparison" className="py-28 px-6 md:px-14 bg-[#FAFBFC]">
        <div className="max-w-[1120px] mx-auto">
          <FadeUp>
            <div className="text-center mb-16">
              <Eyebrow label="Why Deadline Guardian" centered />
              <h2
                className="font-black tracking-[-1.8px] leading-[1.08] text-gray-900"
                style={{ fontSize: "clamp(36px, 4.5vw, 56px)" }}
              >
                Reminders keep you busy.
                <br />
                Plans get things done.
              </h2>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_72px_1fr] max-w-[860px] mx-auto items-center gap-0">
              {/* Traditional */}
              <div className="rounded-[24px] overflow-hidden border border-gray-100 bg-white">
                <div className="p-7 border-b border-gray-100">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2">
                    Traditional Apps
                  </p>
                  <p className="text-[22px] font-black text-gray-900">
                    To-Do Lists
                  </p>
                </div>
                <div className="p-7 flex flex-col gap-4">
                  {traditionalItems.map((item) => (
                    <div key={item} className="flex items-center gap-3.5">
                      <XCircle
                        size={15}
                        className="text-red-400 flex-shrink-0"
                      />
                      <span className="text-[14px] text-gray-500">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* VS */}
              <div className="hidden md:flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-[11px] font-black text-gray-400 shadow-sm">
                  VS
                </div>
              </div>

              {/* DG */}
              <div className="rounded-[24px] overflow-hidden border border-indigo-200/80 bg-indigo-600">
                <div className="p-7 border-b border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-indigo-200 mb-2">
                    AI-Powered
                  </p>
                  <p className="text-[22px] font-black text-white">
                    Deadline Guardian
                  </p>
                </div>
                <div className="p-7 flex flex-col gap-4">
                  {dgItems.map((item) => (
                    <div key={item} className="flex items-center gap-3.5">
                      <CheckCircle2
                        size={15}
                        className="text-emerald-300 flex-shrink-0"
                      />
                      <span className="text-[14px] text-white/85">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══ FINAL CTA ════════════════════════════════════════════════════════════ */}
      <section className="relative py-36 px-6 md:px-14 bg-gray-900 text-white text-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_55%_35%,rgba(79,70,229,0.45)_0%,transparent_62%)]" />
        <div className="relative z-10 max-w-[660px] mx-auto">
          <FadeUp>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/40 mb-7">
              ✦ Your AI Execution Companion
            </p>
            <h2
              className="font-black tracking-[-2.5px] leading-[1.06] text-white mb-6"
              style={{ fontSize: "clamp(42px, 5.5vw, 68px)" }}
            >
              Ready to take control of your productivity?
            </h2>
            <p className="text-[18px] text-white/50 mb-12 leading-[1.75]">
              Join Deadline Guardian today. Describe your goals, get a plan in
              seconds, and start executing — for free.
            </p>
            <motion.button
              whileHover={{
                y: -2.5,
                boxShadow: "0 16px 48px rgba(0,0,0,0.38)",
              }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-10 py-4.5 rounded-[22px] bg-white text-indigo-600 text-[17px] font-bold shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-gray-50 transition-all"
              style={{ paddingTop: "18px", paddingBottom: "18px" }}
            >
              <Sparkles size={18} />
              Get Started — Free
            </motion.button>
            <p className="mt-6 text-[12px] text-white/25">
              No credit card required · Powered by Gemini AI · Secure with
              Firebase
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════════ */}
      <footer className="flex flex-col sm:flex-row items-center justify-between px-10 md:px-14 py-9 border-t border-gray-100 bg-[#FAFBFC] gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[12px] bg-indigo-600 flex items-center justify-center text-white shadow-[0_2px_8px_rgba(79,70,229,0.3)]">
            <Star size={14} fill="white" />
          </div>
          <span className="font-bold text-[14px] text-gray-900">
            Deadline Guardian
          </span>
        </div>
        <p className="text-[13px] text-gray-400">
          © 2026 Deadline Guardian · Your AI Execution Companion
        </p>
      </footer>
    </div>
  );
}
