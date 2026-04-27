"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  X,
  Minus,
  GraduationCap,
  Sparkles,
  Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSession } from "next-auth/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChatBox() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = "smartlms_chat_session";
    const existing = localStorage.getItem(key);
    if (existing) {
      setSessionId(existing);
      return;
    }
    const created = crypto.randomUUID();
    localStorage.setItem(key, created);
    setSessionId(created);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    const newMsgs: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMsgs,
          session_id: sessionId || undefined,
        }),
      });

      const returnedSessionId = res.headers.get("X-Session-Id");
      if (returnedSessionId && returnedSessionId !== sessionId) {
        localStorage.setItem("smartlms_chat_session", returnedSessionId);
        setSessionId(returnedSessionId);
      }

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
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const userName = session?.user?.name?.split(" ")[0] || "there";

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.92, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.92, y: 20, filter: "blur(8px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[380px] md:w-[420px] h-[600px] flex flex-col overflow-hidden relative shadow-2xl"
            style={{
              background: "rgba(11, 15, 26, 0.92)",
              backdropFilter: "blur(24px) saturate(200%)",
              borderRadius: "28px",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Status Bar */}
            <div className="px-5 py-2 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">
                  SmartLMS Neural Tutor
                </span>
              </div>
              <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                v2.0 · Groq LLM
              </span>
            </div>

            {/* Header */}
            <div className="p-5 flex justify-between items-center border-b border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-grad-primary flex items-center justify-center shadow-neon-purple">
                  <GraduationCap size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm leading-tight tracking-tight">
                    SmartLMS AI Tutor
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1 h-1 rounded-full bg-accent-cyan" />
                    <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">
                      Online · Llama 3.3 70B
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-xl transition-all text-text-muted hover:text-text-primary"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-xl transition-all text-text-muted hover:text-text-primary"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-6 opacity-60 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-grad-primary flex items-center justify-center shadow-neon-purple">
                    <Sparkles size={28} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary mb-1">
                      Hey {userName}! 👋
                    </p>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      Ask me anything about your courses, lessons, assignments,
                      or exams. I&apos;m here to help you learn faster.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 w-full mt-2">
                    {[
                      "Find me a JavaScript course",
                      "Explain recursion simply",
                      "Help me prepare for exams",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInput(suggestion);
                        }}
                        className="text-[10px] text-text-muted border border-white/5 rounded-xl px-3 py-2 hover:bg-white/5 hover:text-text-primary transition-all text-left"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-xl bg-grad-primary flex items-center justify-center mr-2 flex-shrink-0 mt-1 shadow-neon-purple">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] px-4 py-3 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-accent-cyan/20 border border-accent-cyan/30 text-text-primary rounded-[20px] rounded-tr-sm font-medium"
                        : "bg-white/[0.04] border border-white/8 text-text-secondary rounded-[20px] rounded-tl-sm backdrop-blur-sm"
                    )}
                  >
                    {m.role === "assistant" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: (props) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: (props) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                          ol: (props) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                          li: (props) => <li className="text-sm" {...props} />,
                          strong: (props) => <strong className="text-text-primary font-bold" {...props} />,
                          code: ({ children, ...props }) => (
                            <code
                              className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono text-accent-cyan"
                              {...props}
                            >
                              {children}
                            </code>
                          ),
                          pre: (props) => (
                            <pre
                              className="bg-white/5 border border-white/10 p-3 rounded-xl overflow-x-auto text-xs font-mono mb-2 scrollbar-thin"
                              {...props}
                            />
                          ),
                          h1: (props) => <h1 className="text-base font-black text-text-primary mb-2" {...props} />,
                          h2: (props) => <h2 className="text-sm font-black text-text-primary mb-1" {...props} />,
                          h3: (props) => <h3 className="text-sm font-bold text-text-primary mb-1" {...props} />,
                          blockquote: (props) => (
                            <blockquote className="border-l-2 border-accent-purple/50 pl-3 italic text-text-muted mb-2" {...props} />
                          ),
                        }}
                      >
                        {m.content || "▋"}
                      </ReactMarkdown>
                    ) : (
                      m.content
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-xl bg-grad-primary flex items-center justify-center mr-2 flex-shrink-0 shadow-neon-purple">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-white/[0.04] border border-white/8 px-4 py-3 rounded-[20px] rounded-tl-sm flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-accent-cyan/60 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-accent-cyan/60 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 bg-accent-cyan/60 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-gradient-to-t from-white/[0.02] to-transparent">
              <div className="relative flex items-center gap-2 bg-white/[0.04] border border-white/8 rounded-2xl p-2 pr-2 focus-within:border-accent-cyan/30 focus-within:bg-white/[0.06] transition-all">
                <input
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none font-medium"
                  placeholder="Ask your AI tutor anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 bg-grad-primary rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 flex items-center justify-center shadow-neon-purple flex-shrink-0"
                >
                  <Send size={15} className="text-white" />
                </button>
              </div>
              <p className="text-center text-[8px] text-text-muted mt-2 opacity-40">
                Powered by Groq · SmartLMS AI
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="chat-trigger"
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
            {/* Notification dot */}
            <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-accent-cyan border-2 border-background-primary rounded-full z-20 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
