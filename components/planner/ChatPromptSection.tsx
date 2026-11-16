"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { ImageIcon, Mic, SendHorizontal, Sparkles, ChevronLeft } from "lucide-react";
import QuickPromptChips from "./QuickPromptChips";
import VoiceModal from "./VoiceModal";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ImageAttachmentPreview, { type AttachmentStatus } from "./ImageAttachmentPreview";
import { blobToBase64, uid } from "./utils";
import type { ChatMessage } from "./types";
import { card, focusRing } from "@/components/styles/styles"; 
import Link from "next/link";

const MAX_IMAGE_MB = 8;

const createWelcome = (): ChatMessage => ({
  id: uid(),
  role: "assistant",
  content:
    "Hi! I'm your AI productivity coach. Tell me what you'd like to accomplish — a study session, interview prep, workout plan, or anything else — and I'll ask a few questions to build the perfect plan for you.",
  timestamp: new Date(),
});

interface Attachment {
  name: string;
  size: number;
  preview: string;
  base64: string;
  mime: string;
  status: AttachmentStatus;
  visionText: string;
}

interface ChatPromptSectionProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export default function ChatPrompt({ onGenerate, isGenerating }: ChatPromptSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createWelcome()]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [notice, setNotice] = useState("");
  const [dragging, setDragging] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showChips = messages.length <= 1;
  const hasConversation = messages.length > 1;
  const scanning = attachment?.status === "scanning";
  const hasInput = draft.trim().length > 0 || !!attachment;
  const canSend = hasInput && !loading && !scanning;
  const canGenerate = hasConversation && !isGenerating;

  // Keep the newest message in view
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  /* ---------------------------------------------------------------- */
  /* Image attachment                                                   */
  /* ---------------------------------------------------------------- */

  function clearAttachment() {
    if (attachment) URL.revokeObjectURL(attachment.preview);
    setAttachment(null);
  }

  async function attachImage(file: File) {
    if (!file.type.startsWith("image/")) return;
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setNotice(`Images must be under ${MAX_IMAGE_MB} MB.`);
      return;
    }
    setNotice("");
    if (attachment) URL.revokeObjectURL(attachment.preview);

    const preview = URL.createObjectURL(file);
    setAttachment({
      name: file.name,
      size: file.size,
      preview,
      base64: "",
      mime: file.type,
      status: "scanning",
      visionText: "",
    });

    // Ignore updates if the user swapped / removed the image meanwhile
    const patch = (p: Partial<Attachment>) =>
      setAttachment((a) => (a && a.preview === preview ? { ...a, ...p } : a));

    try {
      const base64 = await blobToBase64(file);
      patch({ base64 });

      const res = await fetch("/api/vision-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await res.json();
      patch(
        data.text
          ? { status: "done", visionText: data.text }
          : { status: "failed" },
      );
    } catch {
      // Vision is optional — the image can still be sent
      patch({ status: "failed" });
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void attachImage(file);
    e.target.value = "";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void attachImage(file);
  }

  function handlePaste(e: ClipboardEvent<HTMLTextAreaElement>) {
    const file = Array.from(e.clipboardData.files).find((f) => f.type.startsWith("image/"));
    if (file) {
      e.preventDefault();
      void attachImage(file);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Sending                                                            */
  /* ---------------------------------------------------------------- */

  async function sendMessage(textOverride?: string) {
    const text = (textOverride ?? draft).trim();
    if ((!text && !attachment) || loading || scanning) return;

    const sent = attachment;
    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content: text,
      imagePreview: sent?.preview,
      imageBase64: sent?.base64 || undefined,
      imageMimeType: sent?.mime,
      timestamp: new Date(),
    };
    const next = [...messages, userMsg];

    setMessages(next);
    setDraft("");
    setNotice("");
    setAttachment(null); // preview URL stays alive — the message still uses it
    setLoading(true);

    const userInput = sent?.visionText
      ? `${text}\n\n[Image content extracted by Vision AI]:\n${sent.visionText}`
      : text;

    try {
      const res = await fetch("/api/planner-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: messages.map(({ role, content, imageBase64, imageMimeType }) => ({
            role,
            content,
            imageBase64,
            imageMimeType,
          })),
          userInput,
          imageBase64: sent?.base64 || undefined,
          imageMimeType: sent?.mime,
        }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        {
          id: uid(),
          role: "assistant",
          content: data.message ?? "I couldn't respond. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages([
        ...next,
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
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  function handleVoiceTranscript(text: string) {
    setDraft((prev) => (prev ? `${prev} ${text}` : text));
    inputRef.current?.focus();
  }

  function handleGeneratePlan() {
    const summary = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join("\n");
    onGenerate(summary || draft);
  }

  /* ---------------------------------------------------------------- */
  /* Render                                                             */
  /* ---------------------------------------------------------------- */

  const swap = {
    initial: { opacity: 0, scale: 0.6 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.6 },
    transition: { duration: 0.15 },
  };

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
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex h-full min-h-0 flex-col gap-5"
      >
        {/* Header */}
        <header>
          <Link
            href="/"
            className={`h-9 font-serif rounded-full flex flex-row items-center gap-2 pb-6 text-[16px] font-medium text-slate-100  ${focusRing}`}
          >
            <ChevronLeft className="size-[18px]" />
            DashBoard
          </Link>
          <h2 className="font-serif text-[26px] leading-tight font-medium text-white">
            {showChips ? (
              <>
                What would you like
                <br />
                to accomplish?
              </>
            ) : (
              "Refine your plan"
            )}
          </h2>
          <p className="mt-2 text-[13px] text-slate-400">
            Chat with AI to refine your plan — then generate it.
          </p>
        </header>

        {/* Quick prompts (only before the first message) */}
        <AnimatePresence initial={false}>
          {showChips && (
            <motion.div
              exit={{ opacity: 0, height: 0, marginTop: -20 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <QuickPromptChips onSelect={(prompt) => void sendMessage(prompt)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat + composer */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`${card} flex min-h-0 flex-1 flex-col overflow-hidden transition-colors ${
            dragging ? "border-[#c9a45c]/60 bg-[#c9a45c]/[0.05]" : ""
          }`}
        >
          <div
            ref={scrollRef}
            className="flex max-h-[55vh] min-h-[260px] flex-1 flex-col gap-4 overflow-y-auto p-4 xl:max-h-none xl:min-h-0"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {loading && <TypingIndicator key="typing" />}
            </AnimatePresence>
          </div>

          <div className="border-t border-white/[0.07] pb-3">
            <AnimatePresence initial={false}>
              {attachment && (
                <ImageAttachmentPreview
                  preview={attachment.preview}
                  name={attachment.name}
                  size={attachment.size}
                  status={attachment.status}
                  onRemove={clearAttachment}
                />
              )}
            </AnimatePresence>

            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Type your message, or drop an image…"
              aria-label="Message"
              rows={2}
              className="block w-full resize-none bg-transparent px-5 pt-4 text-[13.5px] leading-[1.6] text-white outline-none placeholder:text-slate-500"
            />

            <div className="flex items-center justify-between gap-3 px-4 pt-2">
              <div className="flex min-w-0 items-center gap-3">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => fileRef.current?.click()}
                  aria-label="Attach image"
                  title="Attach image"
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors ${focusRing} ${
                    attachment
                      ? "border-[#c9a45c]/60 bg-[#c9a45c]/15 text-[#f0d9a8]"
                      : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-[#c9a45c]/50 hover:bg-[#c9a45c]/10 hover:text-white"
                  }`}
                >
                  <ImageIcon className="size-4" />
                </motion.button>

                <span
                  className={`hidden truncate text-[11px] sm:block ${
                    notice ? "text-rose-300" : "text-slate-500"
                  }`}
                >
                  {notice || "Enter to send · Shift+Enter for new line"}
                </span>
              </div>

              {/* Primary action: mic when empty, send once there's input */}
              <AnimatePresence mode="wait" initial={false}>
                {hasInput ? (
                  <motion.button
                    key="send"
                    type="button"
                    {...swap}
                    onClick={() => void sendMessage()}
                    disabled={!canSend}
                    aria-label="Send message"
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-[filter,background-color] ${focusRing} ${
                      canSend
                        ? "bg-gradient-to-r from-[#ecd5a5] to-[#c9a45c] text-[#1c1406] hover:brightness-110"
                        : "bg-white/[0.08] text-slate-500"
                    }`}
                  >
                    <SendHorizontal className="size-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    key="mic"
                    type="button"
                    {...swap}
                    onClick={() => setVoiceOpen(true)}
                    aria-label="Dictate with your voice"
                    title="Dictate with your voice"
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full border border-[#c9a45c]/50 bg-[#c9a45c]/10 text-[#f0d9a8] transition-colors hover:bg-[#c9a45c]/20 ${focusRing}`}
                  >
                    <Mic className="size-[18px]" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Generate */}
        <div className="shrink-0">
          <AnimatePresence>
            {hasConversation && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="mb-3 flex items-center gap-2.5 rounded-xl border border-[#c9a45c]/25 bg-[#c9a45c]/[0.07] px-4 py-2.5"
              >
                <Sparkles className="size-3.5 shrink-0 text-[#e6c78f]" />
                <p className="text-[12.5px] text-[#f0d9a8]">
                  Happy with the details? Generate your personalized schedule.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            whileHover={canGenerate ? { y: -1 } : undefined}
            whileTap={canGenerate ? { scale: 0.985 } : undefined}
            onClick={handleGeneratePlan}
            disabled={!canGenerate}
            className={`flex h-12 w-full items-center justify-center gap-2.5 rounded-full text-[14.5px] font-semibold transition-[filter,background-color] ${focusRing} ${
              canGenerate
                ? "bg-gradient-to-r from-[#ecd5a5] via-[#e0bf86] to-[#c9a45c] text-[#1c1406] shadow-[0_8px_24px_rgba(201,164,92,0.25)] hover:brightness-110"
                : "bg-white/[0.06] text-slate-500"
            }`}
          >
            {isGenerating ? (
              <>
                <span className="flex gap-1" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="size-1.5 rounded-full bg-slate-400"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </span>
                Building your plan…
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate Plan
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}