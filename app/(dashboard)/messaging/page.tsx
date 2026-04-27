import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { getThreadsForUser } from '@/lib/db/queries/messaging';
import { MessagingClient } from '@/components/features/messaging/MessagingClient';

export default async function MessagingPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const threads = await getThreadsForUser(session.user.tenantId, session.user.id);

  // Map threads to include last message for the UI
  const mappedThreads = threads.map((t) => ({
    ...t,
    lastMessage: t.messages[0]?.body || 'No messages yet',
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary">Messaging Center</h1>
          <p className="text-text-secondary mt-2">Connect with instructors and peers in real-time.</p>
        </div>
      </div>

      <MessagingClient 
        initialThreads={mappedThreads} 
        currentUserId={session.user.id} 
        tenantId={session.user.tenantId} 
      />
    </div>
  );
}
