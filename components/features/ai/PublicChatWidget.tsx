"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  X,
  Minus,
  Sparkles,
  Bot,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What is SmartLMS?",
  "What features do you offer?",
  "How much does it cost?",
  "How do I get started?",
];

export function PublicChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const userMsg = (text ?? input).trim();
    if (!userMsg || loading) return;

    setHasNewMessage(false);
    const newMsgs: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/public-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs }),
      });

      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      setMessages([...newMsgs, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantContent += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === "assistant") {
            updated[updated.length - 1] = { ...last, content: assistantContent };
          }
          return updated;
        });
      }
    } catch (e) {
      console.error("Chat error:", e);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an issue. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="public-chat-window"
            initial={{ opacity: 0, scale: 0.92, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.92, y: 20, filter: "blur(8px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[360px] md:w-[400px] h-[580px] flex flex-col overflow-hidden relative shadow-2xl"
            style={{
              background: "rgba(9, 10, 18, 0.94)",
              backdropFilter: "blur(28px) saturate(200%)",
              borderRadius: "28px",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Status Bar */}
            <div className="px-5 py-2 bg-white/[0.025] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">
                  AI Sales Assistant
                </span>
              </div>
              <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                Groq · Llama 3.3
              </span>
            </div>

            {/* Header */}
            <div className="p-5 flex justify-between items-center border-b border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-grad-primary flex items-center justify-center shadow-neon-purple">
                  <GraduationCap size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm leading-tight">
                    SmartLMS AI
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                    <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">
                      Ask me anything
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-xl transition-all text-text-muted hover:text-white"
                >
                  <Minus size={15} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-xl transition-all text-text-muted hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-4">
                  <div className="w-14 h-14 rounded-3xl bg-grad-primary flex items-center justify-center shadow-neon-purple">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary mb-1">
                      👋 Hi! I&apos;m SmartLMS AI
                    </p>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      Ask me about our features, pricing, or how to get started.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 w-full">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-[10px] text-text-muted border border-white/5 rounded-xl px-3 py-2 hover:bg-white/5 hover:text-text-primary hover:border-accent-cyan/20 transition-all text-left flex items-center justify-between group"
                      >
                        <span>{s}</span>
                        <ArrowRight size={10} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-lg bg-grad-primary flex items-center justify-center mr-2 flex-shrink-0 mt-1 shadow-neon-purple">
                      <Bot size={12} className="text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] px-4 py-3 text-sm leading-relaxed rounded-2xl",
                      m.role === "user"
                        ? "bg-accent-cyan/15 border border-accent-cyan/25 text-text-primary rounded-tr-sm font-medium"
                        : "bg-white/[0.04] border border-white/8 text-text-secondary rounded-tl-sm"
                    )}
                  >
                    {m.role === "assistant" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: (props) => <p className="mb-1.5 last:mb-0 text-[13px]" {...props} />,
                          ul: (props) => <ul className="list-disc ml-3 mb-1.5 space-y-0.5" {...props} />,
                          ol: (props) => <ol className="list-decimal ml-3 mb-1.5 space-y-0.5" {...props} />,
                          li: (props) => <li className="text-[12px]" {...props} />,
                          strong: (props) => <strong className="text-text-primary font-bold" {...props} />,
                          a: (props) => <a className="text-accent-cyan underline" {...props} />,
                          code: ({ children, ...props }) => (
                            <code className="bg-white/10 px-1 py-0.5 rounded text-xs font-mono text-accent-cyan" {...props}>{children}</code>
                          ),
                        }}
                      >
                        {m.content || "▋"}
                      </ReactMarkdown>
                    ) : (
                      <span className="text-[13px]">{m.content}</span>
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-lg bg-grad-primary flex items-center justify-center mr-2 flex-shrink-0 shadow-neon-purple">
                    <Bot size={12} className="text-white" />
                  </div>
                  <div className="bg-white/[0.04] border border-white/8 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-accent-cyan/60 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-accent-cyan/60 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 bg-accent-cyan/60 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              )}
            </div>

            {/* CTA Banner */}
            <div className="px-4 pb-2">
              <Link
                href="/register"
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-grad-primary text-white text-xs font-bold hover:opacity-90 transition-all shadow-neon-purple group"
              >
                <span>Start Free — No Credit Card</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Input */}
            <div className="p-4 pt-2 border-t border-white/5">
              <div className="relative flex items-center gap-2 bg-white/[0.04] border border-white/8 rounded-2xl p-1.5 pr-1.5 focus-within:border-accent-cyan/30 transition-all">
                <input
                  className="flex-1 bg-transparent px-3 py-1.5 text-sm text-text-primary placeholder-text-muted outline-none font-medium"
                  placeholder="Ask about SmartLMS..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 bg-grad-primary rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 flex items-center justify-center shadow-neon-purple flex-shrink-0"
                >
                  <Send size={13} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="public-chat-trigger"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-grad-primary rounded-2xl shadow-neon-purple flex items-center justify-center group relative overflow-hidden"
          >
            <MessageCircle
              size={24}
              className="text-white relative z-10 group-hover:scale-110 transition-transform"
            />
            {/* Notification badge */}
            {hasNewMessage && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-3 h-3 bg-accent-cyan border-2 border-background-primary rounded-full z-20"
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
