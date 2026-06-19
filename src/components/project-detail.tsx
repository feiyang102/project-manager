"use client";

import { useState, useEffect } from "react";
import { X, FolderOpen, Edit2, Trash2, Plus, ExternalLink, Archive, FileText, Link2, StickyNote, Copy, Check } from "lucide-react";
import type { Project } from "@/lib/types";
import { useTags, useFileItems, useNotes, useLinks } from "@/lib/use-store";
import {
  updateProject,
  deleteProject,
  archiveProject,
  restoreProject,
  addRecent,
  createNote,
  updateNote,
  deleteNote,
  createLink,
  updateLink,
  deleteLink,
} from "@/lib/store";
import { StatusBadge, TypeBadge, PriorityBadge, TagBadge } from "@/components/ui/badges";
import { openFolder } from "@/lib/open-folder";

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  onEdit: () => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export function ProjectDetail({ project, onClose, onEdit, onToast }: ProjectDetailProps) {
  const tags = useTags();
  const files = useFileItems();
  const notes = useNotes(project.id);
  const links = useLinks(project.id);
  const [copied, setCopied] = useState(false);
  const [newNote, setNewNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newLink, setNewLink] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const projectTags = tags.filter((t) => project.tagIds.includes(t.id));
  const projectFiles = files.filter((f) => f.projectId === project.id && !f.archived);

  const handleCopyPath = async () => {
    if (project.localPath) {
      try {
        await navigator.clipboard.writeText(project.localPath);
        setCopied(true);
        onToast("路径已复制");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        onToast("复制失败", "error");
      }
    }
  };

  const handleAddNote = () => {
    if (!noteTitle.trim()) return;
    if (editingNote) {
      updateNote(editingNote, { title: noteTitle, content: noteContent });
      onToast("笔记已更新");
    } else {
      createNote({ projectId: project.id, title: noteTitle, content: noteContent });
      onToast("笔记已添加");
    }
    setNoteTitle("");
    setNoteContent("");
    setNewNote(false);
    setEditingNote(null);
  };

  const handleEditNote = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      setNoteTitle(note.title);
      setNoteContent(note.content);
      setEditingNote(noteId);
      setNewNote(true);
    }
  };

  const handleAddLink = () => {
    if (!linkTitle.trim() || !linkUrl.trim()) return;
    createLink({ projectId: project.id, title: linkTitle, url: linkUrl, tagIds: [] });
    setLinkTitle("");
    setLinkUrl("");
    setNewLink(false);
    onToast("链接已添加");
  };

  const handleDelete = () => {
    if (confirm("确定要删除此项目？关联的笔记和链接也将被删除。")) {
      deleteProject(project.id);
      onToast("项目已删除");
      onClose();
    }
  };

  const handleArchive = () => {
    if (project.status === "archived") {
      restoreProject(project.id);
      onToast("已恢复项目");
    } else {
      archiveProject(project.id);
      onToast("项目已归档");
      onClose();
    }
  };

  useEffect(() => {
    addRecent("project", project.id, project.name);
  }, [project.id, project.name]);

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-card-border bg-white px-5 py-3">
          <h2 className="text-base font-semibold">{project.name}</h2>
          <div className="flex items-center gap-1">
            <button onClick={onEdit} className="rounded p-1.5 text-muted hover:bg-background" title="编辑">
              <Edit2 className="h-4 w-4" />
            </button>
            <button onClick={handleArchive} className="rounded p-1.5 text-muted hover:bg-background" title="归档">
              <Archive className="h-4 w-4" />
            </button>
            <button onClick={handleDelete} className="rounded p-1.5 text-danger hover:bg-red-50" title="删除">
              <Trash2 className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="rounded p-1.5 text-muted hover:bg-background">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-5">
          {/* Info */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={project.status} />
              <TypeBadge type={project.type} />
              <PriorityBadge priority={project.priority} />
            </div>
            {project.description && (
              <p className="text-sm text-muted">{project.description}</p>
            )}
            {project.localPath && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openFolder(project.localPath!)}
                  className="flex items-center gap-2 rounded-lg border border-card-border px-3 py-1.5 text-sm transition-colors hover:bg-background hover:border-accent/50"
                >
                  <FolderOpen className="h-3.5 w-3.5 text-accent" />
                  <span className="font-mono text-xs">{project.localPath}</span>
                </button>
                <button onClick={handleCopyPath} className="rounded p-1 text-muted hover:bg-background">
                  {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            )}
            {project.techStack && project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span key={tech} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{tech}</span>
                ))}
              </div>
            )}
            {projectTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {projectTags.map((tag) => (
                  <TagBadge key={tag.id} name={tag.name} color={tag.color} />
                ))}
              </div>
            )}
            <div className="text-xs text-muted">
              创建于 {new Date(project.createdAt).toLocaleDateString("zh-CN")}
              {project.startedAt && ` · 开始于 ${new Date(project.startedAt).toLocaleDateString("zh-CN")}`}
              {project.targetAt && ` · 目标 ${new Date(project.targetAt).toLocaleDateString("zh-CN")}`}
            </div>
          </div>

          {/* Files */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4" /> 关联文件
              <span className="text-xs font-normal text-muted">({projectFiles.length})</span>
            </h3>
            {projectFiles.length > 0 ? (
              <div className="mt-2 space-y-1">
                {projectFiles.map((f) => (
                  <div key={f.id} className="flex items-center justify-between rounded-lg border border-card-border px-3 py-2 text-sm">
                    <span className="truncate">{f.name}</span>
                    <button
                      onClick={() => openFolder(f.path)}
                      className="shrink-0 text-muted hover:text-accent"
                    >
                      <FolderOpen className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-muted">暂无关联文件</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <StickyNote className="h-4 w-4" /> 笔记
                <span className="text-xs font-normal text-muted">({notes.length})</span>
              </h3>
              <button
                onClick={() => { setNewNote(true); setEditingNote(null); setNoteTitle(""); setNoteContent(""); }}
                className="text-xs text-accent hover:underline"
              >
                <Plus className="inline h-3 w-3" /> 添加
              </button>
            </div>
            {newNote && (
              <div className="mt-2 space-y-2 rounded-lg border border-card-border p-3">
                <input
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="笔记标题"
                  className="w-full rounded border border-card-border px-2 py-1 text-sm outline-none focus:border-accent"
                />
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="笔记内容"
                  rows={3}
                  className="w-full rounded border border-card-border px-2 py-1 text-sm outline-none focus:border-accent"
                />
                <div className="flex gap-2">
                  <button onClick={handleAddNote} className="rounded bg-accent px-3 py-1 text-xs text-white">
                    {editingNote ? "保存" : "添加"}
                  </button>
                  <button onClick={() => { setNewNote(false); setEditingNote(null); }} className="rounded border border-card-border px-3 py-1 text-xs">
                    取消
                  </button>
                </div>
              </div>
            )}
            {notes.length > 0 && (
              <div className="mt-2 space-y-2">
                {notes.map((note) => (
                  <div key={note.id} className="rounded-lg border border-card-border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{note.title}</span>
                      <div className="flex gap-1">
                        <button onClick={() => handleEditNote(note.id)} className="text-muted hover:text-accent">
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button onClick={() => { deleteNote(note.id); onToast("笔记已删除"); }} className="text-muted hover:text-danger">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    {note.content && <p className="mt-1 text-xs text-muted whitespace-pre-wrap">{note.content}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Link2 className="h-4 w-4" /> 链接
                <span className="text-xs font-normal text-muted">({links.length})</span>
              </h3>
              <button
                onClick={() => { setNewLink(true); setLinkTitle(""); setLinkUrl(""); }}
                className="text-xs text-accent hover:underline"
              >
                <Plus className="inline h-3 w-3" /> 添加
              </button>
            </div>
            {newLink && (
              <div className="mt-2 space-y-2 rounded-lg border border-card-border p-3">
                <input
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="链接标题"
                  className="w-full rounded border border-card-border px-2 py-1 text-sm outline-none focus:border-accent"
                />
                <input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded border border-card-border px-2 py-1 text-sm outline-none focus:border-accent"
                />
                <div className="flex gap-2">
                  <button onClick={handleAddLink} className="rounded bg-accent px-3 py-1 text-xs text-white">添加</button>
                  <button onClick={() => setNewLink(false)} className="rounded border border-card-border px-3 py-1 text-xs">取消</button>
                </div>
              </div>
            )}
            {links.length > 0 && (
              <div className="mt-2 space-y-1">
                {links.map((link) => (
                  <div key={link.id} className="flex items-center justify-between rounded-lg border border-card-border px-3 py-2">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-accent hover:underline">
                      <ExternalLink className="h-3.5 w-3.5" />
                      {link.title}
                    </a>
                    <button onClick={() => { deleteLink(link.id); onToast("链接已删除"); }} className="text-muted hover:text-danger">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
