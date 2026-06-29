"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PageGreeting() {
  const { user } = useAuth();
  const displayName = user?.email?.split("@")[0] ?? "User";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ marginBottom: "36px" }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 800,
          color: "#111827",
          letterSpacing: "-1px",
          lineHeight: 1.15,
          marginBottom: "8px",
        }}
      >
        {getGreeting()}, {displayName} 👋
      </h1>
      <p style={{ fontSize: "15px", color: "#9CA3AF", fontWeight: 400 }}>
        {getFormattedDate()}
      </p>
    </motion.div>
  );
}
