"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

// ─── Password strength ────────────────────────────────────────────────────────

function getPasswordStrength(pw: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!pw) return { score: 0, label: "", color: "#E5E7EB" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { score: 1, label: "Weak", color: "#EF4444" },
    { score: 2, label: "Fair", color: "#F59E0B" },
    { score: 3, label: "Good", color: "#3B82F6" },
    { score: 4, label: "Strong", color: "#10B981" },
  ];
  return map[score - 1] ?? { score: 0, label: "", color: "#E5E7EB" };
}

// ─── Feature list ─────────────────────────────────────────────────────────────

const FEATURES = [
  "AI-generated personalised plans",
  "Voice & image input support",
  "Task tracking with live progress",
  "Gemini-powered help for every task",
];

// ─── Floating plan card ────────────────────────────────────────────────────────

function FloatingPlanCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: "16px",
        padding: "16px 18px",
        backdropFilter: "blur(4px)",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "6px",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
          }}
        >
          ✦
        </div>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>
          Morning Wellness Plan
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "10px",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "99px",
            background: "rgba(74,222,128,0.2)",
            color: "#4ADE80",
          }}
        >
          Daily
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { title: "Cold plunge / walk", time: "06:30", done: true },
          { title: "Gratitude journal", time: "06:45", done: true },
          { title: "90-min deep work block", time: "08:00", done: false },
        ].map((t) => (
          <div
            key={t.title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: t.done ? 0.55 : 1,
            }}
          >
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "4px",
                flexShrink: 0,
                background: t.done
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.15)",
                border: t.done ? "none" : "1.5px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {t.done && (
                <svg viewBox="0 0 10 10" width="8" height="8">
                  <polyline
                    points="2,5 4,7.5 8,2.5"
                    stroke="#4F46E5"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span
              style={{
                fontSize: "11.5px",
                color: "rgba(255,255,255,0.85)",
                textDecoration: t.done ? "line-through" : "none",
                flex: 1,
              }}
            >
              {t.title}
            </span>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>
              {t.time}
            </span>
          </div>
        ))}
      </div>
      {/* Progress bar */}
      <div style={{ marginTop: "10px" }}>
        <div
          style={{
            height: "4px",
            background: "rgba(255,255,255,0.12)",
            borderRadius: "99px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "67%",
              height: "100%",
              background: "rgba(255,255,255,0.7)",
              borderRadius: "99px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "4px",
          }}
        >
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>
            2 of 3 done
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            67%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, signInWithGithub } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const strength = getPasswordStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    const result = await signUp(email, password);
    if (result.success) {
      router.push("/");
    } else {
      setMessage(result.message ?? "Account creation failed.");
    }
    setSubmitting(false);
  }

  async function handleOAuthSignIn(provider: "google" | "github") {
    setSubmitting(true);
    setMessage("");
    const result =
      provider === "google"
        ? await signInWithGoogle()
        : await signInWithGithub();

    if (result.success) {
      router.push("/");
    } else {
      setMessage(result.message ?? "Unable to sign in with provider.");
    }
    setSubmitting(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#ffffff",
        fontFamily: "Inter, -apple-system, sans-serif",
      }}
    >
      {/* ── Left panel — form ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 40px",
          background: "#ffffff",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", maxWidth: "400px" }}
        >
          {/* Logo (mobile / left panel) */}
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "40px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="white">
                <path d="M10 2L13 8H18L14 12L16 18L10 14L4 18L6 12L2 8H7L10 2Z" />
              </svg>
            </div>
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "-0.3px",
              }}
            >
              TaskForge
            </span>
          </Link>

          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#7C3AED",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Get started free
            </span>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "#111827",
                letterSpacing: "-0.8px",
                marginTop: "8px",
                marginBottom: "6px",
              }}
            >
              Create your account
            </h2>
            <p style={{ fontSize: "14px", color: "#9CA3AF" }}>
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                style={{
                  color: "#4F46E5",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Email */}
            <div>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "1.5px solid #E5E7EB",
                  background: "#F9FAFB",
                  fontSize: "14px",
                  color: "#111827",
                  outline: "none",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#7C3AED";
                  e.target.style.background = "#ffffff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E5E7EB";
                  e.target.style.background = "#F9FAFB";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{
                    width: "100%",
                    padding: "12px 44px 12px 14px",
                    borderRadius: "12px",
                    border: "1.5px solid #E5E7EB",
                    background: "#F9FAFB",
                    fontSize: "14px",
                    color: "#111827",
                    outline: "none",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#7C3AED";
                    e.target.style.background = "#ffffff";
                    e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E5E7EB";
                    e.target.style.background = "#F9FAFB";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9CA3AF",
                    display: "flex",
                    alignItems: "center",
                    padding: "2px",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength bar */}
              <AnimatePresence>
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ marginTop: "10px", overflow: "hidden" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        marginBottom: "6px",
                      }}
                    >
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          style={{
                            flex: 1,
                            height: "4px",
                            borderRadius: "99px",
                            background:
                              strength.score >= step
                                ? strength.color
                                : "#E5E7EB",
                            transition: "background 0.3s",
                          }}
                        />
                      ))}
                    </div>
                    <p
                      style={{
                        fontSize: "11.5px",
                        color: strength.color,
                        fontWeight: 600,
                      }}
                    >
                      {strength.label} password
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    fontSize: "13px",
                    color: "#B91C1C",
                  }}
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Note */}
            <p
              style={{
                fontSize: "12px",
                color: "#9CA3AF",
                lineHeight: 1.5,
                margin: "0",
              }}
            >
              Make your life easier with TaskForge. By creating an account, you
              can save your plans, track your progress, and access your data
              across devices. We respect your privacy and will never share your
              information.
            </p>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={!submitting ? { scale: 1.015, y: -1 } : {}}
              whileTap={!submitting ? { scale: 0.985 } : {}}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "12px",
                border: "none",
                background: submitting
                  ? "#E5E7EB"
                  : "linear-gradient(135deg, #7C3AED, #4F46E5)",
                color: submitting ? "#9CA3AF" : "#ffffff",
                fontSize: "14px",
                fontWeight: 700,
                cursor: submitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: submitting
                  ? "none"
                  : "0 4px 16px rgba(124,58,237,0.35)",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {submitting ? "Creating account..." : "Create free account"}
              {!submitting && <ArrowRight size={16} />}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* ── Right panel — branding ── */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "46%",
          minHeight: "100vh",
          flexShrink: 0,
          background:
            "linear-gradient(145deg, #7C3AED 0%, #4F46E5 60%, #4338CA 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-60px",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-40px",
            right: "-80px",
            width: "240px",
            height: "240px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />

        {/* Top badge */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "99px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#4ADE80",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Free to get started
            </span>
          </div>
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h1
            style={{
              fontSize: "40px",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              marginBottom: "20px",
            }}
          >
            Build a smarter
            <br />
            <span style={{ color: "rgba(255,255,255,0.6)" }}>
              routine from day one.
            </span>
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.65,
              marginBottom: "36px",
              maxWidth: "340px",
            }}
          >
            Join TaskForge to plan your days, track goals, and stay consistently
            productive.
          </p>

          {/* Feature list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "40px",
            }}
          >
            {FEATURES.map((feature) => (
              <div
                key={feature}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "6px",
                    flexShrink: 0,
                    background: "rgba(74,222,128,0.2)",
                    border: "1px solid rgba(74,222,128,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check size={12} color="#4ADE80" strokeWidth={2.5} />
                </div>
                <span
                  style={{
                    fontSize: "13.5px",
                    color: "rgba(255,255,255,0.82)",
                    fontWeight: 500,
                  }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Floating plan card preview */}
          <FloatingPlanCard />
        </motion.div>
      </motion.div>
    </div>
  );
}
