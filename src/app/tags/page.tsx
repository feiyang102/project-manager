"use client";

import { useState } from "react";
import { Plus, Tag as TagIcon, Pencil, Trash2 } from "lucide-react";
import { useTags, useTagUsageCount, useToast } from "@/lib/use-store";
import { createTag, updateTag, deleteTag } from "@/lib/store";
import { EmptyState } from "@/components/ui/empty-state";
import { TagForm } from "@/components/tag-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Tag } from "@/lib/types";

export default function TagsPage() {
  const tags = useTags();
  const { show } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleCreate = (data: { name: string; color: string }) => {
    createTag(data);
    show("标签已创建");
  };

  const handleUpdate = (data: { name: string; color: string }) => {
    if (editingTag) {
      updateTag(editingTag.id, data);
      show("标签已更新");
    }
  };

  const handleDelete = (tag: Tag) => {
    if (confirm(`确定删除标签「${tag.name}」？关联的项目和文件不会被删除，只会移除标签关系。`)) {
      deleteTag(tag.id);
      show("标签已删除");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">标签管理</h1>
          <p className="mt-1 text-sm text-muted-foreground">跨项目和文件收藏建立灵活分类（{tags.length}）</p>
        </div>
        <Button onClick={() => { setEditingTag(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" />
          新建标签
        </Button>
      </div>

      {/* Tags Grid */}
      {tags.length === 0 ? (
        <EmptyState
          icon={TagIcon}
          title="暂无标签"
          description="点击「新建标签」创建第一个标签，为项目和文件分类"
          action={
            <Button onClick={() => { setEditingTag(null); setFormOpen(true); }}>
              新建标签
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag) => (
            <TagCard
              key={tag.id}
              tag={tag}
              onEdit={() => { setEditingTag(tag); setFormOpen(true); }}
              onDelete={() => handleDelete(tag)}
            />
          ))}
        </div>
      )}

      <TagForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingTag(null); }}
        onSubmit={editingTag ? handleUpdate : handleCreate}
        initial={editingTag}
      />
    </div>
  );
}

function TagCard({ tag, onEdit, onDelete }: { tag: Tag; onEdit: () => void; onDelete: () => void }) {
  const usageCount = useTagUsageCount(tag.id);

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: tag.color + "22" }}
          >
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
          </span>
          <div>
            <span className="text-sm font-medium">{tag.name}</span>
            <p className="text-xs text-muted-foreground">{usageCount} 个关联项</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
