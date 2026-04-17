import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { AIChatBox } from '@/components/features/ai/AIChatBox';
import { LiveClassNotificationTrigger } from '@/components/features/LiveClassNotificationTrigger';
import { getTenantById } from '@/lib/db/queries/tenants';

import { updateStreak } from '@/lib/db/queries/gamification';
import { OnboardingTrigger } from '@/components/features/onboarding/OnboardingTrigger';
import { OfflineBanner } from '@/components/dashboard/OfflineBanner';

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

  const tenant = await getTenantById(session.user.tenantId);

  return (
    <div className="flex min-h-screen bg-background-primary overflow-hidden">
      <Sidebar
        userName={session.user.name || undefined}
        userEmail={session.user.email || undefined}
        role={session.user.role}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <OfflineBanner />
        <Topbar
          currentOrg={{
            id: tenant?.id || session.user.tenantId,
            name: tenant?.name || 'Smart LMS',
            subdomain: tenant?.subdomain || 'org',
            logo: tenant?.logo,
            role: session.user.role.toLowerCase().replace('_', ' ')
          }}
        />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
      <AIChatBox />
      <LiveClassNotificationTrigger />
      <OnboardingTrigger
        tenantId={session.user.tenantId}
        show={!tenant?.onboardingCompleted && (session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN')}
      />
      <BottomNav />
    </div>
  );
}

