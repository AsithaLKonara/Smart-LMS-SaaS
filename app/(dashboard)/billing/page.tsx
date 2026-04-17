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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-text-primary">Billing & Metering</h1>
        <p className="text-text-secondary mt-2">Monitor plan usage, invoices, and billing profile for your organization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card variant="glass">
          <CardHeader><CardTitle>Current Plan</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-text-primary">{billing.profile?.currentPlan ?? 'FREE'}</p>
            <p className="text-sm text-text-secondary mt-2">Seat limit: {billing.profile?.seatLimit ?? 10}</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardHeader><CardTitle>Invoices</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-text-primary">{billing.invoices.length}</p>
            <p className="text-sm text-text-secondary mt-2">Last 12 billing records</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardHeader><CardTitle>Usage Metrics</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-text-primary">{billing.usage.length}</p>
            <p className="text-sm text-text-secondary mt-2">Tracked usage datapoints</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
