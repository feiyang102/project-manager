"use client";

import { Modal } from "./modal";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  danger?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "确认",
  danger = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-sm">
      <p className="text-sm text-muted">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-card-border px-4 py-2 text-sm transition-colors hover:bg-background"
        >
          取消
        </button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
            danger ? "bg-danger hover:bg-danger/90" : "bg-accent hover:bg-accent/90"
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
