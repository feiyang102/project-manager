import { Clock } from "lucide-react";

export default function RecentPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">最近访问</h1>
        <p className="mt-1 text-sm text-muted">最近查看过的项目和文件收藏</p>
      </div>

      {/* Recent Projects */}
      <div className="rounded-xl border border-card-border bg-card-bg p-5">
        <h2 className="text-sm font-semibold">最近项目</h2>
        <div className="mt-4 flex h-24 items-center justify-center text-sm text-muted">
          暂无最近访问的项目
        </div>
      </div>

      {/* Recent Files */}
      <div className="rounded-xl border border-card-border bg-card-bg p-5">
        <h2 className="text-sm font-semibold">最近文件收藏</h2>
        <div className="mt-4 flex h-24 items-center justify-center text-sm text-muted">
          暂无最近访问的文件收藏
        </div>
      </div>

      {/* Clear */}
      <div className="flex justify-end">
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm text-muted transition-colors hover:bg-background">
          <Clock className="h-4 w-4" />
          清空记录
        </button>
      </div>
    </div>
  );
}
