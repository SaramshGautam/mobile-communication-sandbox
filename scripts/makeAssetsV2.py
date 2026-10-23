"""Placeholder images for task bank v2 (Messenger and Social scenarios).

Run:  python3 scripts/makeAssetsV2.py
Output: public/assets/social/<name>.svg

To use a real photo instead, put <name>.webp (or .jpg/.png) in src/assets/photos/
— photos.js picks it up automatically. Keep every task-critical detail noted below.
"""
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "social")
os.makedirs(OUT, exist_ok=True)
FONT = "font-family='Inter, Segoe UI, Helvetica, Arial, sans-serif'"


def svg(w, h, body, bg="#f6f1e7"):
    return (f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {w} {h}' width='{w}' height='{h}'>"
            f"<rect width='{w}' height='{h}' fill='{bg}'/>{body}</svg>")


def text(x, y, s, size=40, fill="#23313f", weight=700, anchor="middle", extra=""):
    s = s.replace("&", "&amp;")
    return f"<text x='{x}' y='{y}' {FONT} font-size='{size}' font-weight='{weight}' fill='{fill}' text-anchor='{anchor}' {extra}>{s}</text>"


def save(name, content):
    with open(os.path.join(OUT, name + ".svg"), "w") as f:
        f.write(content)


def flyer(name, title_lines, lines, bg, accent, stamp=None, foot=None):
    """Portrait flyer. `stamp` = big corner label such as FINAL / DRAFT (task-critical)."""
    body = "".join(text(400, 190 + i * 96, l, 86, accent, 800) for i, l in enumerate(title_lines))
    y = 190 + len(title_lines) * 96 + 40
    for i, l in enumerate(lines):
        body += f"<rect x='90' y='{y + i * 96}' width='620' height='78' rx='39' fill='#ffffffd9'/>" + text(400, y + i * 96 + 52, l, 36, "#23313f", 700)
    if foot:
        body += f"<rect x='80' y='1072' width='640' height='90' rx='20' fill='{accent}'/>" + text(400, 1130, foot, 38, "#fff", 800)
    if stamp:
        color = "#2e8b57" if stamp == "FINAL" else "#c0392b"
        body += (f"<g transform='rotate(-12 640 90)'><rect x='500' y='40' width='280' height='100' rx='14' fill='none' stroke='{color}' stroke-width='10'/>"
                 + text(640, 115, stamp, 64, color, 900) + "</g>")
    save(name, svg(800, 1200, body, bg))


def scene(name, body, bg="#eef2f4", w=800, h=600):
    save(name, svg(w, h, body, bg))


# ======================= SOCIAL APP =======================
# T01-S Mina Shah (art) vs Mina Shah (travel)
scene("mina-art-session", """
  <rect y='380' width='800' height='220' fill='#c9a77c'/>
  <rect x='120' y='300' width='300' height='210' fill='#fffdf7' stroke='#d9cdb5' stroke-width='6' transform='rotate(-4 270 400)'/>
  <path d='M160 440 q 60 -90 120 -10 t 110 -40' stroke='#3c6fc4' stroke-width='14' fill='none' stroke-linecap='round'/>
  <circle cx='230' cy='360' r='28' fill='#f2b01e'/>
  <ellipse cx='590' cy='440' rx='150' ry='80' fill='#fff' stroke='#ddd' stroke-width='5'/>
  <g><circle cx='520' cy='420' r='22' fill='#e0413a'/><circle cx='580' cy='405' r='22' fill='#2f6fd6'/><circle cx='640' cy='420' r='22' fill='#3fa34d'/><circle cx='600' cy='470' r='22' fill='#f2b01e'/></g>
  <path d='M470 300 L700 230' stroke='#8a5a2b' stroke-width='12' stroke-linecap='round'/><path d='M690 233 l30 -10' stroke='#2b2b2b' stroke-width='16' stroke-linecap='round'/>""", "#f3eadf")
scene("mina-art-last-week", """
  <rect y='420' width='800' height='180' fill='#d8c3a5'/>
  """ + "".join(f"<rect x='{70 + i * 180}' y='{170 + (i % 2) * 20}' width='140' height='180' fill='#fff' stroke='#c9b99d' stroke-width='6'/><circle cx='{140 + i * 180}' cy='{250 + (i % 2) * 20}' r='{30 + i * 6}' fill='{c}'/>"
                for i, c in enumerate(["#e8364f", "#3c6fc4", "#3fa34d", "#f2b01e"])), "#efe7da")
