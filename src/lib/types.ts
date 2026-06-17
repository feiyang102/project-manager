// 项目状态
export type ProjectStatus = "idea" | "active" | "paused" | "done" | "archived";

// 项目类型
export type ProjectType = "code" | "design" | "writing" | "learning" | "resource" | "life" | "other";

// 优先级
export type Priority = "low" | "medium" | "high";

// 文件收藏类型
export type FileItemKind = "file" | "folder" | "repo" | "document" | "image" | "video" | "audio" | "archive" | "other";

// 项目
export type Project = {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  type: ProjectType;
  localPath?: string;
  techStack?: string[];
  priority?: Priority;
  tagIds: string[];
  startedAt?: string;
  targetAt?: string;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
};

// 文件收藏
export type FileItem = {
  id: string;
  name: string;
  kind: FileItemKind;
  path: string;
  description?: string;
  projectId?: string;
  tagIds: string[];
  size?: number;
  exists: boolean;
  archived: boolean;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
};

// 标签
export type Tag = {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
};

// 笔记
export type Note = {
  id: string;
  projectId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

// 链接
export type Link = {
  id: string;
  projectId?: string;
  title: string;
  url: string;
  description?: string;
  tagIds: string[];
  createdAt: string;
  updatedAt: string;
};

// 状态标签映射（用于 UI 展示）
export const STATUS_LABELS: Record<ProjectStatus, string> = {
  idea: "想法",
  active: "进行中",
  paused: "暂停",
  done: "完成",
  archived: "归档",
};

export const TYPE_LABELS: Record<ProjectType, string> = {
  code: "代码",
  design: "设计",
  writing: "写作",
  learning: "学习",
  resource: "资料",
  life: "生活",
  other: "其他",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

export const KIND_LABELS: Record<FileItemKind, string> = {
  file: "文件",
  folder: "文件夹",
  repo: "代码仓库",
  document: "文档",
  image: "图片",
  video: "视频",
  audio: "音频",
  archive: "压缩包",
  other: "其他",
};
