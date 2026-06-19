"use client";

import { useRouter } from "next/navigation";
import {
  FolderKanban,
  Star,
  Clock,
  Archive,
  ArrowUpRight,
  FolderOpen,
} from "lucide-react";
import { useProjects, useFileItems, useRecent } from "@/lib/use-store";
import { TypeBadge } from "@/components/ui/badges";

export default function DashboardPage() {
  const router = useRouter();
  const projects = useProjects();
  const files = useFileItems();
  const recent = useRecent();

  const activeProjects = projects.filter((p) => p.status !== "archived");
  const activeFiles = files.filter((f) => !f.archived);
  const archivedCount = projects.filter((p) => p.status === "archived").length + files.filter((f) => f.archived).length;
  const inProgress = projects.filter((p) => p.status === "active");

  const recentProjectItems = recent.filter((r) => r.type === "project").slice(0, 5);
  const recentFileItems = recent.filter((r) => r.type === "file").slice(0, 5);
  const latestFiles = activeFiles.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const stats = [
    { label: "项目总数", value: String(activeProjects.length), icon: FolderKanban },
    { label: "进行中", value: String(inProgress.length), icon: Clock },
    { label: "文件收藏", value: String(activeFiles.length), icon: Star },
    { label: "已归档", value: String(archivedCount), icon: Archive },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">仪表盘</h1>
        <p className="mt-1 text-sm text-muted">项目与文件资产概览</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-card-border bg-card-bg p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">{stat.label}</p>
                <Icon className="h-4 w-4 text-muted" />
              </div>
              <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <div className="rounded-xl border border-card-border bg-card-bg p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">最近访问项目</h2>
            <a href="/recent" className="flex items-center gap-1 text-xs text-accent hover:underline">
              查看全部 <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          {recentProjectItems.length === 0 ? (
            <div className="mt-4 flex h-32 items-center justify-center text-sm text-muted">
              暂无数据，开始创建你的第一个项目吧
            </div>
          ) : (
            <div className="mt-3 space-y-1">
              {recentProjectItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(`/projects?id=${item.targetId}`)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-background"
                >
                  <FolderKanban className="h-4 w-4 text-accent" />
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Projects */}
        <div className="rounded-xl border border-card-border bg-card-bg p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">进行中项目</h2>
            <a href="/projects" className="flex items-center gap-1 text-xs text-accent hover:underline">
              查看全部 <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          {inProgress.length === 0 ? (
            <div className="mt-4 flex h-32 items-center justify-center text-sm text-muted">
              暂无进行中的项目
            </div>
          ) : (
            <div className="mt-3 space-y-1">
              {inProgress.slice(0, 5).map((project) => (
                <button
                  key={project.id}
                  onClick={() => router.push(`/projects?id=${project.id}`)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-background"
                >
                  <span className="flex-1 truncate text-left">{project.name}</span>
                  <TypeBadge type={project.type} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recent Collections */}
        <div className="rounded-xl border border-card-border bg-card-bg p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">最近添加收藏</h2>
            <a href="/files" className="flex items-center gap-1 text-xs text-accent hover:underline">
              查看全部 <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          {latestFiles.length === 0 ? (
            <div className="mt-4 flex h-32 items-center justify-center text-sm text-muted">
              暂无收藏，添加你的第一个文件夹
            </div>
          ) : (
            <div className="mt-3 space-y-1">
              {latestFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                >
                  <FolderOpen className="h-4 w-4 text-accent" />
                  <span className="flex-1 truncate">{file.name}</span>
                  <span className="truncate font-mono text-xs text-muted/70 max-w-32">{file.path}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-card-border bg-card-bg p-5">
          <h2 className="text-sm font-semibold">快速操作</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <a
              href="/projects"
              className="rounded-lg border border-card-border px-4 py-3 text-center text-sm transition-colors hover:bg-background"
            >
              新建项目
            </a>
            <a
              href="/files"
              className="rounded-lg border border-card-border px-4 py-3 text-center text-sm transition-colors hover:bg-background"
            >
              添加收藏
            </a>
            <a
              href="/tags"
              className="rounded-lg border border-card-border px-4 py-3 text-center text-sm transition-colors hover:bg-background"
            >
              管理标签
            </a>
            <a
              href="/settings"
              className="rounded-lg border border-card-border px-4 py-3 text-center text-sm transition-colors hover:bg-background"
            >
              应用设置
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
