"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}
    >
      <div style={{
        width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
        background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Sparkles size={13} color="#fff" />
      </div>

      <div style={{
        padding: "12px 16px", borderRadius: "4px 16px 16px 16px",
        background: "#ffffff", border: "1px solid #E5E7EB",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", gap: "5px",
      }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4F46E5" }}
          />
        ))}
      </div>
    </motion.div>
  );
}
