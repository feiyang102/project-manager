"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
        <div className="space-y-2">
          <Label>名称 *</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="例如：项目文档"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>路径 *</Label>
          <Input
            value={form.path}
            onChange={(e) => setForm({ ...form, path: e.target.value })}
            className="font-mono"
            placeholder="/Users/you/Documents/project"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>类型</Label>
            <Select value={form.kind} onValueChange={(v) => setForm({ ...form, kind: v as FileItemKind })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(KIND_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>所属项目</Label>
            <Select value={form.projectId || "__none__"} onValueChange={(v) => setForm({ ...form, projectId: v === "__none__" ? "" : v })}>
              <SelectTrigger><SelectValue placeholder="无" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">无</SelectItem>
                {projects.filter((p) => p.status !== "archived").map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>描述</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            placeholder="简要描述"
          />
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
          <Button type="submit">{initial ? "保存" : "添加"}</Button>
        </div>
      </form>
    </Modal>
  );
}
