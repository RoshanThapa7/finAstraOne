"""Crop person portraits from wide banner images for team cards."""
from PIL import Image
import numpy as np
import os
import shutil

BASE = os.path.join(os.path.dirname(__file__), "..", "assets", "images")

CONFIGS = [
    ("team-praveen.png", "left", 0.40),
    ("team-sita.png", "left", 0.40),
    ("team-rochak.png", "right", 0.40),
]


def trim_white(im: Image.Image, threshold: int = 248, pad: int = 10) -> Image.Image:
    rgb = np.array(im.convert("RGB"))
    mask = np.any(rgb < threshold, axis=2)
    coords = np.argwhere(mask)
    if not coords.size:
        return im
    y0, x0 = coords.min(axis=0)
    y1, x1 = coords.max(axis=0)
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(im.width - 1, x1 + pad)
    y1 = min(im.height - 1, y1 + pad)
    return im.crop((x0, y0, x1 + 1, y1 + 1))


def crop_portrait(src_path: str, out_path: str, side: str, frac: float) -> None:
    im = Image.open(src_path).convert("RGBA")
    w, h = im.size

    if side == "left":
        box = (0, 0, int(w * frac), h)
    else:
        box = (int(w * (1 - frac)), 0, w, h)

    person = trim_white(im.crop(box))

    target_w, target_h = 1024, 768
    cw, ch = person.size
    scale = min((target_w * 0.88) / cw, (target_h * 0.98) / ch)
    new_w = max(1, int(cw * scale))
    new_h = max(1, int(ch * scale))
    resized = person.resize((new_w, new_h), Image.LANCZOS)

    canvas = Image.new("RGBA", (target_w, target_h), (253, 251, 247, 255))
    x = (target_w - new_w) // 2
    y = target_h - new_h
    if y < int(target_h * 0.04):
        y = int(target_h * 0.04)
    canvas.paste(resized, (x, y), resized)
    canvas.convert("RGB").save(out_path, "PNG", optimize=True)
    print(f"Saved {os.path.basename(out_path)} ({new_w}x{new_h} person on {target_w}x{target_h})")


def main() -> None:
    os.makedirs(BASE, exist_ok=True)
    for filename, side, frac in CONFIGS:
        src = os.path.join(BASE, filename)
        banner = os.path.join(BASE, filename.replace(".png", "-banner.png"))
        if not os.path.exists(banner):
            shutil.copy2(src, banner)
            print(f"Backed up banner to {os.path.basename(banner)}")
        crop_portrait(banner, src, side, frac)


if __name__ == "__main__":
    main()
