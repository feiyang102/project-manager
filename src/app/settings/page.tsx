"use client";

import { useRef } from "react";
import { Download, Upload, Database, Info } from "lucide-react";
import { useProjects, useFileItems, useTags, useToast } from "@/lib/use-store";
import { exportData, importData } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { AppData } from "@/lib/store";

export default function SettingsPage() {
  const projects = useProjects();
  const files = useFileItems();
  const tags = useTags();
  const { show } = useToast();
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
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">设置</h1>
        <p className="mt-1 text-sm text-muted-foreground">管理应用配置</p>
      </div>

      {/* Data Storage */}
      <Card>
        <CardHeader className="flex-row items-center gap-2 pb-3">
          <Database className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm">数据存储</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">存储方式</span>
            <span className="text-xs">localStorage（浏览器本地存储）</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">项目数量</span>
            <span>{projects.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">文件收藏数量</span>
            <span>{files.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">标签数量</span>
            <span>{tags.length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Import/Export */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">导入导出</CardTitle>
          <p className="text-xs text-muted-foreground">导出所有数据为 JSON 文件备份，或从备份文件恢复</p>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" />
            导出数据 (JSON)
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            导入数据 (JSON)
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Default Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">默认设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="space-y-2">
            <Label>默认项目类型</Label>
            <Select defaultValue="code">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="code">代码</SelectItem>
                <SelectItem value="design">设计</SelectItem>
                <SelectItem value="writing">写作</SelectItem>
                <SelectItem value="learning">学习</SelectItem>
                <SelectItem value="resource">资料</SelectItem>
                <SelectItem value="life">生活</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>默认项目状态</Label>
            <Select defaultValue="idea">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">想法</SelectItem>
                <SelectItem value="active">进行中</SelectItem>
                <SelectItem value="paused">暂停</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardHeader className="flex-row items-center gap-2 pb-3">
          <Info className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm">应用信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">版本</span>
            <span>1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">框架</span>
            <span>Next.js + Tauri</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">UI</span>
            <span>shadcn/ui + Tailwind CSS</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">存储</span>
            <span>localStorage</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
