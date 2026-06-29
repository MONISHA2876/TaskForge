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
} from "lucide-react";
import { Logo } from "@/components/layout/Navbar";
import Image from "next/image";

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
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({
  label,
  centered = false,
}: {
  label: string;
  centered?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${centered ? "justify-center" : ""}`}
    >
      <span className="h-px bg-violet-500" />
      <span className="text-xs font-bold tracking-widest uppercase text-violet-600">
        {label}
      </span>
      {centered && <span className="w-5 h-px bg-violet-500" />}
    </div>
  );
}

const problems = [
  {
    icon: "⏰",
    title: "Deadlines sneak up on you",
    desc: "You remember tasks exist only when it's too late. Reminders fire without context or a plan.",
  },
  {
    icon: "📋",
    title: "To-do lists pile up endlessly",
    desc: "Tasks accumulate faster than you clear them. Without prioritisation, everything feels equally urgent.",
  },
  {
    icon: "🤷",
    title: "Planning takes longer than doing",
    desc: "Figuring out how to structure your day is a task in itself. You spend your best energy deciding, not executing.",
  },
];

const features = [
  {
    icon: <Bot size={20} />,
    title: "AI-Powered Planning",
    desc: "Generate intelligent daily, weekly, and monthly plans using Gemini AI in seconds.",
  },
  {
    icon: <Lock size={20} />,
    title: "Secure Authentication",
    desc: "Private accounts via Firebase Authentication. Your plans are yours alone.",
  },
  {
    icon: <Cloud size={20} />,
    title: "Cloud Storage",
    desc: "Plans are securely saved in Firestore and available across all your devices.",
  },
  {
    icon: <BarChart3 size={20} />,
    title: "Productivity Dashboard",
    desc: "Analyse completed tasks, focus time, and productivity trends at a glance.",
  },
  {
    icon: <ImageIcon size={20} />,
    title: "Image Understanding",
    desc: "Drop a photo of your notes or whiteboard — the AI reads it and plans from it.",
  },
  {
    icon: <Mic size={20} />,
    title: "Voice Commands",
    desc: "Tell your AI companion what you need to do — no typing required.",
  },
  {
    icon: <Sparkles size={20} />,
    title: "AI Task Workspace",
    desc: "A full AI-powered workspace to research, draft, and complete tasks in one place.",
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
    desc: "Gemini AI creates a personalised, time-blocked execution plan in seconds.",
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 h-[60px] px-6 flex items-center gap-4 bg-white backdrop-blur border-b border-gray-200">
        <Logo />
      </header>

      {/* ── HERO ── */}
      <section className="pt-20 pb-20 px-6 md:px-16 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-200 bg-violet-50 mb-8"
          style={{ marginTop: "25px" }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <span className="text-[11px] font-bold tracking-widest uppercase text-violet-600">
            Powered by Gemini AI
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="font-black leading-[1.05] tracking-tight text-gray-900 max-w-[800px]"
          style={{
            fontSize: "clamp(44px, 6.5vw, 80px)",
            letterSpacing: "-2.5px",
          }}
        >
          <span>Build a smarter routine</span>
          <span
            className="text-violet-600 block"
            style={{ marginTop: "-40px" }}
          >
            from day one.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-[17px] text-gray-500 max-w-[480px] leading-relaxed mb-10"
        >
          Join TaskForge to plan your days, track goals, and stay consistently
          productive - powered by Gemini AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="flex flex-col sm:flex-row gap-3 items-center justify-center"
          style={{ margin: "24px" }}
        >
          <a href="/auth/signup">
            <motion.button
              whileHover={{
                y: -2,
                boxShadow: "0 12px 32px rgba(109,40,217,0.35)",
              }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[15px] font-semibold hover:bg-violet-700 transition-colors"
            >
              <Sparkles size={16} /> Get Started
            </motion.button>
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-[12px] text-gray-400 mb-16"
          style={{ marginBottom: "16px" }}
        >
          Powered by Gemini AI · Secure with Firebase
        </motion.p>

        {/* Hero illustration — Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[1040px]"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          >
            <Image
              src="/dashboard.png"
              alt="Dashboard"
              width={1040}
              height={600}
              style={{ margin: "auto" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── PROBLEM ── */}
      <section
        id="problem"
        className="py-28 px-6 md:px-16 bg-white border-t border-gray-100"
        style={{ paddingTop: "28px", paddingBottom: "28px" }}
      >
        <div
          className="max-w-[1080px] mx-auto"
          style={{ paddingTop: "32px", paddingBottom: "32px" }}
        >
          <FadeUp>
            <Eyebrow label="The Problem" />
            <h2
              className="font-black tracking-tight leading-tight text-gray-900 max-w-[540px]"
              style={{
                fontSize: "clamp(30px, 4vw, 50px)",
                letterSpacing: "-1.5px",
              }}
            >
              Productivity tools were built for reminders, not execution.
            </h2>
            <p className="text-[16px] text-gray-500 max-w-[440px] leading-relaxed">
              Most apps tell you what to do. None tell you how, when, or in what
              order to actually do it.
            </p>
          </FadeUp>

          <div
            style={{
              gap: "24px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              marginTop: "32px",
            }}
          >
            {problems.map((p, i) => (
              <FadeUp key={p.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{
                    y: -4,
                    boxShadow: "0 16px 48px rgba(0,0,0,0.08)",
                  }}
                  className="p-8 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-all h-full shadow-sm"
                >
                  <div
                    className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[22px] mb-5"
                    style={{
                      width: "48px",
                      height: "48px",
                      fontSize: "22px",
                      marginBottom: "20px",
                    }}
                  >
                    {p.icon}
                  </div>
                  <h3 className="text-[16px] font-bold text-gray-900 mb-2">
                    {p.title}
                  </h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed">
                    {p.desc}
                  </p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section
        id="solution"
        className="py-28 px-6 md:px-16 bg-white border-t border-gray-100"
        style={{ paddingTop: "50px", paddingBottom: "50px" }}
      >
        <div className="max-w-[1080px] mx-auto">
          <FadeUp>
            <Eyebrow label="The Solution" />
            <h2
              className="font-black tracking-tight leading-tight text-gray-900 mb-4"
              style={{
                fontSize: "clamp(30px, 4vw, 50px)",
                letterSpacing: "-1.5px",
              }}
            >
              Your AI thinks ahead,
              <br />
              so you don&apos;t have to.
            </h2>
            <p className="text-[16px] text-gray-500 max-w-[460px] leading-relaxed mb-14">
              TaskForge doesn&apos;t just remind you of tasks. It builds a
              complete execution plan around your goals and keeps you on track
              every step of the way.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
            {/* Planner mock */}

            {/* Feature points */}
            <div className="flex flex-col gap-10 pt-2">
              {[
                {
                  icon: <Target size={20} />,
                  title: "Understands your goals",
                  desc: "Describe what you need to achieve in plain language. The AI asks clarifying questions and maps out the full scope automatically.",
                  delay: 0.1,
                },
                {
                  icon: <Zap size={20} />,
                  title: "Generates a personalised plan",
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
                  title: "Available across all devices",
                  desc: "Plans saved to Firestore are accessible everywhere. Generate daily, weekly, or monthly plans whenever you need them.",
                  delay: 0.4,
                },
              ].map((pt) => (
                <FadeUp key={pt.title} delay={pt.delay}>
                  <div className="flex gap-5 items-start">
                    <div
                      className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-violet-600 flex-shrink-0"
                      style={{
                        width: "44px",
                        height: "44px",
                        fontSize: "20px",
                        marginTop: "16px",
                      }}
                    >
                      {pt.icon}
                    </div>
                    <div>
                      <h3
                        className="text-[16px] font-bold text-gray-900 mb-1"
                        style={{ marginTop: "16px" }}
                      >
                        {pt.title}
                      </h3>
                      <p className="text-[14px] text-gray-500 leading-relaxed">
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

      {/* ── FEATURES ── */}
      <section
        id="features"
        className="py-28 px-6 md:px-16 bg-white border-t border-gray-100"
        style={{ paddingTop: "32px", paddingBottom: "32px" }}
      >
        <div className="max-w-[1080px] mx-auto">
          <FadeUp>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <Eyebrow label="Features" />
                <h2
                  className="font-black tracking-tight leading-tight text-gray-900"
                  style={{
                    fontSize: "clamp(30px, 4vw, 50px)",
                    letterSpacing: "-1.5px",
                  }}
                >
                  Everything you need.
                  <br />
                  Nothing you don&apos;t.
                </h2>
              </div>
              <p className="text-[15px] text-gray-500 max-w-[260px] leading-relaxed">
                Available today, with more coming soon as TaskForge keeps
                evolving.
              </p>
            </div>
          </FadeUp>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            style={{
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              marginTop: "32px",
              marginBottom: "32px",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            {features.map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.06}>
                <motion.div
                  whileHover={{
                    y: -4,
                    boxShadow: "0 16px 48px rgba(0,0,0,0.07)",
                  }}
                  className={`relative p-7 rounded-2xl border border-gray-100 bg-white shadow-sm transition-all h-full $`}
                  style={{ padding: "20px" }}
                >
                  <div className="text-violet-600 mb-4">{f.icon}</div>
                  <h3 className="text-[14px] font-bold text-gray-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className="py-28 px-6 md:px-16 bg-white border-t border-gray-100"
        style={{ paddingTop: "50px", paddingBottom: "50px" }}
      >
        <div className="max-w-[1080px] mx-auto">
          <FadeUp>
            <div className="text-center mb-20">
              <Eyebrow label="How It Works" centered />
              <h2
                className="font-black tracking-tight leading-tight text-gray-900"
                style={{
                  fontSize: "clamp(30px, 4vw, 50px)",
                  letterSpacing: "-1.5px",
                }}
              >
                From goal to done in five steps.
              </h2>
            </div>
          </FadeUp>

          <div
            className="relative flex flex-col md:flex-row items-start"
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "center",
              marginTop: "32px",
            }}
          >
            <div className="hidden md:block absolute top-7 left-[8%] right-[8%] h-px bg-gray-100 z-0" />
            {steps.map((step, i) => (
              <FadeUp
                key={step.title}
                delay={i * 0.1}
                className="flex flex-row px-3 z-10"
              >
                <div
                  className="flex flex-col items-center text-center px-3"
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "8px",
                    textAlign: "center",
                    paddingLeft: "12px",
                    paddingRight: "12px",
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.08, borderColor: "#7C3AED" }}
                    className="w-14 h-14 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-[22px] mb-5 shadow-sm transition-all"
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-[14px] font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p
                    className="text-[13px] text-gray-500 leading-relaxed "
                    style={{ maxWidth: "150px" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        className="relative py-32 px-6 md:px-16 bg-gray-900 text-white text-center overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600"
        style={{ paddingTop: "32px", paddingBottom: "4px" }}
      >
        <div className="pointer-events-none absolute" />
        <div className="relative z-10 max-w-[600px] mx-auto">
          <FadeUp>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-6">
              ✦ Your AI Execution Companion
            </p>
            <h2
              className="font-black leading-tight text-white mb-5"
              style={{
                fontSize: "clamp(36px, 5vw, 62px)",
                letterSpacing: "-2px",
              }}
            >
              Ready to take control of your productivity?
            </h2>
            <p className="text-[16px] text-white/50 mb-10 leading-relaxed">
              Join TaskForge today. Describe your goals, get a plan in seconds,
              and start executing — for free.
            </p>
            <a href="/auth/signup">
              <motion.button
                whileHover={{ y: -2, boxShadow: "0 16px 48px rgba(0,0,0,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-white text-violet-600 text-[16px] font-bold hover:bg-gray-50 transition-all"
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px 40px",
                  borderRadius: "20px",
                  backgroundColor: "#ffffff",
                  color: "#7C3AED",
                  textDecoration: "none",
                  display: "inline-flex",
                  margin: "40px",
                }}
              >
                <Sparkles size={17} />
                <span>Get Started — Free</span>
              </motion.button>
            </a>
            <p className="mt-5 text-[11px] text-white/25">
              No credit card required · Powered by Gemini AI · Secure with
              Firebase
            </p>
            <p
              className="text-[12px] text-gray-100"
              style={{ marginTop: "20px" }}
            >
              © 2026 TaskForge · Your AI Execution Companion
            </p>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
