"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Plus, Search, Filter, FolderKanban, FolderOpen, Archive, Pencil, Trash2, Terminal, MoreVertical } from "lucide-react";
import { useProjects, useTags, useToast } from "@/lib/use-store";
import { createProject, updateProject, deleteProject, archiveProject, getProject } from "@/lib/store";
import { StatusBadge, TypeBadge, PriorityBadge, TagBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectForm } from "@/components/project-form";
import { ProjectDetail } from "@/components/project-detail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { openFolder, openInQoder } from "@/lib/open-folder";
import type { Project, ProjectStatus, ProjectType, Priority } from "@/lib/types";
import { STATUS_LABELS, TYPE_LABELS, PRIORITY_LABELS } from "@/lib/types";

type SortKey = "createdAt" | "updatedAt" | "lastAccessedAt";

export default function ProjectsPage() {
  const router = useRouter();

  const projects = useProjects();
  const tags = useTags();
  const { show } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [showFilter, setShowFilter] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const activeProjects = projects.filter((p) => p.status !== "archived");

  const filtered = useMemo(() => {
    let list = activeProjects;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.localPath?.toLowerCase().includes(q)
      );
    }
    if (statusFilter && statusFilter !== "__all__") list = list.filter((p) => p.status === statusFilter);
    if (typeFilter && typeFilter !== "__all__") list = list.filter((p) => p.type === typeFilter);
    return list.sort((a, b) => {
      const av = a[sortKey] || "";
      const bv = b[sortKey] || "";
      return bv.localeCompare(av);
    });
  }, [activeProjects, search, statusFilter, typeFilter, sortKey]);

  const handleCreate = (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    createProject(data);
    show("项目已创建");
  };

  const handleUpdate = (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
      show("项目已更新");
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormOpen(true);
  };

  const handleDelete = (project: Project) => {
    if (confirm(`确定删除项目「${project.name}」？关联的笔记和链接也将被删除。`)) {
      deleteProject(project.id);
      show("项目已删除");
    }
  };

  const handleArchive = (project: Project) => {
    archiveProject(project.id);
    show("项目已归档");
  };

  const openDetail = (project: Project) => {
    router.push(`/projects?id=${project.id}`);
  };

  const closeDetail = () => {
    router.push("/projects");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">项目</h1>
          <p className="mt-1 text-sm text-muted-foreground">管理你的所有项目（{activeProjects.length}）</p>
        </div>
        <Button onClick={() => { setEditingProject(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" />
          新建项目
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索项目..."
            className="pl-10"
          />
        </div>

        <Button
          variant={showFilter ? "default" : "outline"}
          onClick={() => setShowFilter(!showFilter)}
        >
          <Filter className="h-4 w-4" />
          筛选
        </Button>

        <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt">最近更新</SelectItem>
            <SelectItem value="createdAt">最近创建</SelectItem>
            <SelectItem value="lastAccessedAt">最近访问</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filters */}
      {showFilter && (
        <Card>
          <CardContent className="flex items-center gap-3 p-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部状态</SelectItem>
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="全部类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部类型</SelectItem>
                {Object.entries(TYPE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(statusFilter || typeFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setStatusFilter(""); setTypeFilter(""); }}
                className="text-xs text-primary"
              >
                清除筛选
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={search || statusFilter || typeFilter ? "没有匹配的项目" : "暂无项目"}
          description={search || statusFilter || typeFilter ? "尝试调整搜索或筛选条件" : "点击「新建项目」创建你的第一个项目"}
          action={
            !search && !statusFilter && !typeFilter ? (
              <Button onClick={() => { setEditingProject(null); setFormOpen(true); }}>
                新建项目
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((project) => {
            const projectTags = tags.filter((t) => project.tagIds.includes(t.id));
            return (
              <Card key={project.id} className="transition-colors hover:border-primary/30">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1 cursor-pointer" onClick={() => openDetail(project)}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{project.name}</span>
                      <StatusBadge status={project.status} />
                      <TypeBadge type={project.type} />
                      <PriorityBadge priority={project.priority} />
                    </div>
                    {project.description && (
                      <p className="mt-1 truncate text-xs text-muted-foreground">{project.description}</p>
                    )}
                    <div className="mt-1.5 flex items-center gap-3">
                      {project.localPath && (
                        <span className="truncate font-mono text-xs text-muted-foreground/70">{project.localPath}</span>
                      )}
                      {projectTags.length > 0 && (
                        <div className="flex gap-1">
                          {projectTags.slice(0, 3).map((tag) => (
                            <TagBadge key={tag.id} name={tag.name} color={tag.color} />
                          ))}
                          {projectTags.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{projectTags.length - 3}</span>
                          )}
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground/50">
                        {new Date(project.updatedAt).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  </div>

                  <div className="ml-3 flex shrink-0 items-center gap-1">
                    {project.localPath && (
                      <>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); openFolder(project.localPath!); }} title="打开文件夹">
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); openInQoder(project.localPath!); }} title="用 Qoder 打开">
                          <Terminal className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(project)}>
                          <Pencil className="h-3.5 w-3.5" /> 编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleArchive(project)}>
                          <Archive className="h-3.5 w-3.5" /> 归档
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(project)}>
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

      {/* Form Modal */}
      <ProjectForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingProject(null); }}
        onSubmit={editingProject ? handleUpdate : handleCreate}
        initial={editingProject}
      />

      {/* Detail Panel */}
      <Suspense>
        <ProjectDetailPanel
          onClose={closeDetail}
          onEdit={handleEdit}
          onToast={show}
        />
      </Suspense>
    </div>
  );
}

function ProjectDetailPanel({
  onClose,
  onEdit,
  onToast,
}: {
  onClose: () => void;
  onEdit: (project: Project) => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (!id) return null;
  const project = getProject(id);
  if (!project) return null;
  return (
    <ProjectDetail
      project={project}
      onClose={onClose}
      onEdit={() => onEdit(project)}
      onToast={onToast}
    />
  );
}
