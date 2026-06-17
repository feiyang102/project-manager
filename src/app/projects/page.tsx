import { Plus, Search, Filter, LayoutGrid, List, FolderKanban } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">项目</h1>
          <p className="mt-1 text-sm text-muted">管理你的所有项目</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/90">
          <Plus className="h-4 w-4" />
          新建项目
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="搜索项目..."
            className="w-full rounded-lg border border-card-border bg-card-bg py-2 pl-10 pr-4 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Filter */}
        <button className="inline-flex items-center gap-2 rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm text-muted transition-colors hover:bg-background">
          <Filter className="h-4 w-4" />
          筛选
        </button>

        {/* View Toggle */}
        <div className="flex rounded-lg border border-card-border bg-card-bg">
          <button className="rounded-l-lg bg-background px-3 py-2">
            <List className="h-4 w-4" />
          </button>
          <button className="rounded-r-lg px-3 py-2 text-muted hover:text-foreground">
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-card-border bg-card-bg">
        <FolderKanban className="h-10 w-10 text-muted" />
        <p className="mt-3 text-sm font-medium">暂无项目</p>
        <p className="mt-1 text-xs text-muted">
          点击「新建项目」创建你的第一个项目
        </p>
      </div>
    </div>
  );
}
