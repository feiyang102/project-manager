"use client";

import { useRef } from "react";
import { Download, Upload, Database, Info } from "lucide-react";
import { useProjects, useFileItems, useTags, useToast } from "@/lib/use-store";
import { exportData, importData } from "@/lib/store";
import { Toast } from "@/components/ui/toast";
import type { AppData } from "@/lib/store";

export default function SettingsPage() {
  const projects = useProjects();
  const files = useFileItems();
  const tags = useTags();
  const { toast, show } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const data = exportData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `admin-panel-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      show("数据已导出");
    } catch {
      show("导出失败", "error");
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as AppData;
        if (!data.projects && !data.files && !data.tags) {
          show("无效的备份文件", "error");
          return;
        }
        if (confirm("导入数据将覆盖当前所有数据，确定继续？")) {
          importData(data);
          show("数据已导入");
        }
      } catch {
        show("文件解析失败", "error");
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again
    e.target.value = "";
  };

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
            <span className="text-muted">存储方式</span>
            <span className="text-xs">localStorage（浏览器本地存储）</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">项目数量</span>
            <span>{projects.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">文件收藏数量</span>
            <span>{files.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">标签数量</span>
            <span>{tags.length}</span>
          </div>
        </div>
      </div>

      {/* Import/Export */}
      <div className="rounded-xl border border-card-border bg-card-bg p-5">
        <h2 className="text-sm font-semibold">导入导出</h2>
        <p className="mt-1 text-xs text-muted">导出所有数据为 JSON 文件备份，或从备份文件恢复</p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg border border-card-border px-4 py-2 text-sm transition-colors hover:bg-background"
          >
            <Download className="h-4 w-4" />
            导出数据 (JSON)
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-card-border px-4 py-2 text-sm transition-colors hover:bg-background"
          >
            <Upload className="h-4 w-4" />
            导入数据 (JSON)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
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
            <span>Next.js + Tauri</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">存储</span>
            <span>localStorage</span>
          </div>
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
