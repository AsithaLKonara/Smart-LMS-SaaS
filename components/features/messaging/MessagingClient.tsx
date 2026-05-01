'use client';

import React, { useState, useEffect } from 'react';
import { ThreadList } from './ThreadList';
import { MessageView } from './MessageView';
import { toast } from 'sonner';

interface Thread {
  id: string;
  title: string | null;
  scope: 'DIRECT' | 'COURSE';
  updatedAt: string | Date;
  lastMessage: string;
  members: Array<{ user: { id: string; name: string; avatar: string | null } }>;
}

interface Message {
  id: string;
  body: string;
  senderId: string;
  createdAt: string | Date;
  sender: { name: string; avatar: string | null };
}

interface MessagingClientProps {
  initialThreads: Thread[];
  currentUserId: string;
  tenantId: string;
}

export function MessagingClient({ initialThreads, currentUserId, tenantId }: MessagingClientProps) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(
    initialThreads.length > 0 ? initialThreads[0].id : null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  useEffect(() => {
    if (activeThreadId) {
      fetchMessages(activeThreadId);

      // Subscribe to real-time updates
      const subscribe = async () => {
        const { pusherClient } = await import('@/lib/pusher');
        const channel = pusherClient.subscribe(`thread-${activeThreadId}`);

        channel.bind('new-message', (data: Message) => {
          // If message is from others, add to state
          if (data.senderId !== currentUserId) {
            setMessages((prev) => {
                // Check if message already exists (to avoid duplicates from optimistic updates if any)
                if (prev.find(m => m.id === data.id)) return prev;
                return [...prev, data];
            });
            
            // Also update thread list last message
            setThreads((prev) => 
                prev.map((t) => 
                  t.id === activeThreadId ? { ...t, lastMessage: data.body, updatedAt: new Date() } : t
                ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              );
          }
        });

        return () => {
          pusherClient.unsubscribe(`thread-${activeThreadId}`);
        };
      };

      const cleanupPromise = subscribe();
      return () => {
        cleanupPromise.then(cleanup => cleanup && cleanup());
      };
    }
  }, [activeThreadId, currentUserId]);

  const fetchMessages = async (threadId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/messaging/threads/${threadId}/messages`);
      const json = await res.json();
      if (json.success && json.data.messages) {
        setMessages(json.data.messages);
      }
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeThreadId) return;

    try {
      const res = await fetch(`/api/messaging/threads/${activeThreadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: content }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setMessages((prev) => [...prev, json.data]);
        // Update threads list with last message
        setThreads((prev) => 
          prev.map((t) => 
            t.id === activeThreadId ? { ...t, lastMessage: content, updatedAt: new Date() } : t
          ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        );
      }
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
      <div className="lg:col-span-4 overflow-y-auto pr-2 custom-scrollbar">
        <ThreadList
          threads={threads}
          activeThreadId={activeThreadId || undefined}
          onSelectThread={setActiveThreadId}
        />
      </div>
      <div className="lg:col-span-8 h-full">
        {activeThread ? (
          <MessageView
            messages={messages}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            threadTitle={activeThread.title || (activeThread.scope === 'DIRECT' ? activeThread.members[0]?.user.name : 'Course Channel')}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-text-secondary">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
