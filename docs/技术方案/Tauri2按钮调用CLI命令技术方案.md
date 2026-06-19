# Tauri 2 按钮调用 CLI 命令完整方案

## 需求

项目列表中每个项目右侧增加 Qoder 按钮（Terminal 图标），点击后以项目 `localPath` 为工作目录打开 Qoder。

## 完整调用链路

```
按钮 click → openInQoder(path) → Command.create("shell", ["-ic", `qoder "${path}"`]).execute()
                                     ↓
                              /bin/zsh -ic "qoder /path/to/project"
                                     ↓
                              zsh 加载 .zshrc → 解析 alias qoder → 启动 Qoder.app
```

## 涉及文件

| 文件 | 作用 |
|------|------|
| `src/app/projects/page.tsx` | 项目列表 UI，Terminal 按钮，常显（非 hover） |
| `src/lib/open-folder.ts` | `openInQoder()` 封装，调用 Command.create |
| `src-tauri/capabilities/default.json` | shell:allow-execute 权限 + /bin/zsh scope |
| `src-tauri/Cargo.toml` | 依赖 `tauri-plugin-shell = "2"` |

## 踩坑与修复

### 错误 1：`open("qoder", [path])` 类型报错

- **现象**：TS 报 `类型"string[]"不能赋给类型"string"`
- **原因**：`@tauri-apps/plugin-shell` 的 `open(path, openWith?)` 签名只接受两个 string，不支持参数数组。它的设计用途是"用指定程序打开文件"，不是执行命令
- **修复**：改用 `Command.create(program, args).execute()`

### 错误 2：`Command.create("qoder", [path])` → No such file or directory (os error 2)

- **现象**：点击按钮后控制台报 `Qoder 打开失败: No such file or directory`
- **原因**：Tauri GUI 应用从 Dock/Finder 启动，**不继承用户 shell 的 PATH 和 alias**。`qoder` 在终端是 alias 指向 `/Applications/Qoder.app/.../code`，但 GUI 进程的 PATH 中没有这个路径
- **错误尝试**：用绝对路径硬编码 → 能跑但不通用，换安装路径就挂
- **最终修复**：通过 `/bin/zsh -ic "qoder <path>"` 执行，`-i` 使 zsh 作为交互式 shell 启动并加载 `.zshrc`，alias 和 PATH 都生效

### 错误 3：shell scope 中 cmd 写 "qoder" 被拒绝

- **现象**：capabilities 配置 `{"cmd": "qoder"}` 无效
- **原因**：Tauri shell scope 的 `cmd` 字段必须是可执行文件的**绝对路径**，不支持命令名或 alias
- **修复**：scope 中允许 `/bin/zsh`（macOS 自带，路径固定），由 zsh 负责解析实际命令

## 最终配置

### capabilities/default.json

```json
{
  "permissions": [
    "shell:allow-execute",
    {
      "identifier": "shell:allow-execute",
      "allow": [
        { "name": "shell", "cmd": "/bin/zsh", "args": true }
      ]
    }
  ]
}
```

### open-folder.ts

```ts
import { Command } from "@tauri-apps/plugin-shell";

/**
 * 使用 qoder 命令打开指定路径
 * 通过 /bin/zsh -ic 执行，支持用户 shell 环境中的 alias 和 PATH
 */
export async function openInQoder(path: string) {
  try {
    const result = await Command.create("shell", ["-ic", `qoder "${path}"`]).execute();
    if (result.code !== 0) {
      console.error(`Qoder 打开失败 [path=${path}]: exit ${result.code}, stderr: ${result.stderr}`);
    }
  } catch (e) {
    console.error(`Qoder 打开失败 [path=${path}]:`, e);
  }
}
```

### projects/page.tsx（按钮部分）

```tsx
import { Terminal } from "lucide-react";
import { openInQoder } from "@/lib/open-folder";

{project.localPath && (
  <button
    onClick={(e) => { e.stopPropagation(); openInQoder(project.localPath!); }}
    className="rounded p-1.5 text-muted transition-opacity hover:bg-background hover:text-accent"
    title="用 Qoder 打开"
  >
    <Terminal className="h-4 w-4" />
  </button>
)}
```

## 关键结论

| 要点 | 说明 |
|------|------|
| `open()` vs `Command.create()` | `open` 只能打开文件，不支持传参；执行命令必须用 `Command.create` |
| GUI PATH 问题 | macOS GUI 应用不继承 shell PATH/alias，必须用 `zsh -ic` 中转 |
| shell scope 约束 | `cmd` 字段必须是绝对路径，用 `/bin/zsh` 作为通用入口 |
| `-ic` 而非 `-c` | `-i` 确保加载 `.zshrc` 中的 alias 和 PATH |
| 权限缺一不可 | `shell:allow-execute` 权限声明 + scope allow 配置都要有 |
