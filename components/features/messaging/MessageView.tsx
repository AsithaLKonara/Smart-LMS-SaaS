'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/cn';
import { Send, User, Paperclip } from 'lucide-react';

interface Message {
  id: string;
  body: string;
  senderId: string;
  createdAt: Date | string;
  sender: {
    name: string;
    avatar: string | null;
  };
}

interface MessageViewProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  threadTitle: string;
}

export function MessageView({ messages, currentUserId, onSendMessage, isLoading, threadTitle }: MessageViewProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card variant="glass" className="h-[600px] flex flex-col overflow-hidden border-white/5">
      <CardHeader className="border-b border-white/5 bg-white/5 py-4">
        <CardTitle className="text-lg flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center border border-accent-purple/30">
            <User className="w-4 h-4 text-accent-purple" />
          </div>
          {threadTitle}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-text-secondary text-sm">
            No messages yet. Send a greeting!
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={cn(
                  'flex flex-col max-w-[80%]',
                  isMe ? 'ml-auto items-end' : 'mr-auto items-start'
                )}
              >
                <div
                  className={cn(
                    'px-4 py-2 rounded-2xl text-sm shadow-lg',
                    isMe 
                      ? 'bg-accent-purple text-white rounded-tr-none' 
                      : 'bg-white/10 text-text-primary rounded-tl-none border border-white/10'
                  )}
                >
                  {message.body}
                </div>
                <span className="text-[10px] text-text-secondary mt-1 px-1">
                  {isMe ? 'You' : message.sender.name} • {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
      </CardContent>

      <div className="p-4 bg-white/5 border-t border-white/5">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full bg-white/5 border-white/10 shrink-0">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border-white/10 rounded-full px-4"
          />
          <Button 
            onClick={handleSend}
            className="rounded-full bg-accent-purple hover:bg-accent-purple/80 shrink-0"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
