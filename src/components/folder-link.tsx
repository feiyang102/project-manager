"use client";

import { FolderOpen } from "lucide-react";
import { openFolder } from "@/lib/open-folder";

interface FolderLinkProps {
  path: string;
  className?: string;
}

/**
 * 可点击的文件夹路径组件
 * 点击后会在系统文件管理器中打开该路径
 */
export function FolderLink({ path, className = "" }: FolderLinkProps) {
  return (
    <button
      onClick={() => openFolder(path)}
      className={`flex items-center gap-2 rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm transition-colors hover:bg-background hover:border-accent/50 ${className}`}
      title={`在 Finder 中打开: ${path}`}
    >
      <FolderOpen className="h-4 w-4 shrink-0 text-accent" />
      <span className="truncate">{path}</span>
    </button>
  );
}
