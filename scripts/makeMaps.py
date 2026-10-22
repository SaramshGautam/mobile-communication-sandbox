"""Clean up the generated map images and redraw their pins, labels and routes.

For each map this:
  1. removes the generator's own pins, labels and routes (texture-aware inpainting),
  2. crops off the fake search bar, compass and zoom buttons,
  3. draws new pins, routes and labels at hand-checked positions, with Arial text.

Inputs : assets-source/generated/maps/<name>.png   (the original 1200x900 generated maps)
Outputs: src/assets/photos/map-<name>.webp         (1080x810, picked up by src/social/photos.js)

Run:   pip install opencv-contrib-python-headless pillow scikit-image
       python3 scripts/makeMaps.py

Font: uses Arial Bold if found (put "Arial Bold.ttf" in assets-source/fonts/, or it is
read from the macOS system fonts); otherwise Liberation Sans Bold, which is designed
to be metric-identical to Arial.
"""
import os
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from skimage.graph import route_through_array

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(ROOT, "assets-source", "generated", "maps")
OUT = os.path.join(ROOT, "src", "assets", "photos")
CROP = (0, 90, 1080, 900)  # x0, y0, x1, y1 — removes search bar (top-left), compass + zoom (right)
SS = 3  # supersampling for smooth pins and text
FONT_SIZE = 36  # px in the 1080-wide image ≈ 13 px when the map is shown 390 px wide on a phone
PIN_R = 26

GREEN, RED, BLUE = (30, 142, 62), (217, 48, 37), (26, 115, 232)

FONT_CANDIDATES = [
    os.path.join(ROOT, "assets-source", "fonts", "Arial Bold.ttf"),
    os.path.join(ROOT, "assets-source", "fonts", "Arial-Bold.ttf"),
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "/usr/share/fonts/truetype/msttcorefonts/Arial_Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/liberation-sans/LiberationSans-Bold.ttf",
]
FONT_PATH = next(p for p in FONT_CANDIDATES if os.path.exists(p))

# Positions are in the cropped 1080x810 image. `at` = the pin's tip (checked by eye against the map).
# Label placement: `side` relative to the pin, or `cover` = (x0, y0, x1, y1) + `align` — the label is
# drawn over that rectangle (where the generator's label was, so no inpainting smudge shows), at least
# as big as it, anchored on its left or right edge. Labels may contain "\n" for two lines.
# `route`: waypoints the walking route must pass through; it follows paths between them.
# `twin`: another render of the same base map, used to restore the pixels under old pins/labels.
MAPS = {
    "hill-trail": {
        "pins": [
            {"at": (252, 646), "color": GREEN, "label": "Start: Car Park", "cover": (273, 651, 472, 690), "align": "left"},
            {"at": (676, 214), "color": RED, "label": "Finish: Hilltop", "cover": (743, 136, 932, 180), "align": "left"},
        ],
        "route": {"via": [(252, 646), (318, 626), (372, 598), (465, 572), (676, 214)], "max_y": 660, "straight": 3},
    },
    "riverside-walk": {
        "pins": [
            {"at": (386, 207), "color": GREEN, "label": "Start: Boat House", "cover": (103, 106, 338, 150), "align": "right"},
            {"at": (1021, 208), "color": RED, "label": "Finish: Stone Bridge", "cover": (770, 286, 1037, 330), "align": "right"},
        ],
        "route": {"via": [(386, 207), (1021, 208)], "min_y": 175, "max_y": 245},
    },
    "river-cafe": {
        "pins": [{"at": (788, 214), "color": RED, "label": "River Café\n18 River Road", "cover": (813, 106, 1072, 150), "align": "right"}],
    },
    "river-park": {
        "pins": [{"at": (631, 290), "color": RED, "label": "River Park", "side": "above"}],
    },
    "museum-front-entrance": {
        "pins": [{"at": (600, 236), "color": RED, "label": "Front entrance, Main Street", "side": "above-right"}],
        "twin": "museum-south-pickup",
    },
    "museum-south-pickup": {
        "pins": [{"at": (806, 523), "color": RED, "label": "South pickup bay, South Lane", "side": "below-left"}],
        "twin": "museum-front-entrance",
    },
}


# ---------------------------------------------------------------- cleaning
def _components(mask, min_area):
    n, _, st, _ = cv2.connectedComponentsWithStats(mask.astype(np.uint8))
    return [tuple(int(v) for v in s[:4]) for s in st[1:] if s[4] > min_area]


