"use client";

import { useState, useMemo } from "react";
import { Plus, Search, FolderOpen, Pencil, Trash2, Archive, Copy, Check, AlertTriangle, File, Folder, GitBranch, FileText, Image, Film, Music, ArchiveIcon, HelpCircle, MoreVertical } from "lucide-react";
import { useFileItems, useTags, useToast } from "@/lib/use-store";
import { createFileItem, updateFileItem, deleteFileItem, archiveFileItem } from "@/lib/store";
import { TagBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { FileForm } from "@/components/file-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { openFolder } from "@/lib/open-folder";
import type { FileItem, FileItemKind } from "@/lib/types";
import { KIND_LABELS } from "@/lib/types";

const KIND_ICONS: Record<FileItemKind, typeof File> = {
  file: File,
  folder: Folder,
  repo: GitBranch,
  document: FileText,
  image: Image,
  video: Film,
  audio: Music,
  archive: ArchiveIcon,
  other: HelpCircle,
};

export default function FilesPage() {
  const files = useFileItems();
  const tags = useTags();
  const { show } = useToast();

  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeFiles = files.filter((f) => !f.archived);

  const filtered = useMemo(() => {
    let list = activeFiles;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description?.toLowerCase().includes(q) ||
          f.path.toLowerCase().includes(q)
      );
    }
    if (kindFilter && kindFilter !== "__all__") list = list.filter((f) => f.kind === kindFilter);
    return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [activeFiles, search, kindFilter]);

  const handleCreate = (data: Omit<FileItem, "id" | "createdAt" | "updatedAt">) => {
    createFileItem(data);
    show("收藏已添加");
  };

  const handleUpdate = (data: Omit<FileItem, "id" | "createdAt" | "updatedAt">) => {
    if (editingFile) {
      updateFileItem(editingFile.id, data);
      show("收藏已更新");
    }
  };

  const handleCopyPath = async (file: FileItem) => {
    try {
      await navigator.clipboard.writeText(file.path);
      setCopiedId(file.id);
      show("路径已复制");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      show("复制失败", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">文件收藏</h1>
          <p className="mt-1 text-sm text-muted-foreground">管理收藏的本地文件与文件夹（{activeFiles.length}）</p>
        </div>
        <Button onClick={() => { setEditingFile(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" />
          添加收藏
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索收藏..."
            className="pl-10"
          />
        </div>
        <Select value={kindFilter} onValueChange={setKindFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="全部类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">全部类型</SelectItem>
            {Object.entries(KIND_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={search || kindFilter ? "没有匹配的收藏" : "暂无收藏"}
          description={search || kindFilter ? "尝试调整搜索或筛选条件" : "点击「添加收藏」收藏你的第一个本地文件或文件夹"}
          action={
            !search && !kindFilter ? (
              <Button onClick={() => { setEditingFile(null); setFormOpen(true); }}>
                添加收藏
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((file) => {
            const Icon = KIND_ICONS[file.kind];
            const fileTags = tags.filter((t) => file.tagIds.includes(t.id));
            return (
              <Card key={file.id} className="transition-colors hover:border-primary/30">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
                        {KIND_LABELS[file.kind]}
                      </span>
                      {!file.exists && (
                        <span className="flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-xs text-destructive">
                          <AlertTriangle className="h-3 w-3" /> 路径失效
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 flex items-center gap-3">
                      <span className="truncate font-mono text-xs text-muted-foreground/70">{file.path}</span>
                      {fileTags.length > 0 && (
                        <div className="flex gap-1">
                          {fileTags.slice(0, 3).map((tag) => (
                            <TagBadge key={tag.id} name={tag.name} color={tag.color} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-3 flex shrink-0 items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openFolder(file.path)} title="打开">
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyPath(file)} title="复制路径">
                      {copiedId === file.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setEditingFile(file); setFormOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" /> 编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { archiveFileItem(file.id); show("已归档"); }}>
                          <Archive className="h-3.5 w-3.5" /> 归档
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            if (confirm(`确定删除收藏「${file.name}」？`)) {
                              deleteFileItem(file.id);
                              show("已删除");
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> 删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <FileForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingFile(null); }}
        onSubmit={editingFile ? handleUpdate : handleCreate}
        initial={editingFile}
      />
    </div>
  );
}
