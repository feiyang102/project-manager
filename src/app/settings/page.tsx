import { Download, Upload, Database, Info } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">设置</h1>
        <p className="mt-1 text-sm text-muted">管理应用配置</p>
      </div>

      {/* Data Storage */}
      <div className="rounded-xl border border-card-border bg-card-bg p-5">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-muted" />
          <h2 className="text-sm font-semibold">数据存储</h2>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">数据库位置</span>
            <span className="font-mono text-xs">~/Library/Application Support/admin-panel/</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">默认扫描目录</span>
            <span className="font-mono text-xs">未设置</span>
          </div>
        </div>
      </div>

      {/* Import/Export */}
      <div className="rounded-xl border border-card-border bg-card-bg p-5">
        <h2 className="text-sm font-semibold">导入导出</h2>
        <div className="mt-4 flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-card-border px-4 py-2 text-sm transition-colors hover:bg-background">
            <Download className="h-4 w-4" />
            导出数据 (JSON)
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-card-border px-4 py-2 text-sm transition-colors hover:bg-background">
            <Upload className="h-4 w-4" />
            导入数据 (JSON)
          </button>
        </div>
      </div>

      {/* Default Settings */}
      <div className="rounded-xl border border-card-border bg-card-bg p-5">
        <h2 className="text-sm font-semibold">默认设置</h2>
        <div className="mt-4 space-y-4 text-sm">
          <div>
            <label className="block text-muted">默认项目类型</label>
            <select className="mt-1 w-48 rounded-lg border border-card-border bg-white px-3 py-2 text-sm outline-none focus:border-accent">
              <option value="code">代码</option>
              <option value="design">设计</option>
              <option value="writing">写作</option>
              <option value="learning">学习</option>
              <option value="resource">资料</option>
              <option value="life">生活</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div>
            <label className="block text-muted">默认项目状态</label>
            <select className="mt-1 w-48 rounded-lg border border-card-border bg-white px-3 py-2 text-sm outline-none focus:border-accent">
              <option value="idea">想法</option>
              <option value="active">进行中</option>
              <option value="paused">暂停</option>
            </select>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="rounded-xl border border-card-border bg-card-bg p-5">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted" />
          <h2 className="text-sm font-semibold">应用信息</h2>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">版本</span>
            <span>1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">框架</span>
            <span>Next.js + SQLite</span>
          </div>
        </div>
      </div>
    </div>
  );
}
