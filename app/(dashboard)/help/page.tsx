import { RefreshPageShell } from '@/components/dashboard/RefreshPageShell';

export default function HelpCenterPage() {
  return (
    <RefreshPageShell
      title="Help Center"
      subtitle="Support knowledge base, ticketing routes, and guided onboarding resources."
      stats={[
        { label: 'Knowledge Articles', value: '86' },
        { label: 'Open Tickets', value: '14' },
        { label: 'Avg Resolution', value: '6.2h' },
        { label: 'CSAT', value: '4.7/5' },
      ]}
      sections={[
        { title: 'Knowledge Base', description: 'Browse operational guides and user tutorials by product area and role.' },
        { title: 'Support Operations', description: 'Track ticket queues, escalation status, and SLA response windows.' },
      ]}
    />
  );
}