def clean(name, im, twin=None):
    """Mask the generator's labels, pins and dashed routes, then remove them.

    With a `twin` (same base map, different annotations) the masked pixels are copied
    from the twin, which is exact. Otherwise they are inpainted."""
    H, W = im.shape[:2]
    hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
    mask = np.zeros((H, W), np.uint8)
    for x, y, w, h in _components((im > 238).all(2), 3000):  # white label boxes (+ shadow)
        if (x < 460 and y < 100) or x > 1080:
            continue  # search bar / zoom buttons: cropped off instead
        cv2.rectangle(mask, (x - 5, y - 5), (x + w + 12, y + h + 12), 255, -1)
    red = ((hsv[..., 0] < 8) | (hsv[..., 0] > 172)) & (hsv[..., 1] > 150) & (hsv[..., 2] > 150)
    green = (hsv[..., 0] > 60) & (hsv[..., 0] < 85) & (hsv[..., 1] > 170) & (hsv[..., 2] > 110)
    for m in (red, green):  # pin heads (+ outline + ground shadow)
        for x, y, w, h in _components(m, 600):
            if w <= 70 and h <= 110:
                cv2.rectangle(mask, (x - 8, y - 8), (x + w + 8, y + h + 16), 255, -1)
    if name == "hill-trail":  # brown/white dashes on a straight line from (270,701) to (716,345)
        corridor = np.zeros((H, W), np.uint8)
        cv2.line(corridor, (262, 708), (716, 345), 255, 50)
        brown = ((hsv[..., 0] <= 20) | (hsv[..., 0] >= 170)) & (hsv[..., 1] > 70) & (hsv[..., 2] > 40) & (hsv[..., 2] < 150)
        dash = brown | (im > 205).all(2)
        mask |= cv2.dilate(((corridor > 0) & dash).astype(np.uint8) * 255, np.ones((7, 7)))
    if name == "riverside-walk":  # white dashes with dark-green edges along the north bank
        band = np.zeros((H, W), bool)
        band[285:345, 95:1075] = True
        dg = (im[..., 1].astype(int) - im[..., 2] > 25) & (im[..., 1] < 130) & (im[..., 0] < 110)
        near = cv2.dilate(dg.astype(np.uint8), np.ones((7, 7))) > 0
        mask |= cv2.dilate((band & (dg | ((im > 215).all(2) & near))).astype(np.uint8) * 255, np.ones((9, 9)))
    if twin is not None:
        out = im.copy()
        out[mask > 0] = twin[mask > 0]
    else:
        out = np.zeros_like(im)
        cv2.xphoto.inpaint(im, 255 - mask, out, cv2.xphoto.INPAINT_FSR_FAST)
    x0, y0, x1, y1 = CROP
    return out[y0:y1, x0:x1]


# ---------------------------------------------------------------- routes
def walkway_cost(rgb):
    """Low cost on pale, unsaturated pixels (footpaths, paving); high on grass, trees, water, roofs."""
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV).astype(float)
    pale = (hsv[..., 2] > 150) & (hsv[..., 1] < 70)
    cost = np.where(pale, 1.0, 25.0)
    return cv2.GaussianBlur(cost, (5, 5), 0)


