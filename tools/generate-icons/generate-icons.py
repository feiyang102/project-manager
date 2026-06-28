#!/usr/bin/env python3
"""Generate PNG/ICO/ICNS icons of all required sizes from SVG or PNG source.

Reads a source SVG or PNG image and generates:
  - Various PNG sizes for the Tauri desktop app
  - icon.ico (Windows)
  - icon.icns (macOS, requires iconutil)

SVG input is first rasterized to a high-res PNG master, then both paths share
the same Pillow pipeline: auto-trim margins (transparent or solid-color) and
fill the content into every output size, so icons are never offset and never
carry empty borders.

Usage:
  python3 generate-icons.py <source.svg|source.png>
  python3 generate-icons.py <source.svg> --svg-size 1024
  python3 generate-icons.py <source.svg> --transparent-bg
  python3 generate-icons.py <source.png> --output-dir <dir>
  python3 generate-icons.py <source.png> --no-trim
  python3 generate-icons.py <source.png> --padding 16
  python3 generate-icons.py <source.png> --fit contain
"""

from PIL import Image, ImageChops
import argparse
import os
import shutil
import subprocess
import sys
import tempfile

# Output PNG sizes (filename -> width/height)
PNG_SIZES = {
    "32x32.png": 32,
    "128x128.png": 128,
    "128x128@2x.png": 256,
    "icon.png": 512,
}

# ICO sizes (Windows)
ICO_SIZES = [16, 24, 32, 48, 64, 128, 256]

# ICNS sizes (macOS iconset)
ICNS_SIZES = [
    ("icon_16x16.png", 16),
    ("icon_16x16@2x.png", 32),
    ("icon_32x32.png", 32),
    ("icon_32x32@2x.png", 64),
    ("icon_128x128.png", 128),
    ("icon_128x128@2x.png", 256),
    ("icon_256x256.png", 256),
    ("icon_256x256@2x.png", 512),
    ("icon_512x512.png", 512),
    ("icon_512x512@2x.png", 1024),
]


def render_svg_to_png(svg_path: str, size: int, output_path: str) -> bool:
    """Render an SVG file to a PNG using the best available engine.

    Engine priority (first that works wins):
      1. rsvg-convert  - best at preserving transparency (Homebrew librsvg)
      2. cairosvg      - cross-platform, needs system Cairo libs
      3. qlmanage       - macOS built-in fallback
    Returns True on success, False if no engine is available.
    """
    # 1. rsvg-convert
    if shutil.which("rsvg-convert"):
        try:
            subprocess.run(
                ["rsvg-convert", "-w", str(size), "-h", str(size),
                 "-o", output_path, svg_path],
                check=True, capture_output=True,
            )
            if os.path.exists(output_path):
                return True
        except Exception:
            pass

    # 2. cairosvg
    try:
        import cairosvg
        cairosvg.svg2png(url=svg_path, write_to=output_path,
                         output_width=size, output_height=size)
        if os.path.exists(output_path):
            return True
    except Exception:
        pass

    # 3. qlmanage (macOS fallback)
    if shutil.which("qlmanage"):
        tmp_dir = tempfile.mkdtemp(prefix="icon_svg_")
        target = os.path.join(tmp_dir, os.path.basename(svg_path))
        shutil.copy2(svg_path, target)
        try:
            subprocess.run(
                ["qlmanage", "-t", "-s", str(size), "-o", tmp_dir, target],
                check=True, capture_output=True,
            )
            result = os.path.join(tmp_dir, os.path.basename(svg_path) + ".png")
            if os.path.exists(result):
                Image.open(result).save(output_path, "PNG")
                return True
        except Exception:
            pass
        finally:
            shutil.rmtree(tmp_dir, ignore_errors=True)

    return False


def get_bg_color(img):
    """Sample the background color from the four image corners."""
    w, h = img.size
    corners = [
        img.getpixel((0, 0)),
        img.getpixel((w - 1, 0)),
        img.getpixel((0, h - 1)),
        img.getpixel((w - 1, h - 1)),
    ]
    return max(set(corners), key=corners.count)


