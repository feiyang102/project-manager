import { openPath } from "@tauri-apps/plugin-opener";

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