scene("mina-travel-harbor", """
  <rect width='800' height='330' fill='#9fd0f0'/><rect y='330' width='800' height='270' fill='#2f7fb8'/>
  <g fill='#f4efe4' stroke='#b8ad98' stroke-width='4'><rect x='80' y='200' width='90' height='130'/><rect x='180' y='170' width='80' height='160'/><rect x='270' y='210' width='100' height='120'/></g>
  <path d='M480 420 L700 420 L660 470 L520 470 Z' fill='#fff'/><path d='M590 410 L590 280 L670 400 Z' fill='#fff'/>""", "#9fd0f0")
scene("mina-travel-mountains", """
  <rect width='800' height='600' fill='#cde4f5'/>
  <path d='M0 520 L200 220 L330 400 L480 160 L800 520 Z' fill='#6b7f95'/><path d='M420 250 L480 160 L540 250 L500 230 L470 250 Z' fill='#fff'/>
  <rect y='500' width='800' height='100' fill='#5c8a4a'/>""", "#cde4f5")

# T02-S device photo: finished bowl
scene("finished-bowl", """
  <rect y='380' width='800' height='220' fill='#b78b5c'/>
  <ellipse cx='400' cy='300' rx='230' ry='70' fill='#4f8fa8'/>
  <path d='M170 300 Q 190 470 400 480 Q 610 470 630 300 Z' fill='#3d7a91'/>
  <ellipse cx='400' cy='300' rx='200' ry='52' fill='#e9dcc4'/>
  <path d='M220 360 Q 400 420 580 360' stroke='#2a5c6e' stroke-width='8' fill='none'/>""", "#efe4d3")

# T03-S balcony plants — must keep: BLUE pot = basil (wilting), WHITE pot = mint
scene("balcony-plants", """
  <rect y='0' width='800' height='600' fill='#dbe9f2'/>
  <g stroke='#9aa7b2' stroke-width='10'><path d='M0 360 H800'/>""" + "".join(f"<path d='M{x} 360 V600'/>" for x in range(40, 800, 90)) + """</g>
  <rect y='520' width='800' height='80' fill='#c4b49c'/>
  <path d='M150 400 L350 400 L325 540 L175 540 Z' fill='#2f6fd6' stroke='#1d4fa3' stroke-width='6'/>
  <g fill='#7fae4d'><ellipse cx='200' cy='380' rx='40' ry='16' transform='rotate(35 200 380)'/><ellipse cx='300' cy='380' rx='40' ry='16' transform='rotate(-35 300 380)'/>
  <ellipse cx='245' cy='350' rx='16' ry='40' transform='rotate(10 245 350)'/></g>
  <path d='M250 400 V330' stroke='#6b8f3a' stroke-width='6'/>
  <rect x='205' y='450' width='90' height='36' rx='6' fill='#fff'/>""" + text(250, 477, "BASIL", 24, "#1d4fa3", 800) + """
  <path d='M450 400 L650 400 L625 540 L475 540 Z' fill='#f7f7f5' stroke='#c9c9c4' stroke-width='6'/>
  <g fill='#3fa34d'>""" + "".join(f"<ellipse cx='{480 + i * 28}' cy='{330 + (i % 3) * 18}' rx='18' ry='26'/>" for i in range(7)) + """</g>
  <rect x='505' y='450' width='90' height='36' rx='6' fill='#eaf5ea' stroke='#3fa34d' stroke-width='3'/>""" + text(550, 477, "MINT", 24, "#25732f", 800), "#dbe9f2")

# T04-S gallery: finished flower bed (no people) vs volunteer sign-in sheet (phone numbers)
scene("finished-flower-bed", """
  <rect width='800' height='600' fill='#cfe8c4'/><rect y='300' width='800' height='300' fill='#8a6a46'/>
  <rect x='60' y='320' width='680' height='220' rx='20' fill='#6b4f33' stroke='#d9cdb8' stroke-width='14'/>
  """ + "".join(f"<circle cx='{110 + (i % 9) * 72}' cy='{360 + (i // 9) * 70}' r='24' fill='{['#e84a7f', '#ffd21f', '#8b4fc7', '#ff8a3d'][i % 4]}'/>" for i in range(27)), "#cfe8c4")
