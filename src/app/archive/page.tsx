"use client";

import { Archive, FolderKanban, FolderOpen, RotateCcw, Trash2 } from "lucide-react";
import { useProjects, useFileItems, useTags, useToast } from "@/lib/use-store";
import { restoreProject, deleteProject, restoreFileItem, deleteFileItem } from "@/lib/store";
import { TypeBadge, TagBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ArchivePage() {
  const projects = useProjects();
  const files = useFileItems();
  const tags = useTags();
  const { show } = useToast();

  const archivedProjects = projects.filter((p) => p.status === "archived");
  const archivedFiles = files.filter((f) => f.archived);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">归档</h1>
        <p className="mt-1 text-sm text-muted-foreground">已归档的项目和文件收藏</p>
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
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">已归档项目（{archivedProjects.length}）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {archivedProjects.map((project) => {
                  const projectTags = tags.filter((t) => project.tagIds.includes(t.id));
                  return (
                    <div key={project.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <FolderKanban className="h-4 w-4 shrink-0 text-muted-foreground" />
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
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { restoreProject(project.id); show("项目已恢复"); }} title="恢复">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm(`确定永久删除项目「${project.name}」？此操作不可撤销。`)) {
                              deleteProject(project.id);
                              show("项目已永久删除");
                            }
                          }}
                          title="永久删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Archived Files */}
          {archivedFiles.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">已归档文件收藏（{archivedFiles.length}）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {archivedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
                          {file.kind}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground/70">{file.path}</p>
                    </div>
                    <div className="ml-3 flex shrink-0 items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { restoreFileItem(file.id); show("文件已恢复"); }} title="恢复">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`确定永久删除收藏「${file.name}」？`)) {
                            deleteFileItem(file.id);
                            show("文件已永久删除");
                          }
                        }}
                        title="永久删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
