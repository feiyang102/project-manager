# 数据模型、文件系统与安全

> 所属 PRD：[本地项目与文件夹管理后台 PRD](../PRD.md)

## 9. 文件系统能力

### 9.1 V1.0 必需能力

- 检查路径是否存在。
- 打开文件或文件夹。
- 复制路径到剪贴板。
- 读取基础文件信息，例如名称、大小、类型、修改时间。

### 9.2 后续扩展能力

- 扫描指定目录并批量导入。
- 识别 Git 仓库状态。
- 读取 README / package.json 等项目元数据。
- 检测重复收藏。
- 生成文件夹内容摘要。

## 10. 数据模型草案

### 10.1 Project

```ts
type Project = {
  id: string;
  name: string;
  description?: string;
  status: "idea" | "active" | "paused" | "done" | "archived";
  type: "code" | "design" | "writing" | "learning" | "resource" | "life" | "other";
  localPath?: string;
  techStack?: string[];
  priority?: "low" | "medium" | "high";
  tagIds: string[];
  startedAt?: string;
  targetAt?: string;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
};
```

### 10.2 FileItem

```ts
type FileItem = {
  id: string;
  name: string;
  kind: "file" | "folder" | "repo" | "document" | "image" | "video" | "audio" | "archive" | "other";
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
```

### 10.3 Tag

```ts
type Tag = {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
};
```

### 10.4 Note

```ts
type Note = {
  id: string;
  projectId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
```

### 10.5 Link

```ts
type Link = {
  id: string;
  projectId?: string;
  title: string;
  url: string;
  description?: string;
  tagIds: string[];
  createdAt: string;
  updatedAt: string;
};
```

## 13. 权限与安全

- 应用默认运行在本地，数据默认存储在本机。
- 不上传用户文件路径、笔记、项目内容到云端。
- 打开本地文件或执行系统操作前，需要明确由用户触发。
- 删除记录默认只删除应用中的元数据，不删除真实文件。
- 如未来支持删除真实文件，必须单独设计强确认流程。
