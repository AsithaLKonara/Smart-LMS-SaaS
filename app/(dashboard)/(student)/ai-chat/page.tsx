'use client';

import { useChat, type Message } from 'ai/react';
import { Bot, Send, User, Sparkles, Brain, GraduationCap, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextGradient } from '@/components/ui/TextGradient';
import Link from 'next/link';

export default function AIChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/ai/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm your Personal AI Tutor. I'm here to help you understand complex concepts, summarize lessons, or help you with your assignments. What would you like to learn today?",
      },
    ],
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--height-topbar)-64px)] md:h-[calc(100vh-var(--height-topbar)-40px)]">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="md:hidden p-2 rounded-lg hover:bg-white/5 text-text-muted">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-text-primary font-heading tracking-tight flex items-center gap-3">
              AI <TextGradient>Personal Tutor</TextGradient>
              <Sparkles className="w-5 h-5 text-accent-cyan animate-pulse" />
            </h1>
            <p className="text-text-secondary text-sm">Your 24/7 intelligent learning companion</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearChat}
          className="text-text-muted hover:text-red-400 hover:border-red-400/20"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Session
        </Button>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Main Chat Area */}
        <Card className="flex-1 flex flex-col glass border-white/5 relative overflow-hidden">
          {/* Messages container */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
          >
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4",
                    m.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border",
                    m.role === 'user' 
                      ? "bg-accent-purple/20 border-accent-purple/30 text-accent-purple" 
                      : "bg-accent-cyan/20 border-accent-cyan/30 text-accent-cyan"
                  )}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div className={cn(
                    "flex flex-col gap-2 max-w-[80%]",
                    m.role === 'user' ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed",
                      m.role === 'user'
                        ? "bg-grad-primary text-white rounded-tr-none shadow-neon-purple"
                        : "glass-dark border border-white/5 text-text-primary rounded-tl-none shadow-lg"
                    )}>
                      {m.content}
                    </div>
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest opacity-50">
                      {m.role === 'user' ? 'Student' : 'AI Tutor'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="glass-dark border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/5 bg-white/[0.02]">
            <form onSubmit={handleSubmit} className="relative group">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask your tutor anything... (e.g. 'Explain quantum entanglement in simple terms')"
                className="pr-14 h-14 bg-white/5 backdrop-blur-md border-white/10 rounded-2xl focus:border-accent-cyan/50 focus:ring-accent-cyan/10 transition-all text-base"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-accent-cyan text-background-primary hover:bg-white transition-all shadow-neon-cyan disabled:opacity-50 disabled:grayscale"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
            <p className="text-center text-[10px] text-text-muted mt-3 uppercase tracking-tighter font-bold">
              Powered by Advanced AI • Course Context Aware
            </p>
          </div>
        </Card>

        {/* Sidebar Help / Suggestions */}
        <div className="hidden lg:flex flex-col w-80 gap-6">
          <Card className="p-6 glass border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-accent-cyan mb-2">
              <Brain className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Quick Suggestions</h3>
            </div>
            {[
              "Summarize my recent lesson",
              "Help me with my assignment",
              "Create a quiz for me",
              "Explain a difficult concept"
            ].map((s, i) => (
              <button
                key={i}
                className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent-cyan/30 hover:bg-accent-cyan/5 transition-all text-sm text-text-secondary hover:text-text-primary group"
              >
                {s}
              </button>
            ))}
          </Card>

          <Card className="p-6 glass border-white/5 flex-1 bg-grad-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-24 h-24" />
            </div>
            <h3 className="font-bold text-lg mb-2 relative z-10">Smart Learning</h3>
            <p className="text-sm text-text-secondary leading-relaxed relative z-10">
              The AI Tutor analyzes your performance across all courses to provide personalized explanations that match your current knowledge level.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
