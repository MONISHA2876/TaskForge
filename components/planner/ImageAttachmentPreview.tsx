"use client";

import { motion } from "motion/react";
import { Check, Info, LoaderCircle, X } from "lucide-react";
import { focusRing } from "@/components/styles/styles";

export type AttachmentStatus = "scanning" | "done" | "failed";

interface ImageAttachmentPreviewProps {
  preview: string;
  name: string;
  size: number;
  status: AttachmentStatus;
  onRemove: () => void;
}

const STATUS = {
  scanning: {
    icon: LoaderCircle,
    text: "Reading image…",
    tone: "text-[#ecd5a5]",
    spin: true,
  },
  done: {
    icon: Check,
    text: "Text extracted · ready to send",
    tone: "text-emerald-300",
    spin: false,
  },
  failed: {
    icon: Info,
    text: "Couldn’t read text · image will still be sent",
    tone: "text-amber-300",
    spin: false,
  },
} as const;

const formatBytes = (b: number) =>
  b < 1024 * 1024
    ? `${Math.max(1, Math.round(b / 1024))} KB`
    : `${(b / 1024 / 1024).toFixed(1)} MB`;

export default function ImageAttachmentPreview({
  preview,
  name,
  size,
  status,
  onRemove,
}: ImageAttachmentPreviewProps) {
  const { icon: StatusIcon, text, tone, spin } = STATUS[status];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="relative mx-4 mt-3 flex items-center gap-3.5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-2.5 pr-3">
        {/* Thumbnail */}
        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="size-full object-cover" />
          {status === "scanning" && (
            <>
              <span className="absolute inset-0 bg-[#0a1228]/40" />
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 bg-[#f0dcae] shadow-[0_0_8px_#f0dcae]"
                animate={{ y: [0, 54] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            </>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-white">{name}</p>
          <p className="mt-0.5 text-[11.5px] text-slate-400">{formatBytes(size)}</p>
          <p
            role="status"
            className={`mt-1 flex items-center gap-1.5 text-[11.5px] ${tone}`}
          >
            <StatusIcon className={`size-3 shrink-0 ${spin ? "animate-spin" : ""}`} />
            <span className="truncate">{text}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove image"
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white ${focusRing}`}
        >
          <X className="size-4" />
        </button>

        {/* Indeterminate progress while scanning */}
        {status === "scanning" && (
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-white/[0.06]"
          >
            <motion.span
              className="block h-full w-1/3 rounded-full bg-gradient-to-r from-[#d8bb84] to-[#f0dcae]"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        )}
      </div>
    </motion.div>
  );
}