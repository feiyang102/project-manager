"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Plus, Search, Filter, FolderKanban, MoreVertical, FolderOpen, Archive, Pencil, Trash2, SortAsc, Terminal } from "lucide-react";
import { useProjects, useTags, useToast } from "@/lib/use-store";
import { createProject, updateProject, deleteProject, archiveProject, getProject } from "@/lib/store";
import { StatusBadge, TypeBadge, PriorityBadge, TagBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectForm } from "@/components/project-form";
import { ProjectDetail } from "@/components/project-detail";
import { Toast } from "@/components/ui/toast";
import { openFolder, openInQoder } from "@/lib/open-folder";
import type { Project, ProjectStatus, ProjectType, Priority } from "@/lib/types";
import { STATUS_LABELS, TYPE_LABELS, PRIORITY_LABELS } from "@/lib/types";

type SortKey = "createdAt" | "updatedAt" | "lastAccessedAt";

export default function ProjectsPage() {
  const router = useRouter();

  const projects = useProjects();
  const tags = useTags();
  const { toast, show } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [showFilter, setShowFilter] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

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
    if (statusFilter) list = list.filter((p) => p.status === statusFilter);
    if (typeFilter) list = list.filter((p) => p.type === typeFilter);
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
    setMenuOpen(null);
  };

  const handleDelete = (project: Project) => {
    if (confirm(`确定删除项目「${project.name}」？关联的笔记和链接也将被删除。`)) {
      deleteProject(project.id);
      show("项目已删除");
    }
    setMenuOpen(null);
  };

  const handleArchive = (project: Project) => {
    archiveProject(project.id);
    show("项目已归档");
    setMenuOpen(null);
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
          <p className="mt-1 text-sm text-muted">管理你的所有项目（{activeProjects.length}）</p>
        </div>
        <button
          onClick={() => { setEditingProject(null); setFormOpen(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/90"
        >
          <Plus className="h-4 w-4" />
          新建项目
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
            placeholder="搜索项目..."
            className="w-full rounded-lg border border-card-border bg-card-bg py-2 pl-10 pr-4 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`inline-flex items-center gap-2 rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm transition-colors hover:bg-background ${showFilter ? "border-accent text-accent" : "text-muted"}`}
        >
          <Filter className="h-4 w-4" />
          筛选
        </button>

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm text-muted outline-none focus:border-accent"
        >
          <option value="updatedAt">最近更新</option>
          <option value="createdAt">最近创建</option>
          <option value="lastAccessedAt">最近访问</option>
        </select>
      </div>

      {/* Filters */}
      {showFilter && (
        <div className="flex gap-3 rounded-lg border border-card-border bg-card-bg p-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-card-border bg-white px-3 py-1.5 text-sm outline-none focus:border-accent"
          >
            <option value="">全部状态</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-card-border bg-white px-3 py-1.5 text-sm outline-none focus:border-accent"
          >
            <option value="">全部类型</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          {(statusFilter || typeFilter) && (
            <button
              onClick={() => { setStatusFilter(""); setTypeFilter(""); }}
              className="text-xs text-accent hover:underline"
            >
              清除筛选
            </button>
          )}
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={search || statusFilter || typeFilter ? "没有匹配的项目" : "暂无项目"}
          description={search || statusFilter || typeFilter ? "尝试调整搜索或筛选条件" : "点击「新建项目」创建你的第一个项目"}
          action={
            !search && !statusFilter && !typeFilter ? (
              <button
                onClick={() => { setEditingProject(null); setFormOpen(true); }}
                className="rounded-lg bg-accent px-4 py-2 text-sm text-white"
              >
                新建项目
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((project) => {
            const projectTags = tags.filter((t) => project.tagIds.includes(t.id));
            return (
              <div
                key={project.id}
                className="group flex items-center justify-between rounded-xl border border-card-border bg-card-bg p-4 transition-colors hover:border-accent/30"
              >
                <div className="min-w-0 flex-1 cursor-pointer" onClick={() => openDetail(project)}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{project.name}</span>
                    <StatusBadge status={project.status} />
                    <TypeBadge type={project.type} />
                    <PriorityBadge priority={project.priority} />
                  </div>
                  {project.description && (
                    <p className="mt-1 truncate text-xs text-muted">{project.description}</p>
                  )}
                  <div className="mt-1.5 flex items-center gap-3">
                    {project.localPath && (
                      <span className="truncate font-mono text-xs text-muted/70">{project.localPath}</span>
                    )}
                    {projectTags.length > 0 && (
                      <div className="flex gap-1">
                        {projectTags.slice(0, 3).map((tag) => (
                          <TagBadge key={tag.id} name={tag.name} color={tag.color} />
                        ))}
                        {projectTags.length > 3 && (
                          <span className="text-xs text-muted">+{projectTags.length - 3}</span>
                        )}
                      </div>
                    )}
                    <span className="text-xs text-muted/50">
                      {new Date(project.updatedAt).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                </div>

                <div className="relative ml-3 flex shrink-0 items-center gap-1">
                  {project.localPath && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); openFolder(project.localPath!); }}
                        className="rounded p-1.5 text-muted transition-opacity hover:bg-background hover:text-accent"
                        title="打开文件夹"
                      >
                        <FolderOpen className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); openInQoder(project.localPath!); }}
                        className="rounded p-1.5 text-muted transition-opacity hover:bg-background hover:text-accent"
                        title="用 Qoder 打开"
                      >
                        <Terminal className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === project.id ? null : project.id); }}
                    className="rounded p-1.5 text-muted transition-opacity hover:bg-background"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {menuOpen === project.id && (
                    <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-card-border bg-white py-1 shadow-lg">
                      <button
                        onClick={() => handleEdit(project)}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-background"
                      >
                        <Pencil className="h-3.5 w-3.5" /> 编辑
                      </button>
                      <button
                        onClick={() => handleArchive(project)}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-background"
                      >
                        <Archive className="h-3.5 w-3.5" /> 归档
                      </button>
                      <button
                        onClick={() => handleDelete(project)}
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

      <Toast toast={toast} />
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
