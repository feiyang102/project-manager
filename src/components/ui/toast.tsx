"use client";

import type { ToastMsg } from "@/lib/use-store";

export function Toast({ toast }: { toast: ToastMsg | null }) {
  if (!toast) return null;

  const colors = {
    success: "bg-success text-white",
    error: "bg-danger text-white",
    info: "bg-accent text-white",
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-2">
      <div className={`rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg ${colors[toast.type]}`}>
        {toast.message}
      </div>
    </div>
  );
}
