import { RefreshPageShell } from '@/components/dashboard/RefreshPageShell';

export default function CalendarPage() {
  return (
    <RefreshPageShell
      title="Calendar"
      subtitle="Coordinate live classes, deadlines, and instructional availability."
      stats={[
        { label: 'Events This Week', value: '34' },
        { label: 'Live Sessions', value: '12' },
        { label: 'Due Deadlines', value: '21' },
        { label: 'Conflicts', value: '2' },
      ]}
      sections={[
        { title: 'Teaching Schedule', description: 'View month/week/day sessions and identify instructor load imbalance.' },
        { title: 'Learner Deadlines', description: 'Track upcoming assignment and exam windows with timezone-aware slots.' },
      ]}
    />
  );
}
