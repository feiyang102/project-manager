import { openPath } from "@tauri-apps/plugin-opener";
import { Command } from "@tauri-apps/plugin-shell";

/**
 * 在系统文件管理器中打开指定文件夹路径
 * @param path - 要打开的文件夹绝对路径
 */
export async function openFolder(path: string) {
  try {
    await openPath(path);
  } catch (e) {
    console.error("打开文件夹失败:", e);
  }
}

/**
 * 使用 qoder 命令打开指定路径
 * 通过 /bin/zsh -ic 执行，支持用户 shell 环境中的 alias 和 PATH
 * @param path - 要打开的目录绝对路径
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
