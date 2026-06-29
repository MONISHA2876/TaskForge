"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
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

  return (
    <div style={{
      minHeight: "100vh", display: "flex", background: "#ffffff",
      fontFamily: "Inter, -apple-system, sans-serif",
    }}>

      {/* ── Left panel — branding ── */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "46%", minHeight: "100vh", position: "relative",
          background: "linear-gradient(145deg, #4F46E5 0%, #6D28D9 50%, #7C3AED 100%)",
          display: "flex", flexDirection: "column",
          padding: "48px", overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "300px", height: "300px", borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }} />
        <div style={{
          position: "absolute", bottom: "60px", left: "-60px",
          width: "220px", height: "220px", borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }} />
        <div style={{
          position: "absolute", bottom: "200px", right: "40px",
          width: "120px", height: "120px", borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative", zIndex: 1 }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "12px",
            background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox="0 0 20 20" width="18" height="18" fill="white">
              <path d="M10 2L13 8H18L14 12L16 18L10 14L4 18L6 12L2 8H7L10 2Z" />
            </svg>
          </div>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.3px" }}>
            TaskForge
          </span>
        </div>

        {/* Main copy */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 14px", borderRadius: "99px",
              background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
              marginBottom: "28px",
            }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ADE80" }} />
              <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.9)", letterSpacing: "0.3px" }}>
                AI Productivity Assistant
              </span>
            </div>

            <h1 style={{
              fontSize: "42px", fontWeight: 800, color: "#ffffff",
              lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: "20px",
            }}>
              Your plans,<br />
              <span style={{ color: "rgba(255,255,255,0.65)" }}>powered by AI.</span>
            </h1>

            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", lineHeight: 1.65, maxWidth: "340px" }}>
              Generate personalised productivity plans, track progress, and stay focused — all in one calm workspace.
            </p>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{ marginTop: "52px" }}
          >
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px",
            }}>
              {[
                { value: "2.4k+", label: "Plans generated" },
                { value: "91%", label: "Avg. productivity score" },
                { value: "6 days", label: "Longest streak" },
              ].map((stat) => (
                <div key={stat.label} style={{
                  padding: "14px 16px", borderRadius: "14px",
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)",
                }}>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.5px" }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", marginTop: "3px", fontWeight: 500 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            position: "relative", zIndex: 1,
            padding: "18px 20px", borderRadius: "16px",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, fontStyle: "italic", marginBottom: "12px" }}>
            "TaskForge turned my chaotic to-do list into a calm, structured plan I actually follow."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%",
              background: "linear-gradient(135deg, #A5B4FC, #DDD6FE)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 700, color: "#4F46E5",
            }}>
              AJ
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>Alex Jordan</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>Full-Stack Developer</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Right panel — form ── */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 40px", background: "#ffffff",
      }}>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", maxWidth: "400px" }}
        >
          {/* Form header */}
          <div style={{ marginBottom: "36px" }}>
            <span style={{
              fontSize: "11px", fontWeight: 700, color: "#4F46E5",
              letterSpacing: "1px", textTransform: "uppercase",
            }}>
              Welcome back
            </span>
            <h2 style={{
              fontSize: "28px", fontWeight: 800, color: "#111827",
              letterSpacing: "-0.8px", marginTop: "8px", marginBottom: "6px",
            }}>
              Sign in to TaskForge
            </h2>
            <p style={{ fontSize: "14px", color: "#9CA3AF" }}>
              Don't have an account?{" "}
              <Link href="/auth/signup" style={{ color: "#4F46E5", fontWeight: 600, textDecoration: "none" }}>
                Create one free
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Email */}
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "12px",
                  border: "1.5px solid #E5E7EB", background: "#F9FAFB",
                  fontSize: "14px", color: "#111827", outline: "none",
                  fontFamily: "inherit", transition: "border-color 0.15s, box-shadow 0.15s",
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                  Password
                </label>
                <button
                  type="button"
                  style={{ fontSize: "12px", color: "#4F46E5", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  Forgot password?
                </button>
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
                    width: "100%", padding: "12px 44px 12px 14px", borderRadius: "12px",
                    border: "1.5px solid #E5E7EB", background: "#F9FAFB",
                    fontSize: "14px", color: "#111827", outline: "none",
                    fontFamily: "inherit", transition: "border-color 0.15s, box-shadow 0.15s",
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
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: "2px",
                    display: "flex", alignItems: "center",
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
                    padding: "10px 14px", borderRadius: "10px",
                    background: "#FEF2F2", border: "1px solid #FECACA",
                    fontSize: "13px", color: "#B91C1C",
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
                width: "100%", padding: "13px",
                borderRadius: "12px", border: "none",
                background: submitting ? "#E5E7EB" : "#4F46E5",
                color: submitting ? "#9CA3AF" : "#ffffff",
                fontSize: "14px", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                boxShadow: submitting ? "none" : "0 4px 16px rgba(79,70,229,0.3)",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {submitting ? "Signing in..." : "Sign in"}
              {!submitting && <ArrowRight size={16} />}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            margin: "24px 0",
          }}>
            <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
            <span style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: 500 }}>or continue with</span>
            <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
          </div>

          {/* OAuth placeholders */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              {
                label: "Google",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                ),
              },
              {
                label: "GitHub",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#111827">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                ),
              },
            ].map((provider) => (
              <motion.button
                key={provider.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  padding: "11px", borderRadius: "12px",
                  background: "#ffffff", border: "1.5px solid #E5E7EB",
                  fontSize: "13.5px", fontWeight: 600, color: "#374151",
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "border-color 0.15s",
                }}
              >
                {provider.icon}
                {provider.label}
              </motion.button>
            ))}
          </div>

          {/* Footer */}
          <p style={{ fontSize: "11.5px", color: "#9CA3AF", textAlign: "center", marginTop: "28px", lineHeight: 1.6 }}>
            By signing in, you agree to our{" "}
            <span style={{ color: "#4F46E5", cursor: "pointer" }}>Terms</span>{" "}
            and{" "}
            <span style={{ color: "#4F46E5", cursor: "pointer" }}>Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
