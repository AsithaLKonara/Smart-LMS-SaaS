import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { RefreshPageShell } from '@/components/dashboard/RefreshPageShell';
import { BrandingSettings } from '@/components/features/settings/BrandingSettings';
import { MarketplaceSettings } from '@/components/features/settings/MarketplaceSettings';
import { Container } from '@/components/layout/Container';

import { can, AuthUser } from '@/lib/auth/guard';
import { PERMISSIONS } from '@/constants/permissions';

export default async function OrgSettingsPage() {
    const session = await auth();
    if (!session?.user) redirect('/login');

    const user = session.user as AuthUser;
    if (!can(user, PERMISSIONS.TENANT_MANAGE)) {
        return redirect('/dashboard');
    }

    const tenant = await prisma.tenant.findUnique({
        where: { id: session.user.tenantId }
    });

    if (!tenant) return null;

    return (
        <div className="pb-20 space-y-12">
            <RefreshPageShell
                title="Organization Settings"
                subtitle="Configure branding, domains, and tenant-level behavior controls."
                stats={[
                    { label: 'Brand Profile', value: 'Active' },
                    { label: 'Plan', value: tenant.plan },
                    { label: 'Marketplace', value: tenant.isPartner ? 'Listed' : 'Hidden' },
                    { label: 'Joined', value: new Date(tenant.createdAt).getFullYear().toString() },
                ]}
            />
            <Container className="mt-8 space-y-12">
                <BrandingSettings 
                    initialData={{
                        name: tenant.name,
                        logo: tenant.logo || '',
                        accentColor: tenant.accentColor || '#22D3EE'
                    }} 
                />

                <MarketplaceSettings 
                    initialData={{
                        isPartner: tenant.isPartner,
                        publicDescription: tenant.publicDescription || '',
                        tagline: tenant.tagline || '',
                        websiteUrl: tenant.websiteUrl || ''
                    }}
                />
            </Container>
        </div>
    );
}
