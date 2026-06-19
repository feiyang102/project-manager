"use client";

import { Archive, FolderKanban, FolderOpen, RotateCcw, Trash2 } from "lucide-react";
import { useProjects, useFileItems, useTags, useToast } from "@/lib/use-store";
import { restoreProject, deleteProject, restoreFileItem, deleteFileItem } from "@/lib/store";
import { TypeBadge, TagBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { Toast } from "@/components/ui/toast";

export default function ArchivePage() {
  const projects = useProjects();
  const files = useFileItems();
  const tags = useTags();
  const { toast, show } = useToast();

  const archivedProjects = projects.filter((p) => p.status === "archived");
  const archivedFiles = files.filter((f) => f.archived);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">归档</h1>
        <p className="mt-1 text-sm text-muted">已归档的项目和文件收藏</p>
      </div>

      {archivedProjects.length === 0 && archivedFiles.length === 0 ? (
        <EmptyState
          icon={Archive}
          title="暂无归档"
          description="归档的项目和文件收藏会出现在这里"
        />
      ) : (
        <>
          {/* Archived Projects */}
          {archivedProjects.length > 0 && (
            <div className="rounded-xl border border-card-border bg-card-bg p-5">
              <h2 className="text-sm font-semibold">已归档项目（{archivedProjects.length}）</h2>
              <div className="mt-3 space-y-2">
                {archivedProjects.map((project) => {
                  const projectTags = tags.filter((t) => project.tagIds.includes(t.id));
                  return (
                    <div
                      key={project.id}
                      className="flex items-center justify-between rounded-lg border border-card-border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <FolderKanban className="h-4 w-4 shrink-0 text-muted" />
                          <span className="text-sm font-medium">{project.name}</span>
                          <TypeBadge type={project.type} />
                        </div>
                        {projectTags.length > 0 && (
                          <div className="mt-1 flex gap-1">
                            {projectTags.map((tag) => (
                              <TagBadge key={tag.id} name={tag.name} color={tag.color} />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex shrink-0 items-center gap-1">
                        <button
                          onClick={() => { restoreProject(project.id); show("项目已恢复"); }}
                          className="rounded p-1.5 text-muted transition-colors hover:bg-background hover:text-accent"
                          title="恢复"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`确定永久删除项目「${project.name}」？此操作不可撤销。`)) {
                              deleteProject(project.id);
                              show("项目已永久删除");
                            }
                          }}
                          className="rounded p-1.5 text-muted transition-colors hover:bg-red-50 hover:text-danger"
                          title="永久删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Archived Files */}
          {archivedFiles.length > 0 && (
            <div className="rounded-xl border border-card-border bg-card-bg p-5">
              <h2 className="text-sm font-semibold">已归档文件收藏（{archivedFiles.length}）</h2>
              <div className="mt-3 space-y-2">
                {archivedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border border-card-border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 shrink-0 text-muted" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                          {file.kind}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate font-mono text-xs text-muted/70">{file.path}</p>
                    </div>
                    <div className="ml-3 flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => { restoreFileItem(file.id); show("文件已恢复"); }}
                        className="rounded p-1.5 text-muted transition-colors hover:bg-background hover:text-accent"
                        title="恢复"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`确定永久删除收藏「${file.name}」？`)) {
                            deleteFileItem(file.id);
                            show("文件已永久删除");
                          }
                        }}
                        className="rounded p-1.5 text-muted transition-colors hover:bg-red-50 hover:text-danger"
                        title="永久删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Toast toast={toast} />
    </div>
  );
}
