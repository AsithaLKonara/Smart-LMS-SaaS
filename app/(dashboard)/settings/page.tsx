import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { RefreshPageShell } from '@/components/dashboard/RefreshPageShell';
import { BrandingSettings } from '@/components/features/settings/BrandingSettings';
import { Container } from '@/components/layout/Container';

export default async function OrgSettingsPage() {
    const session = await auth();
    if (!session?.user) redirect('/login');

    const tenant = await prisma.tenant.findUnique({
        where: { id: session.user.tenantId }
    });

    if (!tenant) return null;

    return (
        <div className="pb-20">
            <RefreshPageShell
                title="Organization Settings"
                subtitle="Configure branding, domains, and tenant-level behavior controls."
                stats={[
                    { label: 'Brand Profile', value: 'Active' },
                    { label: 'Plan', value: tenant.plan },
                    { label: 'Status', value: tenant.status },
                    { label: 'Joined', value: new Date(tenant.createdAt).getFullYear().toString() },
                ]}
            />
            <Container className="mt-8">
                <BrandingSettings 
                    initialData={{
                        name: tenant.name,
                        logo: tenant.logo || '',
                        accentColor: tenant.accentColor || '#22D3EE'
                    }} 
                />
            </Container>
        </div>
    );
}
