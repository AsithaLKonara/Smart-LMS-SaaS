import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { getThreadsForUser } from '@/lib/db/queries/messaging';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default async function MessagingPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const threads = await getThreadsForUser(session.user.tenantId, session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-text-primary">Messaging Center</h1>
        <p className="text-text-secondary mt-2">Direct and course conversations in one inbox.</p>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Threads</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {threads.length === 0 ? (
            <p className="text-sm text-text-secondary">No threads yet. Start a new conversation from your course pages.</p>
          ) : (
            threads.map((thread) => (
              <div key={thread.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-text-primary">
                  {thread.title ?? `${thread.scope === 'COURSE' ? 'Course' : 'Direct'} Thread`}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {thread.messages[0]?.body ?? 'No messages yet'}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
