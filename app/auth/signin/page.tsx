"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function SignInPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, signInWithGithub } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    const result = await signIn(email, password);
    if (result.success) {
      router.push("/");
    } else {
      setMessage(result.message ?? "Sign in failed.");
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
      {/* ── Left panel — branding ── */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "46%",
          minHeight: "100vh",
          position: "relative",
          background:
            "linear-gradient(145deg, #4F46E5 0%, #6D28D9 50%, #7C3AED 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "48px",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "-60px",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "200px",
            right: "40px",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="white">
              <path d="M10 2L13 8H18L14 12L16 18L10 14L4 18L6 12L2 8H7L10 2Z" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.3px",
            }}
          >
            TaskForge
          </span>
        </div>

        {/* Main copy */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "99px",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                marginBottom: "28px",
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
                  letterSpacing: "0.3px",
                }}
              >
                AI Productivity Assistant
              </span>
            </div>

            <h1
              style={{
                fontSize: "42px",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.1,
                letterSpacing: "-1.5px",
                marginBottom: "20px",
              }}
            >
              Your plans,
              <br />
              <span style={{ color: "rgba(255,255,255,0.65)" }}>
                powered by AI.
              </span>
            </h1>

            <p
              style={{
                fontSize: "15px",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.65,
                maxWidth: "340px",
              }}
            >
              Generate personalised productivity plans, track progress, and stay
              focused — all in one calm workspace.
            </p>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{ margin: "50px" }}
          ></motion.div>
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            position: "relative",
            zIndex: 1,
            padding: "18px 20px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.6,
              fontStyle: "italic",
              marginBottom: "12px",
            }}
          >
            "TaskForge turned my chaotic to-do list into a calm, structured plan
            I actually follow."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #A5B4FC, #DDD6FE)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
                color: "#4F46E5",
              }}
            >
              MS
            </div>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                Monisha Singh
              </div>
              <div
                style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}
              >
                Full-Stack Developer
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Right panel — form ── */}
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
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", maxWidth: "400px" }}
        >
          {/* Form header */}
          <div style={{ marginBottom: "36px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#4F46E5",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Welcome back
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
              Sign in to TaskForge
            </h2>
            <p style={{ fontSize: "14px", color: "#9CA3AF" }}>
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                style={{
                  color: "#4F46E5",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Create one free
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
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#4F46E5";
                  e.target.style.background = "#ffffff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)";
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  Password
                </label>
              </div>
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
                    transition: "border-color 0.15s, box-shadow 0.15s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4F46E5";
                    e.target.style.background = "#ffffff";
                    e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)";
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
                    padding: "2px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
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
                background: submitting ? "#E5E7EB" : "#4F46E5",
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
                  : "0 4px 16px rgba(79,70,229,0.3)",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {submitting ? "Signing in..." : "Sign in"}
              {!submitting && <ArrowRight size={16} />}
            </motion.button>
          </form>

          {/* Footer */}
          <p
            style={{
              fontSize: "11.5px",
              color: "#9CA3AF",
              textAlign: "center",
              marginTop: "28px",
              lineHeight: 1.6,
            }}
          >
            Make your life easier with TaskForge. You can save your plans, track
            your progress, and access your data across devices. We respect your
            privacy and will never share your information.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
