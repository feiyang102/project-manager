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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
        <p className="mt-1 text-sm text-muted-foreground">项目与文件资产概览</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm">最近访问项目</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <a href="/recent" className="gap-1 text-xs">
                查看全部 <ArrowUpRight className="h-3 w-3" />
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            {recentProjectItems.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                暂无数据，开始创建你的第一个项目吧
              </div>
            ) : (
              <div className="space-y-1">
                {recentProjectItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => router.push(`/projects?id=${item.targetId}`)}
                  >
                    <FolderKanban className="h-4 w-4 text-primary" />
                    {item.name}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm">进行中项目</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <a href="/projects" className="gap-1 text-xs">
                查看全部 <ArrowUpRight className="h-3 w-3" />
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            {inProgress.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                暂无进行中的项目
              </div>
            ) : (
              <div className="space-y-1">
                {inProgress.slice(0, 5).map((project) => (
                  <Button
                    key={project.id}
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => router.push(`/projects?id=${project.id}`)}
                  >
                    <span className="truncate">{project.name}</span>
                    <TypeBadge type={project.type} />
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Collections */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm">最近添加收藏</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <a href="/files" className="gap-1 text-xs">
                查看全部 <ArrowUpRight className="h-3 w-3" />
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            {latestFiles.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                暂无收藏，添加你的第一个文件夹
              </div>
            ) : (
              <div className="space-y-1">
                {latestFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
                    <FolderOpen className="h-4 w-4 text-primary" />
                    <span className="flex-1 truncate">{file.name}</span>
                    <span className="truncate font-mono text-xs text-muted-foreground/70 max-w-32">{file.path}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">快速操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/projects", label: "新建项目" },
                { href: "/files", label: "添加收藏" },
                { href: "/tags", label: "管理标签" },
                { href: "/settings", label: "应用设置" },
              ].map((action) => (
                <Button key={action.href} variant="outline" asChild>
                  <a href={action.href}>{action.label}</a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
