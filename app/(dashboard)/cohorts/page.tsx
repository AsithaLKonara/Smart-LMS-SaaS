import { RefreshPageShell } from '@/components/dashboard/RefreshPageShell';

export default function CohortsPage() {
  return (
    <RefreshPageShell
      title="Cohorts"
      subtitle="Group learners by timeline, goals, and capacity for structured delivery."
      stats={[
        { label: 'Active Cohorts', value: '12' },
        { label: 'Avg Completion', value: '72%' },
        { label: 'Seats Filled', value: '438' },
        { label: 'Upcoming Starts', value: '5' },
      ]}
      sections={[
        { title: 'Cohort Scheduling', description: 'Coordinate start/end dates, instructor assignment, and enrollment caps.' },
        { title: 'Capacity Management', description: 'Monitor seat usage and rebalance cohorts before launch windows.' },
      ]}
    />
  );
}
