"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
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
  useDataVersion();
  return listProjects();
}

// ============ FileItems ============
export function useFileItems(): FileItem[] {
  useDataVersion();
  return listFileItems();
}

// ============ Tags ============
export function useTags(): Tag[] {
  useDataVersion();
  return listTags();
}

// ============ Notes ============
export function useNotes(projectId?: string): Note[] {
  useDataVersion();
  return listNotes(projectId);
}

// ============ Links ============
export function useLinks(projectId?: string): Link[] {
  useDataVersion();
  return listLinks(projectId);
}

// ============ Recent ============
export function useRecent(): RecentItem[] {
  useDataVersion();
  return listRecent();
}

// ============ Tag usage ============
export function useTagUsageCount(tagId: string): number {
  useDataVersion();
  return getTagUsageCount(tagId);
}

// ============ Search ============
export function useSearch(query: string): SearchResult[] {
  useDataVersion();
  return searchAll(query);
}

// ============ Toast ============
export type ToastMsg = { message: string; type: "success" | "error" | "info" };

export function useToast() {
  const [toast, setToast] = useState<ToastMsg | null>(null);

  const show = useCallback((message: string, type: ToastMsg["type"] = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return { toast, show };
}
