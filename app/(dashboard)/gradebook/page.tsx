import { RefreshPageShell } from '@/components/dashboard/RefreshPageShell';

export default function GradebookPage() {
  return (
    <RefreshPageShell
      title="Gradebook"
      subtitle="Track grading performance, pending evaluations, and moderation activity."
      stats={[
        { label: 'Pending Reviews', value: '24' },
        { label: 'Avg Grade', value: '86%' },
        { label: 'Late Submissions', value: '7' },
        { label: 'Moderation Flags', value: '3' },
      ]}
      sections={[
        { title: 'Course Grade Matrix', description: 'Review learner progress across all assessments with weighted score calculations.' },
        { title: 'Moderation Queue', description: 'Resolve disputed grades and maintain grading consistency across instructors.' },
      ]}
    />
  );
}
