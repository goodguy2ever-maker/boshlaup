'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let sid = sessionStorage.getItem('boshlaup_sid');
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      sessionStorage.setItem('boshlaup_sid', sid);
    }
    return sid;
  } catch (e) {
    return 'sid_fallback_' + Math.random().toString(36).substring(2, 10);
  }
}

export default function SiteAnalyticsTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string>('');

  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    if (!sessionId) return;

    const sendPing = (path: string) => {
      try {
        fetch('/api/analytics/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path,
            sessionId,
          }),
          keepalive: true,
        }).catch(() => {});
      } catch (e) {}
    };

    // Send ping on pathname change
    if (pathname && pathname !== lastPathRef.current) {
      lastPathRef.current = pathname;
      sendPing(pathname);
    }

    // Heartbeat every 45s while tab is visible to track real-time active users
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        sendPing(pathname || '/');
      }
    }, 45_000);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
