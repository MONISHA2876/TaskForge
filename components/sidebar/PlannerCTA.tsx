"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function PlannerCTA() {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
        padding: "24px",
        color: "#ffffff",
        height: "100%",
      }}
    >
      {/* Decorative circle */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "130px",
          height: "130px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.07)",
        }}
      />

      <div style={{ fontSize: "26px", marginBottom: "10px" }}>✦</div>
      <h3
        style={{
          fontSize: "17px",
          fontWeight: 800,
          marginBottom: "8px",
          letterSpacing: "-0.3px",
          lineHeight: 1.25,
        }}
      >
        Create a new AI plan
      </h3>
      <p
        style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.8)",
          lineHeight: 1.6,
          marginBottom: "20px",
        }}
      >
        Generate a personalised productivity plan powered by Gemini AI in
        seconds.
      </p>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          href="/planner"
          style={{
            display: "block",
            textAlign: "center",
            fontSize: "13.5px",
            fontWeight: 700,
            padding: "12px",
            borderRadius: "12px",
            color: "#ffffff",
            background: "rgba(255,255,255,0.15)",
            border: "1.5px solid rgba(255,255,255,0.25)",
            textDecoration: "none",
          }}
        >
          ↗ Launch AI Planner
        </Link>
      </motion.div>
    </div>
  );
}
