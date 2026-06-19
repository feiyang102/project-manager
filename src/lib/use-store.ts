"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import {
  listProjects,
  listFileItems,
  listTags,
  listNotes,
  listLinks,
  listRecent,
  searchAll,
  getTagUsageCount,
  onDataChange,
  type SearchResult,
  type RecentItem,
} from "./store";
import type { Project, FileItem, Tag, Note, Link } from "./types";

// ============ Mounted guard (avoid hydration mismatch) ============
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

// ============ Core hook: subscribe to data changes ============
let snapshot = 0;
function subscribe(cb: () => void) {
  return onDataChange(() => {
    snapshot++;
    cb();
  });
}
function getSnapshot() {
  return snapshot;
}

function useDataVersion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => 0);
}

// ============ Projects ============
export function useProjects(): Project[] {
  const mounted = useMounted();
  useDataVersion();
  return mounted ? listProjects() : [];
}

// ============ FileItems ============
export function useFileItems(): FileItem[] {
  const mounted = useMounted();
  useDataVersion();
  return mounted ? listFileItems() : [];
}

// ============ Tags ============
export function useTags(): Tag[] {
  const mounted = useMounted();
  useDataVersion();
  return mounted ? listTags() : [];
}

// ============ Notes ============
export function useNotes(projectId?: string): Note[] {
  const mounted = useMounted();
  useDataVersion();
  return mounted ? listNotes(projectId) : [];
}

// ============ Links ============
export function useLinks(projectId?: string): Link[] {
  const mounted = useMounted();
  useDataVersion();
  return mounted ? listLinks(projectId) : [];
}

// ============ Recent ============
export function useRecent(): RecentItem[] {
  const mounted = useMounted();
  useDataVersion();
  return mounted ? listRecent() : [];
}

// ============ Tag usage ============
export function useTagUsageCount(tagId: string): number {
  const mounted = useMounted();
  useDataVersion();
  return mounted ? getTagUsageCount(tagId) : 0;
}

// ============ Search ============
export function useSearch(query: string): SearchResult[] {
  const mounted = useMounted();
  useDataVersion();
  return mounted ? searchAll(query) : [];
}

// ============ Toast (sonner) ============
import { toast as sonnerToast } from "sonner";

export type ToastMsg = { message: string; type: "success" | "error" | "info" };

export function useToast() {
  const show = useCallback((message: string, type: ToastMsg["type"] = "success") => {
    switch (type) {
      case "error":
        sonnerToast.error(message);
        break;
      case "info":
        sonnerToast(message);
        break;
      default:
        sonnerToast.success(message);
    }
  }, []);

  return { toast: null as ToastMsg | null, show };
}
