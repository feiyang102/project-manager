"use client";

import { useState, useMemo } from "react";
import { Plus, Search, FolderOpen, MoreVertical, Pencil, Trash2, Archive, Copy, Check, AlertTriangle, File, Folder, GitBranch, FileText, Image, Film, Music, ArchiveIcon, HelpCircle } from "lucide-react";
import { useFileItems, useTags, useToast } from "@/lib/use-store";
import { createFileItem, updateFileItem, deleteFileItem, archiveFileItem } from "@/lib/store";
import { TagBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { FileForm } from "@/components/file-form";
import { Toast } from "@/components/ui/toast";
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
  const { toast, show } = useToast();

  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
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
    if (kindFilter) list = list.filter((f) => f.kind === kindFilter);
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
    setMenuOpen(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">文件收藏</h1>
          <p className="mt-1 text-sm text-muted">管理收藏的本地文件与文件夹（{activeFiles.length}）</p>
        </div>
        <button
          onClick={() => { setEditingFile(null); setFormOpen(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/90"
        >
          <Plus className="h-4 w-4" />
          添加收藏
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索收藏..."
            className="w-full rounded-lg border border-card-border bg-card-bg py-2 pl-10 pr-4 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>
        <select
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value)}
          className="rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm text-muted outline-none focus:border-accent"
        >
          <option value="">全部类型</option>
          {Object.entries(KIND_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={search || kindFilter ? "没有匹配的收藏" : "暂无收藏"}
          description={search || kindFilter ? "尝试调整搜索或筛选条件" : "点击「添加收藏」收藏你的第一个本地文件或文件夹"}
          action={
            !search && !kindFilter ? (
              <button
                onClick={() => { setEditingFile(null); setFormOpen(true); }}
                className="rounded-lg bg-accent px-4 py-2 text-sm text-white"
              >
                添加收藏
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((file) => {
            const Icon = KIND_ICONS[file.kind];
            const fileTags = tags.filter((t) => file.tagIds.includes(t.id));
            return (
              <div
                key={file.id}
                className="group flex items-center justify-between rounded-xl border border-card-border bg-card-bg p-4 transition-colors hover:border-accent/30"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-accent" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                      {KIND_LABELS[file.kind]}
                    </span>
                    {!file.exists && (
                      <span className="flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-xs text-danger">
                        <AlertTriangle className="h-3 w-3" /> 路径失效
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <span className="truncate font-mono text-xs text-muted/70">{file.path}</span>
                    {fileTags.length > 0 && (
                      <div className="flex gap-1">
                        {fileTags.slice(0, 3).map((tag) => (
                          <TagBadge key={tag.id} name={tag.name} color={tag.color} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative ml-3 flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => openFolder(file.path)}
                    className="rounded p-1.5 text-muted opacity-0 transition-opacity hover:bg-background hover:text-accent group-hover:opacity-100"
                    title="打开"
                  >
                    <FolderOpen className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleCopyPath(file)}
                    className="rounded p-1.5 text-muted opacity-0 transition-opacity hover:bg-background group-hover:opacity-100"
                    title="复制路径"
                  >
                    {copiedId === file.id ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setMenuOpen(menuOpen === file.id ? null : file.id)}
                    className="rounded p-1.5 text-muted opacity-0 transition-opacity hover:bg-background group-hover:opacity-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {menuOpen === file.id && (
                    <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-card-border bg-white py-1 shadow-lg">
                      <button
                        onClick={() => { setEditingFile(file); setFormOpen(true); setMenuOpen(null); }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-background"
                      >
                        <Pencil className="h-3.5 w-3.5" /> 编辑
                      </button>
                      <button
                        onClick={() => { archiveFileItem(file.id); show("已归档"); setMenuOpen(null); }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-background"
                      >
                        <Archive className="h-3.5 w-3.5" /> 归档
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`确定删除收藏「${file.name}」？`)) {
                            deleteFileItem(file.id);
                            show("已删除");
                          }
                          setMenuOpen(null);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-danger hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> 删除
                      </button>
                    </div>
                  )}
                </div>
              </div>
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

      <Toast toast={toast} />
    </div>
  );
}
