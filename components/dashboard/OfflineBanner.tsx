'use client';

import { useEffect, useState } from 'react';

export function OfflineBanner() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const sync = () => setOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, []);

  if (online) return null;

  return (
    <div
      role="status"
      className="shrink-0 border-b border-amber-500/40 bg-amber-500/15 px-4 py-2 text-center text-sm text-amber-50"
    >
      You are offline. Some actions may be unavailable until you reconnect.
    </div>
  );
}
