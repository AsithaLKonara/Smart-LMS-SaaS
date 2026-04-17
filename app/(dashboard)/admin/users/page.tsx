import { RefreshPageShell } from '@/components/dashboard/RefreshPageShell';

export default function UsersPage() {
  return (
    <RefreshPageShell
      title="Users & People"
      subtitle="Manage organization members, invitations, and role assignments."
      stats={[
        { label: 'Total Users', value: '1,204' },
        { label: 'Pending Invites', value: '18' },
        { label: 'Active Instructors', value: '37' },
        { label: 'Suspended', value: '4' },
      ]}
      sections={[
        { title: 'Directory', description: 'Unified searchable directory for all members with role and status filters.' },
        { title: 'Role Management', description: 'Grant or revoke admin, instructor, and support capabilities with audit visibility.' },
      ]}
    />
  );
}
