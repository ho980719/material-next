"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GlobalLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const activeRequestsRef = useRef(0);
  const trickleTimerRef = useRef<number | null>(null);
  const visibleRef = useRef(false);

  const start = useCallback(() => {
    if (!visibleRef.current) {
      visibleRef.current = true;
      setVisible(true);
      setProgress(0.1);
    }
    if (trickleTimerRef.current == null) {
      trickleTimerRef.current = window.setInterval(() => {
        setProgress((p) => (p < 0.9 ? p + Math.max(0.02, (0.98 - p) * 0.02) : p));
      }, 200);
    }
  }, []);

  const stop = useCallback(() => {
    setProgress(1);
    if (trickleTimerRef.current != null) {
      clearInterval(trickleTimerRef.current);
      trickleTimerRef.current = null;
    }
    window.setTimeout(() => {
      visibleRef.current = false;
      setVisible(false);
      setProgress(0);
    }, 250);
  }, []);

  // Patch global fetch to track API calls
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      activeRequestsRef.current += 1;
      start();
      try {
        return await originalFetch(...args);
      } finally {
        activeRequestsRef.current -= 1;
        if (activeRequestsRef.current <= 0) {
          activeRequestsRef.current = 0;
          stop();
        }
      }
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, [start, stop]);

  // Route changes: start/stop around path/search changes (avoid unstable deps)
  useEffect(() => {
    start();
    const t = window.setTimeout(stop, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()]);

  if (!visible) return null;
  return (
    <div className="top-progress" aria-hidden>
      <div className="top-progress__bar" style={{ width: `${Math.round(progress * 100)}%` }} />
    </div>
  );
}


