"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import type { ChatMessage } from "./types";

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <span className="mb-5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#c9a45c]/30 bg-[#1a1d2b] text-[#e6c78f]">
          <Sparkles className="size-3.5" />
        </span>
      )}

      <div
        className={`flex max-w-[80%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
      >
        {message.imagePreview && (
          <div className="max-w-[200px] overflow-hidden rounded-2xl rounded-br-sm border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={message.imagePreview} alt="Uploaded" className="block h-auto w-full" />
          </div>
        )}

        {message.content && (
          <div
            className={`px-3.5 py-2.5 text-[13.5px] leading-[1.65] whitespace-pre-wrap ${
              isUser
                ? "rounded-2xl rounded-br-sm bg-gradient-to-r from-[#ecd5a5] to-[#c9a45c] font-medium text-[#1c1406]"
                : "rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.05] text-slate-100"
            }`}
          >
            {message.content}
          </div>
        )}

        <span
          suppressHydrationWarning
          className="px-1 text-[10.5px] text-slate-500"
        >
          {message.timestamp.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </motion.div>
  );
}