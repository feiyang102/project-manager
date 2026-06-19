"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { useTags, useProjects } from "@/lib/use-store";
import type { FileItem, FileItemKind } from "@/lib/types";
import { KIND_LABELS } from "@/lib/types";

interface FileFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<FileItem, "id" | "createdAt" | "updatedAt">) => void;
  initial?: FileItem | null;
}

const defaultForm = {
  name: "",
  kind: "folder" as FileItemKind,
  path: "",
  description: "",
  projectId: "",
  tagIds: [] as string[],
  exists: true,
  archived: false,
};

export function FileForm({ open, onClose, onSubmit, initial }: FileFormProps) {
  const tags = useTags();
  const projects = useProjects();
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        kind: initial.kind,
        path: initial.path,
        description: initial.description || "",
        projectId: initial.projectId || "",
        tagIds: initial.tagIds,
        exists: initial.exists,
        archived: initial.archived,
      });
    } else {
      setForm(defaultForm);
    }
  }, [initial, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.path.trim()) return;
    onSubmit({
      name: form.name.trim(),
      kind: form.kind,
      path: form.path.trim(),
      description: form.description.trim() || undefined,
      projectId: form.projectId || undefined,
      tagIds: form.tagIds,
      exists: form.exists,
      archived: form.archived,
    });
    onClose();
  };

  const toggleTag = (tagId: string) => {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? "编辑收藏" : "添加收藏"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted">名称 *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            placeholder="例如：项目文档"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted">路径 *</label>
          <input
            value={form.path}
            onChange={(e) => setForm({ ...form, path: e.target.value })}
            className="mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 font-mono text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            placeholder="/Users/you/Documents/project"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-muted">类型</label>
            <select
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value as FileItemKind })}
              className="mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
            >
              {Object.entries(KIND_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted">所属项目</label>
            <select
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              className="mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
            >
              <option value="">无</option>
              {projects.filter((p) => p.status !== "archived").map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted">描述</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            rows={2}
            placeholder="简要描述"
          />
        </div>

        {tags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-muted">标签</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    form.tagIds.includes(tag.id)
                      ? "text-white"
                      : "border border-card-border text-muted hover:bg-background"
                  }`}
                  style={
                    form.tagIds.includes(tag.id)
                      ? { backgroundColor: tag.color }
                      : undefined
                  }
                >
                  {tag.name}
                </button>
              ))}
            </div>
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
            {initial ? "保存" : "添加"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
