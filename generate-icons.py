#!/usr/bin/env python3
"""Generate app icons from icon.svg for the Tauri desktop application.

Uses macOS qlmanage to rasterize SVG, then Pillow to resize into all required formats.
"""

import os
import shutil
import subprocess
import tempfile
from PIL import Image


def svg_to_png(svg_path, size=1024):
    """Convert SVG to PNG using macOS qlmanage."""
    tmpdir = tempfile.mkdtemp()
    try:
        subprocess.run(
            ['qlmanage', '-t', '-s', str(size), '-o', tmpdir, svg_path],
            check=True, capture_output=True,
        )
        png_path = os.path.join(tmpdir, 'icon.svg.png')
        img = Image.open(png_path)
        img.load()
        return img.copy()
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


def main():
    icons_dir = os.path.join(os.path.dirname(__file__), 'src-tauri', 'icons')
    svg_path = os.path.join(icons_dir, 'icon.svg')
    os.makedirs(icons_dir, exist_ok=True)

    if not os.path.exists(svg_path):
        print(f'Error: {svg_path} not found')
        return

    print(f'Rasterizing {svg_path} ...')
    source = svg_to_png(svg_path, size=1024)
    print(f'  Source: {source.size[0]}x{source.size[1]} {source.mode}')

    # Generate individual PNGs
    sizes = {
        '32x32.png': 32,
        '128x128.png': 128,
        '128x128@2x.png': 256,
        'icon.png': 512,
    }

    for filename, size in sizes.items():
        img = source.resize((size, size), Image.LANCZOS)
        filepath = os.path.join(icons_dir, filename)
        img.save(filepath, 'PNG')
        print(f'  Created {filename} ({size}x{size})')

    # .ico (Windows)
    ico_sizes = [16, 24, 32, 48, 64, 128, 256]
    ico_path = os.path.join(icons_dir, 'icon.ico')
    source.resize((256, 256), Image.LANCZOS).save(
        ico_path, format='ICO', sizes=[(sz, sz) for sz in ico_sizes]
    )
    print('  Created icon.ico')

    # .icns (macOS)
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
        img = source.resize((sz, sz), Image.LANCZOS)
        img.save(os.path.join(iconset_dir, name), 'PNG')

    icns_path = os.path.join(icons_dir, 'icon.icns')
    ret = os.system(f'iconutil -c icns "{iconset_dir}" -o "{icns_path}" 2>/dev/null')
    if ret == 0:
        print('  Created icon.icns')
    else:
        print('  Warning: icon.icns creation failed (iconutil not available?)')
    shutil.rmtree(iconset_dir, ignore_errors=True)

    print('\nDone!')


if __name__ == '__main__':
    main()