def find_route(rgb, via, min_y=0, max_y=None, straight=0):
    """Route through `via`, following footpaths. The first `straight` points are joined directly
    (e.g. across a car park, where there is no path to follow)."""
    head = []
    if straight > 1:
        for a, b in zip(via[:straight - 1], via[1:straight]):
            n = max(2, int(np.hypot(b[0] - a[0], b[1] - a[1]) // 3))
            head += [(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t) for t in np.linspace(0, 1, n, endpoint=False)]
        via = via[straight - 1:]
    cost = walkway_cost(rgb)
    cost[:min_y] = 1e6  # keep the route inside a horizontal band (e.g. one river bank)
    if max_y is not None:
        cost[max_y:] = 1e6
    path = []
    for a, b in zip(via, via[1:]):
        seg, _ = route_through_array(cost, (a[1], a[0]), (b[1], b[0]), fully_connected=True, geometric=True)
        path += seg if not path else seg[1:]
    pts = np.array([(c, r) for r, c in path], float)
    # smooth out pixel stair-steps
    k = 14
    if len(pts) > 2 * k:
        sm = np.copy(pts)
        for i in range(k, len(pts) - k):
            sm[i] = pts[i - k:i + k + 1].mean(0)
        pts = sm
    tail = [tuple(p) for p in pts[::3]] + [tuple(pts[-1])]
    pts = np.array(head + tail, float)
    if head:  # blend the corner between the straight part and the path
        sm = np.copy(pts)
        for i in range(4, len(pts) - 4):
            sm[i] = pts[i - 4:i + 5].mean(0)
        pts = sm
    return [tuple(p) for p in pts]


# ---------------------------------------------------------------- drawing
def draw_route(layer, pts):
    d = ImageDraw.Draw(layer)
    s = [(x * SS, y * SS) for x, y in pts]
    d.line(s, fill=(255, 255, 255, 255), width=13 * SS, joint="curve")
    d.line(s, fill=BLUE + (255,), width=7 * SS, joint="curve")


def draw_pin(layer, shadow, tip, color):
    x, y = tip[0] * SS, tip[1] * SS
    r = PIN_R * SS
    cy = y - PIN_R * 2.45 * SS  # head centre
    sd = ImageDraw.Draw(shadow)
    sd.ellipse([x - 16 * SS, y - 6 * SS, x + 16 * SS, y + 6 * SS], fill=(0, 0, 0, 120))
    d = ImageDraw.Draw(layer)

    def shape(rad, fill):
        # teardrop: circle + triangle tangent to it, meeting at the tip
        d.ellipse([x - rad, cy - rad, x + rad, cy + rad], fill=fill)
        d.polygon([(x - rad * 0.86, cy + rad * 0.5), (x + rad * 0.86, cy + rad * 0.5), (x, y - (r - rad) * 1.6)], fill=fill)

    shape(r + 4 * SS, (255, 255, 255, 255))
    shape(r, color + (255,))
    d.ellipse([x - 9 * SS, cy - 9 * SS, x + 9 * SS, cy + 9 * SS], fill=(255, 255, 255, 255))


def draw_label(layer, shadow, tip, text, side, font, size, cover=None, align="left"):
    pad_x, pad_y, line_gap = 16 * SS, 11 * SS, 6 * SS
    d = ImageDraw.Draw(layer)
    lines = text.split("\n")
    widths = [d.textbbox((0, 0), ln, font=font)[2] for ln in lines]
    asc, desc = font.getmetrics()
    line_h = asc + desc
    w = max(widths) + 2 * pad_x
    h = len(lines) * line_h + (len(lines) - 1) * line_gap + 2 * pad_y
    x, y = tip[0] * SS, tip[1] * SS
    head_top = y - PIN_R * 3.5 * SS
    head_mid = y - PIN_R * 2.45 * SS
    gap = 10 * SS
    if cover is not None:  # sit over the old label, at least as big as it
        x0, y0, x1, y1 = (v * SS for v in cover)
        w, h = max(w, x1 - x0 + 6 * SS), max(h, y1 - y0 + 6 * SS)
        bx = x0 - 3 * SS if align == "left" else x1 + 3 * SS - w
        by = y0 - 3 * SS
    else:
        bx, by = {
            "above": (x - w / 2, head_top - gap - h),
            "above-right": (x + 8 * SS, head_top - gap - h),
            "below": (x - w / 2, y + gap + 6 * SS),
            "below-left": (x - w - 8 * SS, y + gap + 6 * SS),
            "right": (x + PIN_R * 1.6 * SS, head_mid - h / 2),
            "left": (x - PIN_R * 1.6 * SS - w, head_mid - h / 2),
        }[side]
    W, H = layer.size
    bx = min(max(bx, 8 * SS), W - w - 8 * SS)
    by = min(max(by, 8 * SS), H - h - 8 * SS)
    ImageDraw.Draw(shadow).rounded_rectangle([bx, by + 3 * SS, bx + w, by + h + 4 * SS], 12 * SS, fill=(0, 0, 0, 100))
    d.rounded_rectangle([bx, by, bx + w, by + h], 12 * SS, fill=(255, 255, 255, 250))
    ty = by + pad_y
    for ln, lw in zip(lines, widths):
        tx = bx + (w - lw) / 2 if len(lines) > 1 else bx + pad_x
        d.text((tx, ty), ln, font=font, fill=(28, 30, 33, 255))
        ty += line_h + line_gap


def render(name, spec):
    src = cv2.imread(os.path.join(SRC, f"{name}.png"))
    twin = cv2.imread(os.path.join(SRC, f"{spec['twin']}.png")) if spec.get("twin") else None
    base = cv2.cvtColor(clean(name, src, twin), cv2.COLOR_BGR2RGB)
    H, W = base.shape[:2]
    size = FONT_SIZE
    font = ImageFont.truetype(FONT_PATH, size * SS)
    big = (W * SS, H * SS)
    shadow = Image.new("RGBA", big, (0, 0, 0, 0))
    over = Image.new("RGBA", big, (0, 0, 0, 0))
    pins = spec["pins"]
    if spec.get("route"):
        r = spec["route"]
        draw_route(over, find_route(base, r["via"], r.get("min_y", 0), r.get("max_y"), r.get("straight", 0)))
    for p in pins:
        draw_pin(over, shadow, p["at"], p["color"])
    for p in pins:
        draw_label(over, shadow, p["at"], p["label"], p.get("side"), font, size, p.get("cover"), p.get("align", "left"))
    shadow = shadow.filter(ImageFilter.GaussianBlur(3 * SS))
    img = Image.fromarray(base).convert("RGBA").resize(big, Image.BICUBIC)
    img = Image.alpha_composite(Image.alpha_composite(img, shadow), over)
    img = img.resize((W, H), Image.LANCZOS).convert("RGB")
    out = os.path.join(OUT, f"map-{name}.webp")
    img.save(out, "WEBP", quality=88)
    print(f"{out}  ({os.path.getsize(out) // 1024} KB)")


if __name__ == "__main__":
    print("Font:", FONT_PATH)
    for name, spec in MAPS.items():
        render(name, spec)
