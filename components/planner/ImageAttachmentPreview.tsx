"use client";

import { motion } from "framer-motion";
import { X, ScanLine } from "lucide-react";

interface ImageAttachmentPreviewProps {
  preview: string;
  fileName: string;
  scanning: boolean;
  scanned: boolean;
  onRemove: () => void;
}

export default function ImageAttachmentPreview({
  preview,
  fileName,
  scanning,
  scanned,
  onRemove,
}: ImageAttachmentPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      style={{
        padding: "10px 14px",
        borderTop: "1px solid #F3F4F6",
        background: "#FAFAFA",
        display: "flex", alignItems: "center", gap: "12px",
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <img
          src={preview}
          alt="attachment"
          style={{
            width: "52px", height: "52px", borderRadius: "10px",
            objectFit: "cover", border: "1px solid #E5E7EB",
          }}
        />
        {/* Scan overlay */}
        {scanning && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "10px",
            background: "rgba(79,70,229,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            >
              <ScanLine size={18} color="#4F46E5" />
            </motion.div>
          </div>
        )}
        {scanned && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "10px",
            background: "rgba(5,150,105,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: "16px" }}>✓</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: "12.5px", fontWeight: 600, color: "#111827",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {fileName}
        </p>
        <p style={{ fontSize: "11px", color: scanning ? "#4F46E5" : scanned ? "#059669" : "#9CA3AF", marginTop: "2px" }}>
          {scanning ? "Analyzing with Vision AI..." : scanned ? "Content extracted — ready to send" : "Image attached"}
        </p>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        style={{
          width: "26px", height: "26px", borderRadius: "8px", flexShrink: 0,
          background: "#F3F4F6", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <X size={13} color="#6B7280" />
      </button>
    </motion.div>
  );
}
