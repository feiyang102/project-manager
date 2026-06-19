"use client";

import { useRouter } from "next/navigation";
import { Clock, FolderKanban, FolderOpen, Trash2 } from "lucide-react";
import { useRecent, useToast } from "@/lib/use-store";
import { clearRecent } from "@/lib/store";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecentPage() {
  const router = useRouter();
  const recent = useRecent();
  const { show } = useToast();

  const recentProjects = recent.filter((r) => r.type === "project");
  const recentFiles = recent.filter((r) => r.type === "file");

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "刚刚";
    if (mins < 60) return `${mins} 分钟前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} 小时前`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} 天前`;
    return d.toLocaleDateString("zh-CN");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">最近访问</h1>
        <p className="mt-1 text-sm text-muted-foreground">最近查看过的项目和文件收藏</p>
      </div>

      {recent.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="暂无最近访问"
          description="浏览项目或文件后，会在这里显示最近访问记录"
        />
      ) : (
        <>
          {/* Recent Projects */}
          {recentProjects.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">最近项目</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {recentProjects.slice(0, 10).map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => router.push(`/projects?id=${item.targetId}`)}
                  >
                    <span className="flex items-center gap-2">
                      <FolderKanban className="h-4 w-4 text-primary" />
                      {item.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatTime(item.accessedAt)}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent Files */}
          {recentFiles.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">最近文件收藏</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {recentFiles.slice(0, 10).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm">
                    <span className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-primary" />
                      {item.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatTime(item.accessedAt)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Clear */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => { clearRecent(); show("记录已清空"); }}>
              <Trash2 className="h-4 w-4" />
              清空记录
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
