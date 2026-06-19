import type {
  Project,
  FileItem,
  Tag,
  Note,
  Link,
  ProjectStatus,
  FileItemKind,
} from "./types";

// ============ Storage Keys ============
const KEYS = {
  projects: "app_projects",
  files: "app_files",
  tags: "app_tags",
  notes: "app_notes",
  links: "app_links",
  recent: "app_recent",
} as const;

// ============ Custom Event ============
const STORAGE_EVENT = "app-data-change";

function emitChange() {
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

// ============ Helpers ============
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
  emitChange();
}

function now(): string {
  return new Date().toISOString();
}

// ============ Projects ============
export function listProjects(): Project[] {
  return read<Project>(KEYS.projects);
}

export function getProject(id: string): Project | undefined {
  return listProjects().find((p) => p.id === id);
}

export function createProject(
  data: Omit<Project, "id" | "createdAt" | "updatedAt">
): Project {
  const projects = listProjects();
  const project: Project = { ...data, id: generateId(), createdAt: now(), updatedAt: now() };
  projects.push(project);
  write(KEYS.projects, projects);
  return project;
}

export function updateProject(id: string, data: Partial<Project>): Project | undefined {
  const projects = listProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  projects[idx] = { ...projects[idx], ...data, updatedAt: now() };
  write(KEYS.projects, projects);
  return projects[idx];
}

export function deleteProject(id: string) {
  write(KEYS.projects, listProjects().filter((p) => p.id !== id));
  // Also delete related notes and links
  write(KEYS.notes, listNotes().filter((n) => n.projectId !== id));
  write(KEYS.links, listLinks().filter((l) => l.projectId !== id));
}

export function archiveProject(id: string) {
  updateProject(id, { status: "archived" });
}

export function restoreProject(id: string, status: ProjectStatus = "active") {
  updateProject(id, { status });
}

// ============ FileItems ============
export function listFileItems(): FileItem[] {
  return read<FileItem>(KEYS.files);
}

export function getFileItem(id: string): FileItem | undefined {
  return listFileItems().find((f) => f.id === id);
}

export function createFileItem(
  data: Omit<FileItem, "id" | "createdAt" | "updatedAt">
): FileItem {
  const items = listFileItems();
  const item: FileItem = { ...data, id: generateId(), createdAt: now(), updatedAt: now() };
  items.push(item);
  write(KEYS.files, items);
  return item;
}

export function updateFileItem(id: string, data: Partial<FileItem>): FileItem | undefined {
  const items = listFileItems();
  const idx = items.findIndex((f) => f.id === id);
  if (idx === -1) return undefined;
  items[idx] = { ...items[idx], ...data, updatedAt: now() };
  write(KEYS.files, items);
  return items[idx];
}

export function deleteFileItem(id: string) {
  write(KEYS.files, listFileItems().filter((f) => f.id !== id));
}

export function archiveFileItem(id: string) {
  updateFileItem(id, { archived: true });
}

export function restoreFileItem(id: string) {
  updateFileItem(id, { archived: false });
}

// ============ Tags ============
export function listTags(): Tag[] {
  return read<Tag>(KEYS.tags);
}

export function getTag(id: string): Tag | undefined {
  return listTags().find((t) => t.id === id);
}

export function createTag(data: Omit<Tag, "id" | "createdAt" | "updatedAt">): Tag {
  const tags = listTags();
  const tag: Tag = { ...data, id: generateId(), createdAt: now(), updatedAt: now() };
  tags.push(tag);
  write(KEYS.tags, tags);
  return tag;
}

export function updateTag(id: string, data: Partial<Tag>): Tag | undefined {
  const tags = listTags();
  const idx = tags.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;
  tags[idx] = { ...tags[idx], ...data, updatedAt: now() };
  write(KEYS.tags, tags);
  return tags[idx];
}

export function deleteTag(id: string) {
  write(KEYS.tags, listTags().filter((t) => t.id !== id));
  // Remove tag from projects and files
  const projects = listProjects().map((p) => ({
    ...p,
    tagIds: p.tagIds.filter((tid) => tid !== id),
  }));
  write(KEYS.projects, projects);
  const files = listFileItems().map((f) => ({
    ...f,
    tagIds: f.tagIds.filter((tid) => tid !== id),
  }));
  write(KEYS.files, files);
}

// ============ Notes ============
export function listNotes(projectId?: string): Note[] {
  const notes = read<Note>(KEYS.notes);
  return projectId ? notes.filter((n) => n.projectId === projectId) : notes;
}

export function createNote(data: Omit<Note, "id" | "createdAt" | "updatedAt">): Note {
  const notes = read<Note>(KEYS.notes);
  const note: Note = { ...data, id: generateId(), createdAt: now(), updatedAt: now() };
  notes.push(note);
  write(KEYS.notes, notes);
  return note;
}

