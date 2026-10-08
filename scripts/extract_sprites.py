"""Extract transparent pixel-art sprites from the four supplied reference frames."""

from collections import deque
from pathlib import Path
from math import sqrt
from PIL import Image

SOURCE = Path(r"C:\huahai")
OUTPUT = Path(__file__).resolve().parents[1] / "assets" / "sprites"

FRAMES = {
    "wave": ("5fb3a1493f2051bdd710744f73cb0f12.png", (24, 24, 462, 768)),
    "hat": ("79cc6a65d0d7887e331021973ce23808.png", (74, 6, 563, 748)),
    "walk": ("87a681712533e636be5969beb223eb59.png", (55, 8, 457, 532)),
    "drink": ("e0e756713d0d0ff87c592c5771a06799.png", (82, 22, 780, 1018)),
}


def distance(a, b):
    return sqrt(sum((int(x) - int(y)) ** 2 for x, y in zip(a, b)))


def remove_connected_background(image, tolerance=58):
    """Remove pixels reachable from the crop edge through similar pixels.

    The character is enclosed by a dark pixel outline, so a flood fill removes
    the illustrated environment without eating the light character details.
    """
    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()
    transparent = [[False] * width for _ in range(height)]
    queue = deque()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if transparent[y][x]:
            continue
        transparent[y][x] = True
        here = pixels[x, y]
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if not (0 <= nx < width and 0 <= ny < height) or transparent[ny][nx]:
                continue
            if distance(here, pixels[nx, ny]) <= tolerance:
                queue.append((nx, ny))

    result = rgb.convert("RGBA")
    result_pixels = result.load()
    for y in range(height):
        for x in range(width):
            if transparent[y][x]:
                result_pixels[x, y] = (*result_pixels[x, y][:3], 0)
    return result


def trim(image, padding=8):
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        return image
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(image.width, bbox[2] + padding)
    bottom = min(image.height, bbox[3] + padding)
    return image.crop((left, top, right, bottom))


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name, (filename, crop_box) in FRAMES.items():
        source = Image.open(SOURCE / filename).convert("RGB").crop(crop_box)
        sprite = trim(remove_connected_background(source))
        sprite.save(OUTPUT / f"{name}.png", optimize=True)
        print(f"{name}: {sprite.width}x{sprite.height}")

    # A tiny tray icon assembled from the wave sprite.
    tray = Image.open(OUTPUT / "wave.png").convert("RGBA")
    tray.thumbnail((32, 32), Image.Resampling.NEAREST)
    tray.save(OUTPUT.parent / "tray.png", optimize=True)


if __name__ == "__main__":
    main()
