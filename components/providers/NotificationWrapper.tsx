
"use client";

import { useLiveClassNotifications } from "@/hooks/useLiveClassNotifications";

export function NotificationWrapper({ children }: { children: React.ReactNode }) {
    useLiveClassNotifications();
    return <>{children}</>;
}