signin = "".join(text(120, 250 + i * 62, n, 26, "#333", 500, "start") + text(560, 250 + i * 62, p, 26, "#333", 500, "start")
                 for i, (n, p) in enumerate([("Alex M.", "(555) 014-2291"), ("Elena R.", "(555) 018-7720"), ("Lee J.", "(555) 011-4398"), ("Grace H.", "(555) 016-9083"), ("Tom B.", "(555) 012-5547"), ("Rosa M.", "(555) 019-3362")]))
scene("volunteer-signin-sheet", "<rect x='70' y='60' width='660' height='520' fill='#fff' stroke='#ccc' stroke-width='4' transform='rotate(-2 400 320)'/>"
      + text(400, 140, "Garden cleanup — volunteer sign-in", 34, "#222", 800) + text(120, 200, "NAME", 22, "#777", 700, "start") + text(560, 200, "PHONE", 22, "#777", 700, "start") + signin, "#d7d2c8")
scene("cleanup-bags", """
  <rect y='380' width='800' height='220' fill='#7aa85a'/>""" + "".join(f"<path d='M{90 + i * 120} 470 q 0 -120 50 -120 q 50 0 50 120 Z' fill='#2b2b2b' opacity='.85'/>" for i in range(6)), "#cde6f3")

# T07-S gallery: desk lamp + other household photos
scene("desk-lamp", """
  <rect y='440' width='800' height='160' fill='#c9a77c'/>
  <ellipse cx='400' cy='450' rx='120' ry='22' fill='#2b2b2b'/>
  <path d='M400 440 L330 260 L470 150' stroke='#2b2b2b' stroke-width='16' fill='none' stroke-linejoin='round'/>
  <path d='M430 120 L560 120 L600 220 L470 220 Z' fill='#2f8f6f' transform='rotate(25 515 170)'/>""", "#f1ece3")
scene("household-kettle", "<rect y='440' width='800' height='160' fill='#d9d4cc'/><path d='M280 440 Q 260 260 400 240 Q 540 260 520 440 Z' fill='#c4553a'/><path d='M520 300 q 80 0 60 80' stroke='#7a2f1f' stroke-width='16' fill='none'/><path d='M280 300 l-80 -40' stroke='#c4553a' stroke-width='22'/>", "#f4f0ea")
scene("household-chair", "<rect y='470' width='800' height='130' fill='#9cbf7a'/><g fill='#a8723f'><rect x='300' y='150' width='200' height='190' rx='12'/><rect x='280' y='330' width='240' height='40'/><rect x='290' y='370' width='20' height='130'/><rect x='490' y='370' width='20' height='130'/></g>", "#dcebd3")
scene("household-bookshelf", "<rect x='240' y='80' width='320' height='460' fill='#8a5a2b'/>" + "".join(
    f"<rect x='{255 + (i % 6) * 48}' y='{100 + (i // 6) * 110}' width='40' height='96' fill='{['#3c6fc4', '#e0413a', '#f2b01e', '#3fa34d', '#7a4f9a', '#ddd'][i % 6]}'/>" for i in range(24)), "#efe6d8")

# T06-S recipe creators
def food(name, plate, body):
    save(name, svg(800, 600, f"<rect width='800' height='600' fill='#e9ddc9'/><ellipse cx='400' cy='330' rx='280' ry='190' fill='{plate}' stroke='#d8cbb5' stroke-width='6'/>{body}"))


