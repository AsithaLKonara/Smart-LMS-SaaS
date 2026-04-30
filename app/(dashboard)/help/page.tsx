import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { getMyTickets } from '@/app/actions/support';
import { RefreshPageShell } from '@/components/dashboard/RefreshPageShell';
import { HelpCenterClient } from '@/components/features/support/HelpCenterClient';
import { Container } from '@/components/layout/Container';

export default async function HelpCenterPage() {
    const session = await auth();
    if (!session?.user) redirect('/login');

    const tickets = await getMyTickets();

    return (
        <div className="pb-20">
            <RefreshPageShell
                title="Help Center"
                subtitle="Support knowledge base, ticketing routes, and guided onboarding resources."
                stats={[
                    { label: 'My Tickets', value: tickets.length.toString() },
                    { label: 'Avg Resolution', value: '6.2h' },
                    { label: 'CSAT', value: '4.7/5' },
                    { label: 'SLA Status', value: 'Active' },
                ]}
            />
            <Container className="mt-8">
                <HelpCenterClient initialTickets={tickets} />
            </Container>
        </div>
    );
}
