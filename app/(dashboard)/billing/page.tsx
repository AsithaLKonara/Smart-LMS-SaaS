import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { getBillingSnapshot } from '@/lib/db/queries/billing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
    redirect('/dashboard');
  }

  const billing = await getBillingSnapshot(session.user.tenantId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold text-text-primary tracking-tight">Billing & Metering</h1>
          <p className="text-text-secondary mt-2 max-w-xl">Monitor plan usage, invoices, and billing profile for your organization.</p>
        </div>
        <div className="h-1 w-24 bg-gradient-to-r from-accent-purple to-accent-cyan rounded-full hidden md:block mb-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass" className="border-white/5 shadow-lg shadow-black/20 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-muted">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-text-primary group-hover:text-accent-purple transition-colors">
              {billing.profile?.currentPlan ?? 'FREE'}
            </p>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-sm text-text-secondary">Seat limit: <span className="text-text-primary font-semibold">{billing.profile?.seatLimit ?? 10}</span></p>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" className="border-white/5 shadow-lg shadow-black/20 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-muted">Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-text-primary group-hover:text-accent-cyan transition-colors">
              {billing.invoices.length}
            </p>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-sm text-text-secondary">Records found in last <span className="text-text-primary font-semibold">12</span> months</p>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" className="border-white/5 shadow-lg shadow-black/20 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-muted">Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-text-primary group-hover:text-accent-purple transition-colors">
              {billing.usage.length}
            </p>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-sm text-text-secondary">Tracked <span className="text-text-primary font-semibold">real-time</span> usage datapoints</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card variant="glass-dark" className="border-white/5">
        <CardHeader>
          <CardTitle className="text-xl">Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/5">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <div>
              <p className="text-sm font-semibold text-text-primary">System is Operational</p>
              <p className="text-xs text-text-secondary">Your organization has full access to all platform features.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
