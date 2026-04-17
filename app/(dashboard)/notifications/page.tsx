import { NotificationCenter } from '@/components/features/notifications/NotificationCenter';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-text-primary">Notifications</h1>
        <p className="text-text-secondary mt-2">Filter updates and mark individual or all notifications as read.</p>
      </div>
      <NotificationCenter />
    </div>
  );
}
