
"use client";

import { useChat } from "ai/react";
import { useState } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";

export const AIChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/ai/chat",
    });

    // Using a portal or fixed positioning
    // For simplicity, fixed positioning on bottom right.

    return (
        <div className="fixed bottom-4 right-4 z-50 md:bottom-8 md:right-8">
            {/* Trigger Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-12 w-12 rounded-full shadow-lg bg-accent-primary hover:bg-accent-primary/90 text-white flex items-center justify-center transition-transform hover:scale-105"
                >
                    <Bot className="h-6 w-6" />
                </Button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-[350px] h-[500px] bg-background-elevated border border-white/10 rounded-lg shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-background-secondary rounded-t-lg">
                        <div className="flex items-center gap-x-2">
                            <Bot className="h-5 w-5 text-accent-cyan" />
                            <h3 className="font-semibold text-text-primary">AI Assistant</h3>
                        </div>
                        <Button
                            onClick={() => setIsOpen(false)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-text-secondary hover:text-text-primary"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                                <Bot className="h-10 w-10 text-accent-cyan/50" />
                                <p className="text-sm text-text-secondary">
                                    Hi! I'm your AI learning assistant. <br /> Ask me anything about your course!
                                </p>
                            </div>
                        )}
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={cn(
                                    "flex flex-col gap-1 text-sm max-w-[85%]",
                                    m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "p-3 rounded-lg break-words",
                                        m.role === "user"
                                            ? "bg-accent-primary text-white rounded-br-none"
                                            : "bg-background-secondary text-text-primary rounded-bl-none border border-white/5"
                                    )}
                                >
                                    {m.content}
                                </div>
                                <span className="text-[10px] text-text-muted capitalize opacity-70">
                                    {m.role === "user" ? "You" : "AI"}
                                </span>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="mr-auto flex items-center gap-1 text-xs text-text-secondary pl-2 bg-background-secondary p-2 rounded-lg rounded-bl-none border border-white/5">
                                <div className="w-1.5 h-1.5 bg-accent-cyan/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-accent-cyan/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-accent-cyan/50 rounded-full animate-bounce"></div>
                            </div>
                        )}
                    </div>

                    {/* Footer Input */}
                    <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-background-secondary rounded-b-lg">
                        <div className="relative flex items-center">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Ask a question..."
                                className="pr-10 h-11 bg-background-primary border-white/10 focus-visible:ring-accent-cyan"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading || !input.trim()}
                                className="absolute right-1 top-1 h-9 w-9 bg-accent-primary/20 hover:bg-accent-primary/40 text-accent-cyan"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-[10px] text-center text-text-muted mt-2">
                            AI can make mistakes. Verify important info.
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};