def remove_solid_bg(img, tolerance=30):
    """Remove a solid background color (sampled from corners), making it transparent.

    Useful for undoing the white background that qlmanage injects when rendering
    transparent SVGs, or for stripping a solid backdrop from any source image.
    Anti-aliased edge pixels get gradual alpha for smooth transitions.
    """
    img = img.convert("RGBA")
    bg = get_bg_color(img)[:3]
    bg_img = Image.new("RGB", img.size, bg)
    diff = ImageChops.difference(img.convert("RGB"), bg_img).convert("L")
    orig_alpha = img.getchannel("A")
    tol = max(tolerance, 1)
    t2 = tol * 2
    new_alpha = diff.point(
        lambda d: 0
        if d <= tolerance
        else (min(255, int((d - tolerance) * 255 / tol)) if d <= t2 else 255)
    )
    final_alpha = ImageChops.multiply(new_alpha, orig_alpha)
    img.putalpha(final_alpha)
    return img


def detect_content_bbox(img):
    """Detect the bounding box of the actual icon content.

    Uses the alpha channel when the image has transparency; otherwise detects
    pixels that differ from the background color sampled from the corners.
    Returns (left, upper, right, lower) or None if nothing is found.
    """
    img = img.convert("RGBA")
    alpha = img.getchannel("A")
    if alpha.getextrema()[0] < 255:
        # Image has transparency -> use alpha channel
        return alpha.getbbox()

    # Fully opaque -> diff against the background color
    bg = get_bg_color(img)
    bg_img = Image.new("RGBA", img.size, bg)
    diff = ImageChops.difference(img, bg_img)
    return diff.convert("L").getbbox()


