#!/usr/bin/env python3
"""Generate white-background app icons for the Tauri desktop application."""

from PIL import Image, ImageDraw
from io import BytesIO
import os
import shutil

def rounded_rect(draw, xy, radius, fill):
    """Draw a rounded rectangle."""
    x0, y0, x1, y1 = xy
    draw.rectangle([x0 + radius, y0, x1 - radius, y1], fill=fill)
    draw.rectangle([x0, y0 + radius, x1, y1 - radius], fill=fill)
    draw.ellipse([x0, y0, x0 + 2*radius, y0 + 2*radius], fill=fill)
    draw.ellipse([x1 - 2*radius, y0, x1, y0 + 2*radius], fill=fill)
    draw.ellipse([x0, y1 - 2*radius, x0 + 2*radius, y1], fill=fill)
    draw.ellipse([x1 - 2*radius, y1 - 2*radius, x1, y1], fill=fill)

def create_icon(size):
    """Create a clean white-background app icon."""
    scale = 4
    s = size * scale

    icon = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    draw = ImageDraw.Draw(icon)

    # White background with rounded corners
    corner_r = int(s * 0.22)
    rounded_rect(draw, (0, 0, s - 1, s - 1), corner_r, (255, 255, 255, 255))

    # Subtle border
    border_r = corner_r
    draw.rounded_rectangle([0, 0, s - 1, s - 1], radius=border_r, outline=(229, 231, 235, 255), width=max(1, s // 256))

    # === Folder (gray, minimal) ===
    cx, cy = s // 2, int(s * 0.52)
    fw = int(s * 0.40)
    fh = int(s * 0.30)
    fx0 = cx - fw // 2
    fy0 = cy - fh // 2
    fx1 = cx + fw // 2
    fy1 = cy + fh // 2

    folder_r = int(s * 0.02)
    tab_w = int(fw * 0.35)
    tab_h = int(fh * 0.16)

    # Folder tab
    tab_color = (148, 163, 184, 255)  # slate-400
    rounded_rect(draw, (fx0, fy0 - tab_h, fx0 + tab_w, fy0 + int(s * 0.008)), folder_r, tab_color)

    # Folder body
    rounded_rect(draw, (fx0, fy0, fx1, fy1), folder_r, tab_color)

    # Inner white area
    pad = int(s * 0.024)
    inner_r = int(s * 0.012)
    rounded_rect(draw, (fx0 + pad, fy0 + pad, fx1 - pad, fy1 - pad), inner_r, (248, 250, 252, 255))

    # === Kanban bars (colored, slim) ===
    bar_colors = [
        (59, 130, 246, 255),    # blue-500
        (16, 185, 129, 255),    # emerald-500
        (245, 158, 11, 255),    # amber-500
    ]

    bar_area_w = int(fw * 0.48)
    bar_area_x0 = cx - bar_area_w // 2
    bar_width = int(bar_area_w * 0.16)
    bar_gap = (bar_area_w - bar_width * 3) // 2
    bar_bottom = fy1 - pad - int(fh * 0.10)
    bar_heights = [int(fh * 0.28), int(fh * 0.48), int(fh * 0.36)]
    bar_r = int(bar_width * 0.4)

    for i in range(3):
        bx = bar_area_x0 + i * (bar_width + bar_gap)
        bh = bar_heights[i]
        by = bar_bottom - bh
        rounded_rect(draw, (bx, by, bx + bar_width, bar_bottom), bar_r, bar_colors[i])

    # Resize down
    icon = icon.resize((size, size), Image.LANCZOS)
    return icon


def main():
    icons_dir = os.path.join(os.path.dirname(__file__), 'src-tauri', 'icons')
    os.makedirs(icons_dir, exist_ok=True)

    main_icon = create_icon(512)

    sizes = {
        '32x32.png': 32,
        '128x128.png': 128,
        '128x128@2x.png': 256,
        'icon.png': 512,
    }

    for filename, size in sizes.items():
        img = main_icon if size == 512 else main_icon.resize((size, size), Image.LANCZOS)
        filepath = os.path.join(icons_dir, filename)
        img.save(filepath, 'PNG')
        print(f'  Created {filename} ({size}x{size})')

    # .ico
    ico_sizes = [16, 24, 32, 48, 64, 128, 256]
    ico_images = [main_icon.resize((sz, sz), Image.LANCZOS) for sz in ico_sizes]
    ico_path = os.path.join(icons_dir, 'icon.ico')
    ico_images[0].save(ico_path, format='ICO', sizes=[(sz, sz) for sz in ico_sizes])
    print(f'  Created icon.ico')

    # .icns
    iconset_dir = os.path.join(icons_dir, 'icon.iconset')
    os.makedirs(iconset_dir, exist_ok=True)
    icns_specs = [
        ('icon_16x16.png', 16), ('icon_16x16@2x.png', 32),
        ('icon_32x32.png', 32), ('icon_32x32@2x.png', 64),
        ('icon_128x128.png', 128), ('icon_128x128@2x.png', 256),
        ('icon_256x256.png', 256), ('icon_256x256@2x.png', 512),
        ('icon_512x512.png', 512), ('icon_512x512@2x.png', 1024),
    ]
    for name, sz in icns_specs:
        img = main_icon.resize((sz, sz), Image.LANCZOS) if sz <= 512 else create_icon(sz)
        img.save(os.path.join(iconset_dir, name), 'PNG')

    icns_path = os.path.join(icons_dir, 'icon.icns')
    ret = os.system(f'iconutil -c icns "{iconset_dir}" -o "{icns_path}" 2>/dev/null')
    if ret == 0:
        print(f'  Created icon.icns')
    shutil.rmtree(iconset_dir, ignore_errors=True)

    print('\nDone!')

if __name__ == '__main__':
    main()