food("recipe-bread", "#f7efe2", "<ellipse cx='400' cy='320' rx='210' ry='110' fill='#c98a3c'/><g stroke='#8a5a1f' stroke-width='10'><path d='M290 280 l40 70 M370 270 l40 80 M450 270 l40 80'/></g>")
food("recipe-salad", "#fff", "".join(f"<ellipse cx='{300 + (i * 53) % 210}' cy='{260 + (i * 37) % 130}' rx='38' ry='20' fill='{['#4cb85a', '#3d8a3a', '#e0413a', '#f2b01e'][i % 4]}' transform='rotate({i * 33} 400 320)'/>" for i in range(16)))
food("recipe-pasta", "#fff", "<g stroke='#e8c25a' stroke-width='10' fill='none'>" + "".join(f"<path d='M{240 + i * 22} 260 q 60 {40 + i * 3} 0 {120}'/>" for i in range(14)) + "</g><circle cx='400' cy='320' r='40' fill='#d9442b'/>")

# T10-S craft session flyers — must keep FINAL 4 p.m. / DRAFT 3 p.m.
flyer("craft-session-final", ["CRAFT", "SESSION"], ["November 22 · 4 p.m.", "Community Center studio"], "#f3eef9", "#7a4f9a", stamp="FINAL", foot="Bring a friend!")
flyer("craft-session-draft", ["CRAFT", "SESSION"], ["November 22 · 3 p.m.", "Community Center studio"], "#f3eef9", "#7a4f9a", stamp="DRAFT", foot="Bring a friend!")

# T13-S concert posts
flyer("concert-2025", ["SUMMER", "CONCERT", "2025"], ["June 12, 2025 · 6 p.m.", "Riverside Stage"], "#fff4e0", "#d9822b", foot="Maple Music")
flyer("concert-2026", ["SUMMER", "CONCERT", "2026"], ["June 20, 2026 · 6 p.m.", "Riverside Stage"], "#e8f4ff", "#2b6cb0", foot="Maple Music")

# Library account banner (post photo)
scene("library-hours", text(400, 150, "Maple Library", 60, "#20364d", 800) + text(400, 215, "NEW OPENING HOURS", 30, "#41658a", 700, extra="letter-spacing='4'")
      + "".join(text(400, 310 + i * 70, l, 34, "#23313f", 600) for i, l in enumerate(["From November 1", "Weekdays 10 a.m.–6 p.m.", "Saturday 10 a.m.–2 p.m.", "Sunday closed"])), "#eaf1f7")
scene("library-summer-hours", text(400, 150, "Maple Library", 60, "#20364d", 800) + text(400, 215, "SUMMER HOURS", 30, "#41658a", 700, extra="letter-spacing='4'")
      + "".join(text(400, 310 + i * 70, l, 34, "#23313f", 600) for i, l in enumerate(["June 1 – October 31", "Weekdays 9 a.m.–7 p.m.", "Saturday 10 a.m.–4 p.m.", "Sunday noon–4 p.m."])), "#f6f1e3")

# ======================= MESSENGER APP =======================
flyer("lunch-flyer", ["COMMUNITY", "LUNCH"], ["Saturday · noon", "Community Center"], "#fdf3e1", "#c4553a", foot="Everyone welcome · by Pat")
flyer("cleanup-flyer", ["STREET", "CLEANUP"], ["Saturday, October 12 · 9 a.m.", "Meet at Oak & 3rd"], "#eef6ea", "#4a8a3a", foot="Gloves provided")
flyer("sewing-workshop-flyer", ["SEWING", "WORKSHOP"], ["November 22 · 10 a.m.–noon", "Town Hall", "Guests welcome"], "#fbeef3", "#b04a7a", foot="Hosted by Nora")
scene("workshop-kit", """
  <rect y='420' width='800' height='180' fill='#c9a77c'/>
  <rect x='160' y='230' width='480' height='240' rx='16' fill='#e9d8bd' stroke='#b39a72' stroke-width='6'/>
  <circle cx='290' cy='330' r='60' fill='#e8364f'/><circle cx='420' cy='340' r='55' fill='#3c6fc4'/>
  <path d='M500 290 l90 120 M590 290 l-90 120' stroke='#555' stroke-width='12' stroke-linecap='round'/><circle cx='500' cy='420' r='18' fill='none' stroke='#555' stroke-width='8'/><circle cx='590' cy='420' r='18' fill='none' stroke='#555' stroke-width='8'/>""", "#efe6d8")


