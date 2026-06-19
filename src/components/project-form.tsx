"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { useTags } from "@/lib/use-store";
import type { Project, ProjectStatus, ProjectType, Priority } from "@/lib/types";
import { STATUS_LABELS, TYPE_LABELS, PRIORITY_LABELS } from "@/lib/types";

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  initial?: Project | null;
}

const defaultForm = {
  name: "",
  description: "",
  status: "idea" as ProjectStatus,
  type: "code" as ProjectType,
  localPath: "",
  techStack: "",
  priority: "medium" as Priority,
  tagIds: [] as string[],
  startedAt: "",
  targetAt: "",
};

export function ProjectForm({ open, onClose, onSubmit, initial }: ProjectFormProps) {
  const tags = useTags();
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        description: initial.description || "",
        status: initial.status,
        type: initial.type,
        localPath: initial.localPath || "",
        techStack: initial.techStack?.join(", ") || "",
        priority: initial.priority || "medium",
        tagIds: initial.tagIds,
        startedAt: initial.startedAt?.slice(0, 10) || "",
        targetAt: initial.targetAt?.slice(0, 10) || "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [initial, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      status: form.status,
      type: form.type,
      localPath: form.localPath.trim() || undefined,
      techStack: form.techStack ? form.techStack.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      priority: form.priority,
      tagIds: form.tagIds,
      startedAt: form.startedAt ? new Date(form.startedAt).toISOString() : undefined,
      targetAt: form.targetAt ? new Date(form.targetAt).toISOString() : undefined,
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
    <Modal open={open} onClose={onClose} title={initial ? "编辑项目" : "新建项目"} width="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted">名称 *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            placeholder="输入项目名称"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted">描述</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            rows={2}
            placeholder="简要描述项目"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-muted">状态</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
              className="mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
            >
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted">类型</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ProjectType })}
              className="mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
            >
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted">优先级</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
              className="mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
            >
              {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted">本地路径</label>
          <input
            value={form.localPath}
            onChange={(e) => setForm({ ...form, localPath: e.target.value })}
            className="mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 font-mono text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            placeholder="/Users/you/projects/my-app"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted">技术栈（逗号分隔）</label>
          <input
            value={form.techStack}
            onChange={(e) => setForm({ ...form, techStack: e.target.value })}
            className="mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            placeholder="React, TypeScript, Tailwind"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-muted">开始日期</label>
            <input
              type="date"
              value={form.startedAt}
              onChange={(e) => setForm({ ...form, startedAt: e.target.value })}
              className="mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted">目标日期</label>
            <input
              type="date"
              value={form.targetAt}
              onChange={(e) => setForm({ ...form, targetAt: e.target.value })}
              className="mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
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
            {initial ? "保存" : "创建"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
