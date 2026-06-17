import {
  FolderKanban,
  Star,
  Clock,
  Archive,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  { label: "项目总数", value: "0", icon: FolderKanban },
  { label: "进行中", value: "0", icon: Clock },
  { label: "文件收藏", value: "0", icon: Star },
  { label: "已归档", value: "0", icon: Archive },
];

export default function DashboardPage() {
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
          <div className="mt-4 flex h-32 items-center justify-center text-sm text-muted">
            暂无数据，开始创建你的第一个项目吧
          </div>
        </div>

        {/* Active Projects */}
        <div className="rounded-xl border border-card-border bg-card-bg p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">进行中项目</h2>
            <a href="/projects" className="flex items-center gap-1 text-xs text-accent hover:underline">
              查看全部 <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <div className="mt-4 flex h-32 items-center justify-center text-sm text-muted">
            暂无进行中的项目
          </div>
        </div>

        {/* Recent Collections */}
        <div className="rounded-xl border border-card-border bg-card-bg p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">最近添加收藏</h2>
            <a href="/files" className="flex items-center gap-1 text-xs text-accent hover:underline">
              查看全部 <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <div className="mt-4 flex h-32 items-center justify-center text-sm text-muted">
            暂无收藏，添加你的第一个文件夹
          </div>
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
