"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { ChatMessage } from "./types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: "8px",
      }}
    >
      {/* Avatar */}
      {!isUser && (
        <div style={{
          width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
          background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "2px",
        }}>
          <Sparkles size={13} color="#fff" />
        </div>
      )}

      <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: "4px", alignItems: isUser ? "flex-end" : "flex-start" }}>
        {/* Image preview (user only) */}
        {message.imagePreview && (
          <div style={{
            borderRadius: "14px 14px 4px 14px",
            overflow: "hidden",
            border: "1px solid #E5E7EB",
            maxWidth: "200px",
          }}>
            <img
              src={message.imagePreview}
              alt="Uploaded"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        )}

        {/* Text bubble */}
        {message.content && (
          <div style={{
            padding: "10px 14px",
            borderRadius: isUser
              ? "16px 16px 4px 16px"
              : "4px 16px 16px 16px",
            background: isUser ? "#4F46E5" : "#ffffff",
            color: isUser ? "#ffffff" : "#111827",
            fontSize: "13.5px",
            lineHeight: 1.65,
            border: isUser ? "none" : "1px solid #E5E7EB",
            boxShadow: isUser
              ? "0 2px 8px rgba(79,70,229,0.25)"
              : "0 1px 3px rgba(0,0,0,0.06)",
            whiteSpace: "pre-wrap",
          }}>
            {message.content}
          </div>
        )}

        {/* Timestamp */}
        <span style={{ fontSize: "10px", color: "#9CA3AF", padding: "0 4px" }}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  );
}
