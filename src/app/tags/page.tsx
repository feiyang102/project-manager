import { Plus, Tag } from "lucide-react";

export default function TagsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">标签管理</h1>
          <p className="mt-1 text-sm text-muted">跨项目和文件收藏建立灵活分类</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent/90">
          <Plus className="h-4 w-4" />
          新建标签
        </button>
      </div>

      {/* Empty State */}
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-card-border bg-card-bg">
        <Tag className="h-10 w-10 text-muted" />
        <p className="mt-3 text-sm font-medium">暂无标签</p>
        <p className="mt-1 text-xs text-muted">
          点击「新建标签」创建第一个标签，为项目和文件分类
        </p>
      </div>
    </div>
  );
}
