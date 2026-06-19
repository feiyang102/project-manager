"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import type { Tag } from "@/lib/types";

const PRESET_COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#6366f1", "#14b8a6",
  "#64748b", "#84cc16",
];

interface TagFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; color: string }) => void;
  initial?: Tag | null;
}

export function TagForm({ open, onClose, onSubmit, initial }: TagFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setColor(initial.color);
    } else {
      setName("");
      setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    }
  }, [initial, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), color });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? "编辑标签" : "新建标签"} width="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted">名称</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            placeholder="输入标签名称"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted">颜色</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-7 w-7 rounded-full transition-transform ${color === c ? "scale-125 ring-2 ring-offset-2 ring-blue-400" : "hover:scale-110"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-7 w-7 cursor-pointer rounded border-0"
            />
            <span className="font-mono text-xs text-muted">{color}</span>
          </div>
        </div>

        {/* Preview */}
        {name && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">预览：</span>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ backgroundColor: color + "22", color }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
              {name}
            </span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-card-border px-4 py-2 text-sm transition-colors hover:bg-background"
          >
            取消
          </button>
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/90"
          >
            {initial ? "保存" : "创建"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
