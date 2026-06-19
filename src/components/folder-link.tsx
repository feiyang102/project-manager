"use client";

import { Button } from "@/components/ui/button";
import { openFolder } from "@/lib/open-folder";
import { FolderOpen } from "lucide-react";

interface FolderLinkProps {
  path: string;
  className?: string;
}

export function FolderLink({ path, className = "" }: FolderLinkProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => openFolder(path)}
      className={`gap-2 font-mono ${className}`}
      title={`在 Finder 中打开: ${path}`}
    >
      <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
      <span className="truncate">{path}</span>
    </Button>
  );
}
