import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, X, Send, Mic, Paperclip } from "lucide-react";

const SUGGESTED = [
  "Plan my week around the Q3 report",
  "What should I focus on right now?",
  "Summarize today's progress",
];

type Msg = { id: number; from: "ai" | "user"; text: string };

export function FloatingAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      from: "ai",
      text: "Hey Arjun — I'm watching your week. You have 3 deadlines coming up. Want me to draft a focused plan for today?",
    },
  ]);
  const [typing, setTyping] = useState(false);

  const send = (text: string) => {
    if (!text.trim()) return;
    const id = Date.now();
    setMessages((m) => [...m, { id, from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: id + 1,
          from: "ai",
          text: "Got it. I've sketched a plan — block 7–10 PM tonight for deep work on the analytics report, and I'll move the design review to Wednesday morning so Thursday stays clear.",
        },
      ]);
      setTyping(false);
    }, 1100);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_40px_-10px_rgba(79,70,229,0.6)] transition-shadow hover:shadow-[0_14px_44px_-10px_rgba(79,70,229,0.7)]"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="h-5 w-5" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="fixed top-4 right-4 bottom-4 z-50 flex w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_20px_60px_-12px_rgba(17,24,39,0.25)]"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold">Guardian AI</div>
                    <div className="text-xs text-muted-foreground">
                      Always-on companion
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={
                      m.from === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    <div
                      className={
                        m.from === "user"
                          ? "max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                          : "max-w-[90%] text-sm leading-relaxed text-foreground"
                      }
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                {typing && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="h-1.5 w-1.5 rounded-full bg-current"
                    />
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        delay: 0.15,
                      }}
                      className="h-1.5 w-1.5 rounded-full bg-current"
                    />
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        delay: 0.3,
                      }}
                      className="h-1.5 w-1.5 rounded-full bg-current"
                    />
                  </div>
                )}

                {messages.length === 1 && (
                  <div className="space-y-2 pt-2">
                    {SUGGESTED.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:bg-accent hover:text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-border p-3">
                <div className="flex items-end gap-1.5 rounded-2xl border border-border bg-background p-1.5 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
                  <button className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send(input)}
                    placeholder="Ask Guardian…"
                    className="flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <button className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted">
                    <Mic className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => send(input)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:opacity-90"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
