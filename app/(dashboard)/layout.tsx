import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { AIChatBox } from '@/components/features/ai/AIChatBox';
import { LiveClassNotificationTrigger } from '@/components/features/LiveClassNotificationTrigger';

import { updateStreak } from '@/lib/db/queries/gamification';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Update streak in background (do not await for faster initial load)
  updateStreak(session.user.id).catch(console.error);



  return (
    <div className="flex min-h-screen bg-background-primary">
      <Sidebar
        userName={session.user.name || undefined}
        userEmail={session.user.email || undefined}
        role={session.user.role}
      />
      <main className="flex-1 md:ml-0">
        {children}
      </main>
      <AIChatBox />
      <LiveClassNotificationTrigger />
      <BottomNav />
    </div>
  );
}