export function updateNote(id: string, data: Partial<Note>): Note | undefined {
  const notes = read<Note>(KEYS.notes);
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return undefined;
  notes[idx] = { ...notes[idx], ...data, updatedAt: now() };
  write(KEYS.notes, notes);
  return notes[idx];
}

export function deleteNote(id: string) {
  write(KEYS.notes, read<Note>(KEYS.notes).filter((n) => n.id !== id));
}

// ============ Links ============
export function listLinks(projectId?: string): Link[] {
  const links = read<Link>(KEYS.links);
  return projectId ? links.filter((l) => l.projectId === projectId) : links;
}

export function createLink(data: Omit<Link, "id" | "createdAt" | "updatedAt">): Link {
  const links = read<Link>(KEYS.links);
  const link: Link = { ...data, id: generateId(), createdAt: now(), updatedAt: now() };
  links.push(link);
  write(KEYS.links, links);
  return link;
}

export function updateLink(id: string, data: Partial<Link>): Link | undefined {
  const links = read<Link>(KEYS.links);
  const idx = links.findIndex((l) => l.id === id);
  if (idx === -1) return undefined;
  links[idx] = { ...links[idx], ...data, updatedAt: now() };
  write(KEYS.links, links);
  return links[idx];
}

export function deleteLink(id: string) {
  write(KEYS.links, read<Link>(KEYS.links).filter((l) => l.id !== id));
}

// ============ Recent Access ============
export type RecentItem = {
  id: string;
  type: "project" | "file";
  targetId: string;
  name: string;
  accessedAt: string;
};

export function listRecent(): RecentItem[] {
  return read<RecentItem>(KEYS.recent).sort(
    (a, b) => new Date(b.accessedAt).getTime() - new Date(a.accessedAt).getTime()
  );
}

export function addRecent(type: "project" | "file", targetId: string, name: string) {
  const items = read<RecentItem>(KEYS.recent).filter(
    (r) => !(r.type === type && r.targetId === targetId)
  );
  items.unshift({
    id: generateId(),
    type,
    targetId,
    name,
    accessedAt: now(),
  });
  // Keep max 50 items
  write(KEYS.recent, items.slice(0, 50));
}

export function clearRecent() {
  write(KEYS.recent, []);
}

// ============ Search ============
export type SearchResult = {
  type: "project" | "file" | "tag" | "note" | "link";
  id: string;
  title: string;
  subtitle?: string;
};

export function searchAll(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const p of listProjects()) {
    if (
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.localPath?.toLowerCase().includes(q)
    ) {
      results.push({ type: "project", id: p.id, title: p.name, subtitle: p.description });
    }
  }

  for (const f of listFileItems()) {
    if (
      f.name.toLowerCase().includes(q) ||
      f.description?.toLowerCase().includes(q) ||
      f.path.toLowerCase().includes(q)
    ) {
      results.push({ type: "file", id: f.id, title: f.name, subtitle: f.path });
    }
  }

  for (const t of listTags()) {
    if (t.name.toLowerCase().includes(q)) {
      results.push({ type: "tag", id: t.id, title: t.name });
    }
  }

  for (const n of listNotes()) {
    if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
      results.push({ type: "note", id: n.id, title: n.title, subtitle: n.content.slice(0, 60) });
    }
  }

  for (const l of listLinks()) {
    if (l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)) {
      results.push({ type: "link", id: l.id, title: l.title, subtitle: l.url });
    }
  }

  return results;
}

// ============ Import / Export ============
export type AppData = {
  projects: Project[];
  files: FileItem[];
  tags: Tag[];
  notes: Note[];
  links: Link[];
  recent: RecentItem[];
};

export function exportData(): AppData {
  return {
    projects: listProjects(),
    files: listFileItems(),
    tags: listTags(),
    notes: listNotes(),
    links: listLinks(),
    recent: listRecent(),
  };
}

export function importData(data: AppData) {
  write(KEYS.projects, data.projects || []);
  write(KEYS.files, data.files || []);
  write(KEYS.tags, data.tags || []);
  write(KEYS.notes, data.notes || []);
  write(KEYS.links, data.links || []);
  write(KEYS.recent, data.recent || []);
}

// ============ Tag usage count ============
export function getTagUsageCount(tagId: string): number {
  const projectCount = listProjects().filter((p) => p.tagIds.includes(tagId)).length;
  const fileCount = listFileItems().filter((f) => f.tagIds.includes(tagId)).length;
  return projectCount + fileCount;
}

// ============ Subscribe to changes ============
export function onDataChange(callback: () => void): () => void {
  window.addEventListener(STORAGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(STORAGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
