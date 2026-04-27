'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User, Users } from 'lucide-react';

interface Thread {
  id: string;
  title: string | null;
  scope: 'DIRECT' | 'COURSE';
  updatedAt: Date | string;
  lastMessage?: string;
  members: {
    user: {
      id: string;
      name: string;
      avatar: string | null;
    };
  }[];
}

interface ThreadListProps {
  threads: Thread[];
  activeThreadId?: string;
  onSelectThread: (threadId: string) => void;
  className?: string;
}

export function ThreadList({ threads, activeThreadId, onSelectThread, className }: ThreadListProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {threads.length === 0 ? (
        <div className="text-center py-12 px-4">
          <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-text-secondary text-sm">No conversations yet.</p>
        </div>
      ) : (
        threads.map((thread) => {
          const isActive = activeThreadId === thread.id;
          const displayTitle = thread.title || (thread.scope === 'DIRECT' 
            ? thread.members[0]?.user.name 
            : 'Course Channel');

          return (
            <Card
              key={thread.id}
              variant={isActive ? 'glass-dark' : 'glass'}
              interactive
              onClick={() => onSelectThread(thread.id)}
              className={cn(
                'p-4 transition-all duration-300',
                isActive && 'border-accent-purple/50 bg-accent-purple/5'
              )}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  {thread.scope === 'COURSE' ? (
                    <Users className="w-5 h-5 text-accent-cyan" />
                  ) : (
                    <User className="w-5 h-5 text-accent-purple" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-semibold text-text-primary truncate">
                      {displayTitle}
                    </h4>
                    <span className="text-[10px] text-text-secondary whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(thread.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary truncate">
                    {thread.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
