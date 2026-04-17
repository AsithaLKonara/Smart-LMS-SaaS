import { RefreshPageShell } from '@/components/dashboard/RefreshPageShell';

export default function AnalyticsPage() {
  return (
    <RefreshPageShell
      title="Analytics"
      subtitle="Measure engagement, retention, and revenue trends across tenants and cohorts."
      stats={[
        { label: 'DAU', value: '3,942' },
        { label: 'Course Completion', value: '68%' },
        { label: 'MRR', value: '$24.8k' },
        { label: 'Churn', value: '2.3%' },
      ]}
      sections={[
        { title: 'Engagement Trends', description: 'Visualize learner activity and identify drop-off points by course and cohort.' },
        { title: 'Revenue Insights', description: 'Compare plan performance, invoice trends, and conversion outcomes.' },
      ]}
    />
  );
}
