import { Plus, Search, FolderOpen } from "lucide-react";

export default function FilesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">文件收藏</h1>
          <p className="mt-1 text-sm text-muted">管理收藏的本地文件与文件夹</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/90">
          <Plus className="h-4 w-4" />
          添加收藏
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="搜索收藏..."
            className="w-full rounded-lg border border-card-border bg-card-bg py-2 pl-10 pr-4 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>
        <select className="rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm text-muted outline-none focus:border-accent">
          <option value="">全部类型</option>
          <option value="file">文件</option>
          <option value="folder">文件夹</option>
          <option value="repo">代码仓库</option>
          <option value="document">文档</option>
        </select>
      </div>

      {/* Empty State */}
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-card-border bg-card-bg">
        <FolderOpen className="h-10 w-10 text-muted" />
        <p className="mt-3 text-sm font-medium">暂无收藏</p>
        <p className="mt-1 text-xs text-muted">
          点击「添加收藏」收藏你的第一个本地文件或文件夹
        </p>
      </div>
    </div>
  );
}