# T12-M chair layouts (top-down). Target = BLUE chairs in rows with a WIDE central aisle.
def chairs(rows, cols_left, cols_right, gap, color, ox=90, oy=110, sp=46):
    out = ""
    for r in range(rows):
        for c in range(cols_left):
            out += f"<rect x='{ox + c * sp}' y='{oy + r * 52}' width='34' height='34' rx='6' fill='{color}'/>"
        for c in range(cols_right):
            out += f"<rect x='{ox + cols_left * sp + gap + c * sp}' y='{oy + r * 52}' width='34' height='34' rx='6' fill='{color}'/>"
    return out


floor = "<rect x='40' y='40' width='720' height='520' fill='#e7dfd2' stroke='#b9ad99' stroke-width='8'/><rect x='300' y='60' width='200' height='30' fill='#9a8f7d'/>"
BLUE, RED = "#2f6fd6", "#c0392b"
layouts = {
    "layout-a": floor + chairs(8, 5, 5, 40, BLUE),              # narrow aisle, blue
    "layout-b": floor + "".join(f"<rect x='{400 + 200 * __import__('math').cos(i / 14 * 6.283) - 17:.0f}' y='{320 + 200 * __import__('math').sin(i / 14 * 6.283) - 17:.0f}' width='34' height='34' rx='6' fill='{BLUE}'/>" for i in range(14)),
    "layout-c": floor + "".join(f"<circle cx='{x}' cy='{y}' r='50' fill='#a8723f'/>" + "".join(f"<rect x='{x + 70 * __import__('math').cos(k * 1.571) - 14:.0f}' y='{y + 70 * __import__('math').sin(k * 1.571) - 14:.0f}' width='28' height='28' rx='5' fill='{BLUE}'/>" for k in range(4)) for x, y in [(220, 220), (580, 220), (220, 440), (580, 440)]),
    "layout-d": floor + chairs(8, 4, 4, 150, BLUE, ox=95),      # TARGET: wide central aisle, blue
    "layout-e": floor + chairs(8, 4, 4, 150, RED, ox=95),       # wide aisle but red chairs
    "layout-f": floor + chairs(8, 12, 0, 0, BLUE, ox=120, sp=48),  # no aisle
}
for n, body in layouts.items():
    save(n, svg(800, 600, body, "#cfc6b8"))

# T12-M empty rooms (device gallery). Main hall = large empty room.
scene("room-main-hall", "<rect x='0' y='380' width='800' height='220' fill='#c9b48f'/><rect x='0' y='0' width='800' height='380' fill='#efe9df'/>" + "".join(f"<rect x='{80 + i * 170}' y='90' width='110' height='190' fill='#cfe3f2' stroke='#b9ad99' stroke-width='6'/>" for i in range(4)) + "<rect x='330' y='250' width='140' height='130' fill='#8a6a46'/>", "#efe9df")
scene("room-side-room", "<rect x='0' y='400' width='800' height='200' fill='#b7a07c'/><rect x='0' y='0' width='800' height='400' fill='#e6efe6'/><rect x='560' y='120' width='150' height='200' fill='#cfe3f2' stroke='#9aa' stroke-width='6'/><rect x='120' y='240' width='120' height='160' fill='#8a6a46'/>", "#e6efe6")
scene("room-storage", "<rect x='0' y='420' width='800' height='180' fill='#9a9488'/><rect width='800' height='420' fill='#d9d6cf'/>" + "".join(f"<rect x='{60 + (i % 5) * 140}' y='{250 - (i // 5) * 110}' width='120' height='100' fill='#b9905f' stroke='#8a6a46' stroke-width='5'/>" for i in range(8)), "#d9d6cf")

# T13-M Elena status image
scene("status-rain", """
  <rect width='800' height='1200' fill='#5d7f99'/>
  """ + "".join(f"<path d='M{(i * 97) % 800} {(i * 151) % 1200} l -20 60' stroke='#cfe3f2' stroke-width='5' stroke-linecap='round'/>" for i in range(60))
      + "<rect x='60' y='420' width='680' height='360' rx='30' fill='#00000055'/>"
      + "".join(text(400, 500 + i * 70, l, 44, "#fff", 800) for i, l in enumerate(["Too wet for the park today.", "We’ll meet indoors instead,", "same time, 11 a.m."])), "#5d7f99", 800, 1200)

print("Wrote v2 placeholders to", os.path.abspath(OUT))
