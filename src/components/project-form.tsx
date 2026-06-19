"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
        <div className="space-y-2">
          <Label>名称 *</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="输入项目名称"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>描述</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            placeholder="简要描述项目"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label>状态</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ProjectStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>类型</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as ProjectType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(TYPE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>优先级</Label>
            <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Priority })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>本地路径</Label>
          <Input
            value={form.localPath}
            onChange={(e) => setForm({ ...form, localPath: e.target.value })}
            className="font-mono"
            placeholder="/Users/you/projects/my-app"
          />
        </div>

        <div className="space-y-2">
          <Label>技术栈（逗号分隔）</Label>
          <Input
            value={form.techStack}
            onChange={(e) => setForm({ ...form, techStack: e.target.value })}
            placeholder="React, TypeScript, Tailwind"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>开始日期</Label>
            <Input
              type="date"
              value={form.startedAt}
              onChange={(e) => setForm({ ...form, startedAt: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>目标日期</Label>
            <Input
              type="date"
              value={form.targetAt}
              onChange={(e) => setForm({ ...form, targetAt: e.target.value })}
            />
          </div>
        </div>

        {tags.length > 0 && (
          <div className="space-y-2">
            <Label>标签</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    form.tagIds.includes(tag.id)
                      ? "text-white"
                      : "border border-border text-muted-foreground hover:bg-accent"
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
          <Button type="button" variant="outline" onClick={onClose}>取消</Button>
          <Button type="submit">{initial ? "保存" : "创建"}</Button>
        </div>
      </form>
    </Modal>
  );
}
