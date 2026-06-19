"use client";

import { useState, useEffect } from "react";
import { FolderOpen, Edit2, Trash2, Plus, ExternalLink, Archive, FileText, Link2, StickyNote, Copy, Check, Terminal } from "lucide-react";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { openFolder, openInQoder } from "@/lib/open-folder";

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
    <Sheet open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="right" className="w-full max-w-2xl p-0">
        {/* Header */}
        <SheetHeader className="sticky top-0 z-10 flex-row items-center justify-between border-b bg-background px-6 py-4">
          <SheetTitle className="text-base">{project.name}</SheetTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onEdit} title="编辑">
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleArchive} title="归档">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:text-destructive" title="删除">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-65px)]">
          <div className="space-y-6 p-6">
            {/* Info */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={project.status} />
                <TypeBadge type={project.type} />
                <PriorityBadge priority={project.priority} />
              </div>
              {project.description && (
                <p className="text-sm text-muted-foreground">{project.description}</p>
              )}
              {project.localPath && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openFolder(project.localPath!)}
                    className="gap-2"
                  >
                    <FolderOpen className="h-3.5 w-3.5 text-primary" />
                    <span className="font-mono text-xs">{project.localPath}</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyPath} title="复制路径">
                    {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openInQoder(project.localPath!)}
                    title="用 Qoder 打开"
                  >
                    <Terminal className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
              {project.techStack && project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{tech}</span>
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
              <div className="text-xs text-muted-foreground">
                创建于 {new Date(project.createdAt).toLocaleDateString("zh-CN")}
                {project.startedAt && ` · 开始于 ${new Date(project.startedAt).toLocaleDateString("zh-CN")}`}
                {project.targetAt && ` · 目标 ${new Date(project.targetAt).toLocaleDateString("zh-CN")}`}
              </div>
            </div>

            <Separator />

            {/* Tabs: Files / Notes / Links */}
            <Tabs defaultValue="files">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="files" className="gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> 文件 ({projectFiles.length})
                </TabsTrigger>
                <TabsTrigger value="notes" className="gap-1.5">
                  <StickyNote className="h-3.5 w-3.5" /> 笔记 ({notes.length})
                </TabsTrigger>
                <TabsTrigger value="links" className="gap-1.5">
                  <Link2 className="h-3.5 w-3.5" /> 链接 ({links.length})
                </TabsTrigger>
              </TabsList>

              {/* Files Tab */}
              <TabsContent value="files">
                {projectFiles.length > 0 ? (
                  <div className="space-y-1">
                    {projectFiles.map((f) => (
                      <div key={f.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                        <span className="truncate">{f.name}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => openFolder(f.path)}>
                          <FolderOpen className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-xs text-muted-foreground">暂无关联文件</p>
                )}
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="space-y-3">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setNewNote(true); setEditingNote(null); setNoteTitle(""); setNoteContent(""); }}
                  >
                    <Plus className="h-3 w-3" /> 添加
                  </Button>
                </div>
                {newNote && (
                  <div className="space-y-2 rounded-lg border p-3">
                    <Input
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="笔记标题"
                    />
                    <Textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="笔记内容"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddNote}>{editingNote ? "保存" : "添加"}</Button>
                      <Button size="sm" variant="outline" onClick={() => { setNewNote(false); setEditingNote(null); }}>取消</Button>
                    </div>
                  </div>
                )}
                {notes.length > 0 && (
                  <div className="space-y-2">
                    {notes.map((note) => (
                      <div key={note.id} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{note.title}</span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditNote(note.id)}>
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => { deleteNote(note.id); onToast("笔记已删除"); }}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {note.content && <p className="mt-1 text-xs text-muted-foreground whitespace-pre-wrap">{note.content}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Links Tab */}
              <TabsContent value="links" className="space-y-3">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setNewLink(true); setLinkTitle(""); setLinkUrl(""); }}
                  >
                    <Plus className="h-3 w-3" /> 添加
                  </Button>
                </div>
                {newLink && (
                  <div className="space-y-2 rounded-lg border p-3">
                    <Input
                      value={linkTitle}
                      onChange={(e) => setLinkTitle(e.target.value)}
                      placeholder="链接标题"
                    />
                    <Input
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://..."
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddLink}>添加</Button>
                      <Button size="sm" variant="outline" onClick={() => setNewLink(false)}>取消</Button>
                    </div>
                  </div>
                )}
                {links.length > 0 && (
                  <div className="space-y-1">
                    {links.map((link) => (
                      <div key={link.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                          <ExternalLink className="h-3.5 w-3.5" />
                          {link.title}
                        </a>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => { deleteLink(link.id); onToast("链接已删除"); }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
