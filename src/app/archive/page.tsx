import { Archive } from "lucide-react";

export default function ArchivePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">归档</h1>
        <p className="mt-1 text-sm text-muted">已归档的项目和文件收藏</p>
      </div>

      {/* Archived Projects */}
      <div className="rounded-xl border border-card-border bg-card-bg p-5">
        <h2 className="text-sm font-semibold">已归档项目</h2>
        <div className="mt-4 flex h-24 items-center justify-center text-sm text-muted">
          暂无已归档的项目
        </div>
      </div>

      {/* Archived Files */}
      <div className="rounded-xl border border-card-border bg-card-bg p-5">
        <h2 className="text-sm font-semibold">已归档文件收藏</h2>
        <div className="mt-4 flex h-24 items-center justify-center text-sm text-muted">
          暂无已归档的文件收藏
        </div>
      </div>
    </div>
  );
}
