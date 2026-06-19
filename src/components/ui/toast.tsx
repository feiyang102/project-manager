"use client";

import { toast } from "sonner";

export type ToastType = "success" | "error" | "info";

export function showToast(message: string, type: ToastType = "success") {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    default:
      toast(message);
  }
}
