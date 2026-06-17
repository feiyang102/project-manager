import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        返回项目列表
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">项目详情</h1>
          <p className="mt-1 text-sm text-muted">ID: {id}</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm transition-colors hover:bg-background">
            <Edit className="h-4 w-4" />
            编辑
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/5">
            <Trash2 className="h-4 w-4" />
            删除
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-card-border bg-card-bg p-5">
            <h2 className="text-sm font-semibold">基本信息</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted">状态</p>
                <p className="mt-0.5 font-medium">—</p>
              </div>
              <div>
                <p className="text-muted">类型</p>
                <p className="mt-0.5 font-medium">—</p>
              </div>
              <div>
                <p className="text-muted">优先级</p>
                <p className="mt-0.5 font-medium">—</p>
              </div>
              <div>
                <p className="text-muted">本地路径</p>
                <p className="mt-0.5 flex items-center gap-1 font-mono text-xs">—</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-card-border bg-card-bg p-5">
            <h2 className="text-sm font-semibold">项目笔记</h2>
            <div className="mt-4 flex h-24 items-center justify-center text-sm text-muted">
              暂无笔记
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-card-border bg-card-bg p-5">
            <h2 className="text-sm font-semibold">关联文件</h2>
            <div className="mt-4 flex h-20 items-center justify-center text-sm text-muted">
              暂无关联文件
            </div>
          </div>

          <div className="rounded-xl border border-card-border bg-card-bg p-5">
            <h2 className="text-sm font-semibold">链接</h2>
            <div className="mt-4 flex h-20 items-center justify-center text-sm text-muted">
              暂无链接
            </div>
          </div>

          <div className="rounded-xl border border-card-border bg-card-bg p-5">
            <h2 className="text-sm font-semibold">操作历史</h2>
            <div className="mt-4 flex h-20 items-center justify-center text-sm text-muted">
              暂无记录
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