def prepare_source(img, trim=True, padding=0, fit="fill", remove_bg=False, bg_tolerance=30):
    """Trim margins and produce a square source image.

    If remove_bg is True, the solid background color (sampled from the corners)
    is made transparent before trimming, so the output keeps a transparent
    background instead of a solid fill.

    fit modes:
      fill    - stretch content to fill the square (fully fills, may distort
                if the content is not square)
      contain - keep aspect ratio, center on a transparent background
      cover   - scale to fill the square and crop overflow (no distortion,
                may clip content at the edges)
    """
    img = img.convert("RGBA")

    if remove_bg:
        img = remove_solid_bg(img, tolerance=bg_tolerance)

    if trim:
        bbox = detect_content_bbox(img)
        if bbox:
            l, t, r, b = bbox
            if padding:
                l = max(0, l - padding)
                t = max(0, t - padding)
                r = min(img.width, r + padding)
                b = min(img.height, b + padding)
            img = img.crop((l, t, r, b))

    w, h = img.size
    side = max(w, h)

    if fit == "fill":
        return img.resize((side, side), Image.LANCZOS)
    if fit == "contain":
        canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
        scale = side / max(w, h)
        nw, nh = max(1, round(w * scale)), max(1, round(h * scale))
        resized = img.resize((nw, nh), Image.LANCZOS)
        canvas.paste(resized, ((side - nw) // 2, (side - nh) // 2), resized)
        return canvas
    if fit == "cover":
        scale = side / min(w, h)
        nw, nh = max(1, round(w * scale)), max(1, round(h * scale))
        resized = img.resize((nw, nh), Image.LANCZOS)
        left = (nw - side) // 2
        top = (nh - side) // 2
        return resized.crop((left, top, left + side, top + side))
    raise ValueError(f"Unknown fit mode: {fit}")


def main():
    parser = argparse.ArgumentParser(
        description="Generate icon PNGs/ICO/ICNS from a source SVG or PNG image."
    )
    parser.add_argument(
        "source", help="Path to the source image (.svg or .png)"
    )
    parser.add_argument(
        "--svg-size", type=int, default=1024,
        help="Resolution to rasterize SVG input at (default: 1024)",
    )
    parser.add_argument(
        "-o", "--output-dir", default=None,
        help="Output directory (default: same directory as the source)",
    )
    parser.add_argument(
        "--no-trim", action="store_true",
        help="Do not trim margins around the content",
    )
    parser.add_argument(
        "--padding", type=int, default=0,
        help="Pixels of padding to keep after trimming (default: 0)",
    )
    parser.add_argument(
        "--fit", choices=["fill", "contain", "cover"], default="fill",
        help="How to fit content into the square (default: fill)",
    )
    parser.add_argument(
        "--transparent-bg", nargs="?", const=30, type=int, default=None,
        metavar="TOLERANCE",
        help="Remove the solid background color (sampled from corners) and "
             "make it transparent. Optional value is the color tolerance "
             "(default: 30)",
    )
    args = parser.parse_args()

    source = os.path.abspath(args.source)
    if not os.path.exists(source):
        print(f"Error: source not found: {source}")
        sys.exit(1)

    out_dir = args.output_dir or os.path.dirname(source)
    os.makedirs(out_dir, exist_ok=True)

    ext = os.path.splitext(source)[1].lower()
    tmp_png = None
    if ext == ".svg":
        tmp_png = tempfile.NamedTemporaryFile(suffix="_master.png", delete=False)
        tmp_png.close()
        print(f"Source: {source} (SVG)")
        print(f"Rendering SVG to {args.svg_size}x{args.svg_size} master PNG ...")
        if not render_svg_to_png(source, args.svg_size, tmp_png.name):
            print("Error: Could not render SVG. Please install one of:")
            print("  - rsvg-convert:  brew install librsvg")
            print("  - cairosvg:      pip install cairosvg (needs system Cairo)")
            print("  - macOS:         qlmanage (built-in)")
            sys.exit(1)
        src_img = Image.open(tmp_png.name)
    else:
        src_img = Image.open(source)
        print(f"Source: {source} ({src_img.size[0]}x{src_img.size[1]})")
    print(f"Output dir: {out_dir}")
    tbg = args.transparent_bg
    print(f"Trim: {'no' if args.no_trim else 'yes'} | Padding: {args.padding}px | Fit: {args.fit} | Transparent bg: {'no' if tbg is None else f'yes (tol={tbg})'}\n")

    master = prepare_source(
        src_img, trim=not args.no_trim, padding=args.padding, fit=args.fit,
        remove_bg=tbg is not None,
        bg_tolerance=tbg if tbg is not None else 30,
    )

    # Clean up the temporary SVG-rendered PNG (if any)
    if tmp_png and os.path.exists(tmp_png.name):
        os.remove(tmp_png.name)

    print(f"Master canvas: {master.size[0]}x{master.size[1]}")

    # PNG sizes
    print("Generating PNG icons:")
    for filename, size in PNG_SIZES.items():
        out = master.resize((size, size), Image.LANCZOS)
        out.save(os.path.join(out_dir, filename), "PNG")
        print(f"  ✓ {filename} ({size}x{size})")

    # ICO (Windows)
    ico_path = os.path.join(out_dir, "icon.ico")
    ico_images = [master.resize((s, s), Image.LANCZOS) for s in ICO_SIZES]
    ico_images[0].save(ico_path, format="ICO", sizes=[(s, s) for s in ICO_SIZES])
    print("  ✓ icon.ico")

    # ICNS (macOS)
    if shutil.which("iconutil"):
        iconset = os.path.join(out_dir, "icon.iconset")
        os.makedirs(iconset, exist_ok=True)
        for name, sz in ICNS_SIZES:
            master.resize((sz, sz), Image.LANCZOS).save(os.path.join(iconset, name), "PNG")
        icns_path = os.path.join(out_dir, "icon.icns")
        ret = os.system(f'iconutil -c icns "{iconset}" -o "{icns_path}" 2>/dev/null')
        if ret == 0:
            print("  ✓ icon.icns")
        shutil.rmtree(iconset, ignore_errors=True)
    else:
        print("  (skipped icon.icns: iconutil not found)")

    print(f"\nDone! All icons generated in: {out_dir}")


if __name__ == "__main__":
    main()
