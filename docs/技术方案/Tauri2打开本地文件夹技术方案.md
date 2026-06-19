# Tauri 2 打开本地文件夹技术方案

## 问题背景

在 Tauri 2.x 中，使用 `@tauri-apps/plugin-shell` 的 `open()` 函数打开本地文件夹路径时，会报错：

```
Scoped command argument at position 0 was found, but failed regex validation ^((mailto:\w+)|(tel:\w+)|(https?://\w+)).+
```

**根本原因**：shell 插件的 `open()` 函数仅支持 URL 协议（`http://`、`https://`、`mailto:`、`tel:`），不支持本地文件系统路径。

## 解决方案

使用 Tauri 2 官方的 **`@tauri-apps/plugin-opener`** 插件，其提供的 `openPath()` 函数专门用于打开本地文件/文件夹路径。

## 实施步骤

### 1. 安装 Rust 依赖

在 `src-tauri/Cargo.toml` 中添加：

```toml
[dependencies]
tauri-plugin-opener = "2"
```

### 2. 安装前端依赖

```bash
pnpm add @tauri-apps/plugin-opener
```

### 3. 注册插件

在 `src-tauri/src/lib.rs` 中注册 opener 插件：

```rust
tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_opener::init())  // 新增
    .run(tauri::generate_context!())
```

### 4. 配置权限

在 `src-tauri/capabilities/default.json` 中添加权限和路径 scope：

```json
{
  "permissions": [
    "core:default",
    "shell:allow-open",
    "opener:default",
    {
      "identifier": "opener:allow-open-path",
      "allow": [
        { "path": "/**" },
        { "path": "$HOME/**" },
        { "path": "$DOCUMENT/**" },
        { "path": "$DESKTOP/**" },
        { "path": "$DOWNLOAD/**" }
      ]
    }
  ]
}
```

**关键说明**：
- `opener:default` 不包含 `open-path` 命令权限，必须显式添加 `opener:allow-open-path`
- Tauri 2 要求通过 scope 声明允许打开的路径范围，否则即使有命令权限也会报 `Not allowed to open path` 错误
- `/**` 通配模式允许打开任意绝对路径
- `$HOME/**`、`$DOCUMENT/**` 等是 Tauri 的环境变量占位符

### 5. 前端调用

将 `open-folder.ts` 改为使用 opener 插件：

```typescript
import { openPath } from "@tauri-apps/plugin-opener";

export async function openFolder(path: string) {
  try {
    await openPath(path);
  } catch (e) {
    console.error("打开文件夹失败:", e);
  }
}
```

## 踩坑记录

| 问题 | 原因 | 解决 |
|------|------|------|
| `open()` 报 regex 校验失败 | shell 插件只支持 URL | 改用 opener 插件的 `openPath()` |
| `opener.open_path not allowed` | 缺少 `opener:allow-open-path` 权限 | 在 capabilities 中显式添加该权限 |
| `Not allowed to open path /xxx` | 缺少路径 scope 配置 | 添加 `allow` scope 声明允许的路径范围 |

## 插件对比

| 特性 | `@tauri-apps/plugin-shell` | `@tauri-apps/plugin-opener` |
|------|---------------------------|-----------------------------|
| 打开 URL | 支持 | 支持 |
| 打开本地路径 | 不支持 | 支持（`openPath`） |
| 执行命令 | 支持 | 不支持 |
| 路径 scope | 不需要 | 需要配置 |
