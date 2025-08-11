"use client";

import { useEffect, useState } from "react";

export type Toast = { id: number; message: string; variant?: "success" | "danger" | "info" };

export default function ToastArea() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (evt: Event) => {
      const e = evt as CustomEvent<Toast>;
      if (!e?.detail) return;
      setToasts((prev) => [...prev, e.detail]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== e.detail!.id));
      }, 2500);
    };
    window.addEventListener("app:toast", handler as EventListener);
    return () => window.removeEventListener("app:toast", handler as EventListener);
  }, []);

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast show align-items-center text-bg-${t.variant ?? "success"} border-0 mb-2`}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-2">
                {t.variant === "success" && <i className="bi bi-check-circle" />}
                {t.variant === "danger" && <i className="bi bi-exclamation-triangle" />}
                {(!t.variant || t.variant === "info") && <i className="bi bi-info-circle" />}
                <span>{t.message}</span>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                aria-label="Close"
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function pushToast(message: string, variant?: Toast["variant"]) {
  const id = Date.now() + Math.random();
  const event = new CustomEvent("app:toast", { detail: { id, message, variant } });
  // ensure dispatch after mount tick
  if (typeof window !== "undefined") {
    setTimeout(() => window.dispatchEvent(event), 0);
  }
}


