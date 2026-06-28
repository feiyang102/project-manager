# 图标生成工具 (generate-icons.py)

从 SVG 或 PNG 源图自动生成 Tauri 桌面应用所需的全套图标（PNG / ICO / ICNS）。

## 功能特性

- **双输入支持**：SVG 和 PNG 均可直接作为源图
- **自动裁剪留白**：检测内容边界，去掉四周空白，解决图标偏移、未填满问题
- **居中填充**：内容精确居中并缩放填充至正方形画布
- **透明背景修复**：移除 qlmanage 渲染 SVG 时注入的纯色背景，恢复透明
- **三种填充模式**：fill（完全填充）/ contain（保持比例）/ cover（裁切填充）

## 依赖

| 依赖 | 用途 | 安装 |
|------|------|------|
| Pillow (PIL) | PNG 处理、裁剪、缩放（必需） | `pip install Pillow` |
| iconutil | 生成 .icns（macOS 内置） | 系统自带 |
| rsvg-convert | SVG 渲染（推荐，保留透明） | `brew install librsvg` |
| cairosvg | SVG 渲染（备选，需 Cairo 库） | `pip install cairosvg` |
| qlmanage | SVG 渲染（macOS 兜底，会填白底） | 系统自带 |

> SVG 渲染引擎按优先级自动选择：rsvg-convert > cairosvg > qlmanage。
> 若只有 qlmanage 可用，渲染透明 SVG 会填白底，请配合 `--transparent-bg` 使用。

## 用法

从项目根目录执行：

```bash
# 基本用法（SVG 或 PNG）
python3 tools/generate-icons/generate-icons.py <源图.svg|源图.png>

# 指定输出目录
python3 tools/generate-icons/generate-icons.py icon.svg -o src-tauri/icons/

# SVG 指定渲染分辨率（默认 1024）
python3 tools/generate-icons/generate-icons.py icon.svg --svg-size 2048

# 移除纯色背景（恢复透明，解决 qlmanage 白底问题）
python3 tools/generate-icons/generate-icons.py icon.svg --transparent-bg

# 指定背景移除容差（默认 30，值越大移除范围越广）
python3 tools/generate-icons/generate-icons.py icon.svg --transparent-bg 40

# 不裁剪留白
python3 tools/generate-icons/generate-icons.py icon.png --no-trim

# 裁剪后保留边距
python3 tools/generate-icons/generate-icons.py icon.png --padding 16

# 指定填充模式
python3 tools/generate-icons/generate-icons.py icon.png --fit contain
```

## 参数说明

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `source` | 源图路径（.svg 或 .png） | 必填 |
| `-o, --output-dir` | 输出目录 | 源图同目录 |
| `--svg-size` | SVG 渲染分辨率 | 1024 |
| `--transparent-bg [TOLERANCE]` | 移除纯色背景恢复透明，可选容差 | 30 |
| `--no-trim` | 不裁剪留白 | 裁剪 |
| `--padding N` | 裁剪后保留 N 像素边距 | 0 |
| `--fit` | 填充模式：fill / contain / cover | fill |

## 填充模式

| 模式 | 行为 | 适用场景 |
|------|------|----------|
| `fill` | 拉伸完全填充画布 | 内容近似正方形，要求 100% 填满 |
| `contain` | 保持比例，短边留透明 | 内容非正方形，要求不变形 |
| `cover` | 缩放填满并裁切溢出 | 内容非正方形，要求填满且不变形 |

## 输出文件

| 文件 | 尺寸 | 用途 |
|------|------|------|
| `32x32.png` | 32×32 | 小尺寸图标 |
| `128x128.png` | 128×128 | 标准图标 |
| `128x128@2x.png` | 256×256 | Retina 2x 图标 |
| `icon.png` | 512×512 | 主图标 |
| `icon.ico` | 多尺寸 | Windows 应用图标 |
| `icon.icns` | 多尺寸 | macOS 应用图标 |

## 常见问题

### SVG 输出背景变白

qlmanage 渲染透明 SVG 会强制填白底。解决：

```bash
python3 tools/generate-icons/generate-icons.py icon.svg --transparent-bg
```

### 图标偏左上角 / 没填满

脚本默认自动裁剪留白并居中填充。若仍有问题，检查源图内容是否本身偏移。

### 报错 No module named 'PIL'

```bash
pip install Pillow
```
