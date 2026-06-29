"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizonal, Mic, ImageIcon, X, Sparkles } from "lucide-react";
import QuickPromptChips from "./QuickPromptChips";
import VoiceModal from "./VoiceModal";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ImageAttachmentPreview from "./ImageAttachmentPreview";
import type { ChatMessage } from "./types";

// ─── helpers ────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2);
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // strip data url prefix
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── props ──────────────────────────────────────────────────────────────────

interface ChatPromptSectionProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

// ─── component ──────────────────────────────────────────────────────────────

export default function ChatPromptSection({
  onGenerate,
  isGenerating,
}: ChatPromptSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const [voiceOpen, setVoiceOpen] = useState(false);

  // Image attachment state
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedPreview, setAttachedPreview] = useState<string>("");
  const [attachedBase64, setAttachedBase64] = useState<string>("");
  const [attachedMime, setAttachedMime] = useState<string>("");
  const [visionText, setVisionText] = useState<string>("");
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Welcome message on mount
  useEffect(() => {
    const welcome: ChatMessage = {
      id: uid(),
      role: "assistant",
      content:
        "Hi! 👋 I'm your AI productivity coach. Tell me what you'd like to accomplish — a study session, interview prep, workout plan, or anything else — and I'll ask a few questions to build the perfect plan for you.",
      timestamp: new Date(),
    };
    setMessages([welcome]);
  }, []);

  // ── send message ───────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (textOverride?: string) => {
      const text = (textOverride ?? draft).trim();
      const hasImage = !!attachedBase64;

      if (!text && !hasImage) return;
      if (loading) return;

      setShowChips(false);

      // Build user message
      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content: text,
        imagePreview: attachedPreview || undefined,
        imageBase64: attachedBase64 || undefined,
        imageMimeType: attachedMime || undefined,
        timestamp: new Date(),
      };

      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setDraft("");

      // Clear attachment
      const sentBase64 = attachedBase64;
      const sentMime = attachedMime;
      const sentVisionText = visionText;
      clearAttachment();

      setLoading(true);

      try {
        // Build final text — append vision-extracted text if available
        const fullText = sentVisionText
          ? `${text}\n\n[Image content extracted by Vision AI]:\n${sentVisionText}`
          : text;

        const res = await fetch("/api/planner-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation: nextMessages.slice(0, -1).map((m) => ({
              role: m.role,
              content: m.content,
              imageBase64: m.imageBase64,
              imageMimeType: m.imageMimeType,
            })),
            userInput: fullText,
            imageBase64: sentBase64 || undefined,
            imageMimeType: sentMime || undefined,
          }),
        });

        const data = await res.json();

        const aiMsg: ChatMessage = {
          id: uid(),
          role: "assistant",
          content: data.message ?? "I couldn't respond. Please try again.",
          timestamp: new Date(),
        };

        setMessages([...nextMessages, aiMsg]);
      } catch {
        setMessages([
          ...nextMessages,
          {
            id: uid(),
            role: "assistant",
            content: "Something went wrong. Please try again.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [
      draft,
      messages,
      loading,
      attachedBase64,
      attachedPreview,
      attachedMime,
      visionText,
    ],
  );

  // ── image attachment ────────────────────────────────────────────────────────

  function clearAttachment() {
    setAttachedFile(null);
    setAttachedPreview("");
    setAttachedBase64("");
    setAttachedMime("");
    setVisionText("");
    setScanning(false);
    setScanned(false);
  }

  async function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) return;

    // Preview
    const preview = URL.createObjectURL(file);
    setAttachedFile(file);
    setAttachedPreview(preview);
    setAttachedMime(file.type);
    setScanning(true);
    setScanned(false);
    setVisionText("");

    // Base64 for API
    const base64 = await fileToBase64(file);
    setAttachedBase64(base64);

    // Run Vision API
    try {
      const res = await fetch("/api/vision-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await res.json();
      if (data.text) setVisionText(data.text);
    } catch {
      // Vision is optional — continue without it
    } finally {
      setScanning(false);
      setScanned(true);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleImageFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void handleImageFile(file);
  }

  // ── voice ──────────────────────────────────────────────────────────────────

  function handleVoiceTranscript(text: string) {
    setDraft((prev) => (prev ? `${prev} ${text}` : text));
    inputRef.current?.focus();
  }

  // ── keyboard ───────────────────────────────────────────────────────────────

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  // ── chip select ────────────────────────────────────────────────────────────

  function handleChipSelect(prompt: string) {
    setShowChips(false);
    void sendMessage(prompt);
  }

  // ── generate plan ──────────────────────────────────────────────────────────

  function handleGeneratePlan() {
    // Build a consolidated prompt from the whole conversation
    const conversationSummary = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join("\n");
    onGenerate(conversationSummary || draft);
  }

  const hasConversation = messages.length > 1;
  const canSend = (draft.trim().length > 0 || !!attachedBase64) && !loading;

  return (
    <>
      <VoiceModal
        isOpen={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onTranscript={handleVoiceTranscript}
      />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          gap: "0",
        }}
      >
        {/* ── Header ── */}
        {showChips ? (
          <div style={{ padding: "0 0 16px 0", flexShrink: 0 }}>
            <motion.h2
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "-0.5px",
                lineHeight: 1.25,
                marginBottom: "6px",
              }}
            >
              What would you like
              <br />
              to accomplish?
            </motion.h2>
            <p style={{ fontSize: "13.5px", color: "#6B7280" }}>
              Chat with AI to refine your plan — then generate it.
            </p>
          </div>
        ) : (
          <motion.h2
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.5px",
              lineHeight: 1.25,
              marginBottom: "6px",
            }}
          >
            Refine your plan with AI - then generate it.
          </motion.h2>
        )}
        {/* ── Quick chips (hide after first message) ── */}
        <AnimatePresence>
          {showChips && (
            <motion.div
              initial={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                flexShrink: 0,
                marginBottom: "14px",
                overflow: "hidden",
              }}
            >
              <QuickPromptChips onSelect={handleChipSelect} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Chat messages ── */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            padding: "16px",
            background: "#F9FAFB",
            borderRadius: "20px 20px 0 0",
            border: "1px solid #E5E7EB",
            borderBottom: "none",
            minHeight: 0,
            maxHeight: "60vh",
          }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {loading && <TypingIndicator key="typing" />}
          </AnimatePresence>
        </div>

        {/* ── Image attachment preview ── */}
        <AnimatePresence>
          {attachedPreview && (
            <ImageAttachmentPreview
              preview={attachedPreview}
              fileName={attachedFile?.name ?? "image"}
              scanning={scanning}
              scanned={scanned}
              onRemove={clearAttachment}
            />
          )}
        </AnimatePresence>

        {/* ── Input area ── */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #E5E7EB",
            borderTop: attachedPreview ? "none" : "1px solid #E5E7EB",
            borderRadius: attachedPreview ? "0 0 20px 20px" : "0 0 20px 20px",
            padding: "12px 14px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              placeholder="Type your message... or drop an image"
              rows={2}
              style={{
                flex: 1,
                resize: "none",
                border: "none",
                outline: "none",
                fontSize: "13.5px",
                color: "#111827",
                background: "transparent",
                lineHeight: 1.6,
                fontFamily: "inherit",
              }}
            />

            {/* Hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexShrink: 0,
              }}
            >
              {/* Image button */}
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => fileRef.current?.click()}
                title="Attach image"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  background: attachedPreview ? "#EEF2FF" : "#F3F4F6",
                  border: attachedPreview
                    ? "1.5px solid #A5B4FC"
                    : "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <ImageIcon
                  size={15}
                  color={attachedPreview ? "#4F46E5" : "#6B7280"}
                />
              </motion.button>

              {/* Voice button */}
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setVoiceOpen(true)}
                title="Voice input"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  background: "#F3F4F6",
                  border: "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Mic size={15} color="#6B7280" />
              </motion.button>

              {/* Send button */}
              <motion.button
                whileHover={canSend ? { scale: 1.07 } : {}}
                whileTap={canSend ? { scale: 0.93 } : {}}
                onClick={() => void sendMessage()}
                disabled={!canSend}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  background: canSend ? "#4F46E5" : "#E5E7EB",
                  border: "none",
                  cursor: canSend ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                }}
              >
                <SendHorizonal
                  size={14}
                  color={canSend ? "#ffffff" : "#9CA3AF"}
                />
              </motion.button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "8px",
            }}
          >
            <span style={{ fontSize: "10.5px", color: "#D1D5DB" }}>
              Enter to send · Shift+Enter for new line · Drop image to attach
            </span>
            {draft.length > 0 && (
              <button
                onClick={() => setDraft("")}
                style={{
                  fontSize: "10.5px",
                  color: "#9CA3AF",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Generate Plan button ── */}
        <div style={{ paddingTop: "14px", flexShrink: 0 }}>
          <AnimatePresence>
            {hasConversation && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                style={{
                  marginBottom: "10px",
                  padding: "10px 14px",
                  background: "#EEF2FF",
                  borderRadius: "12px",
                  border: "1px solid #C7D2FE",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Sparkles size={14} color="#4F46E5" />
                <p
                  style={{
                    fontSize: "12.5px",
                    color: "#4F46E5",
                    fontWeight: 500,
                  }}
                >
                  Happy with the details? Click Generate Plan to create your
                  personalized schedule.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={!isGenerating ? { scale: 1.015, y: -1 } : {}}
            whileTap={!isGenerating ? { scale: 0.985 } : {}}
            onClick={handleGeneratePlan}
            disabled={isGenerating || messages.length < 2}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "16px",
              border: "none",
              cursor:
                isGenerating || messages.length < 2 ? "not-allowed" : "pointer",
              fontSize: "15px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              background:
                isGenerating || messages.length < 2 ? "#F3F4F6" : "#4F46E5",
              color:
                isGenerating || messages.length < 2 ? "#9CA3AF" : "#ffffff",
              boxShadow:
                messages.length >= 2 && !isGenerating
                  ? "0 4px 16px rgba(79,70,229,0.28)"
                  : "none",
              transition: "all 0.2s",
            }}
          >
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#9CA3AF",
                          display: "block",
                        }}
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          scale: [0.8, 1, 0.8],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  Building your plan...
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 1L10.39 5.26L15 6.18L11.5 9.59L12.22 14.18L8 12L3.78 14.18L4.5 9.59L1 6.18L5.61 5.26L8 1Z"
                      fill="currentColor"
                    />
                  </svg>
                  Generate Plan
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
