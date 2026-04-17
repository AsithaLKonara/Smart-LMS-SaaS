'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

const typeOptions = ['ALL', 'COURSE_UPDATE', 'LIVE_CLASS', 'EXAM_REMINDER', 'ASSIGNMENT_DUE', 'GRADE_RELEASED', 'ACHIEVEMENT', 'SYSTEM'] as const;

export function NotificationCenter() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<(typeof typeOptions)[number]>('ALL');
  const [unreadOnly, setUnreadOnly] = useState(false);

  async function load() {
    setLoading(true);
    const search = new URLSearchParams();
    if (type !== 'ALL') search.set('type', type);
    if (unreadOnly) search.set('unread', 'true');
    const res = await fetch(`/api/notifications?${search.toString()}`);
    const data = await res.json();
    setItems(data.data ?? []);
    setLoading(false);
  }

  async function markRead(ids?: string[]) {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ids ? { ids } : { markAll: true }),
    });
    await load();
  }

  useEffect(() => {
    load();
  }, [type, unreadOnly]);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  return (
    <Card variant="glass">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Notification Center</CardTitle>
          <p className="text-sm text-text-secondary mt-1">{unreadCount} unread notifications</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-text-primary"
            value={type}
            onChange={(e) => setType(e.target.value as (typeof typeOptions)[number])}
          >
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Button variant="secondary" size="sm" onClick={() => setUnreadOnly((v) => !v)}>
            {unreadOnly ? 'Show all' : 'Unread only'}
          </Button>
          <Button variant="premium" size="sm" onClick={() => markRead()}>
            Mark all read
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <p className="text-sm text-text-secondary">Loading notifications...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-text-secondary">No notifications found.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 ${item.read ? 'border-white/10 bg-white/5' : 'border-accent-cyan/40 bg-accent-cyan/10'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-secondary mt-1">{item.message}</p>
                  <p className="text-[11px] uppercase tracking-wide text-text-muted mt-2">{item.type}</p>
                </div>
                {!item.read && (
                  <Button variant="ghost" size="sm" onClick={() => markRead([item.id])}>
                    Mark read
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
