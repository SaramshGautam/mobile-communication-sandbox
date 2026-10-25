"""Generate simple, labelled SVG placeholder images for the social sandbox.

Run:  python3 scripts/makePlaceholders.py
Output: public/assets/social/*.svg  (replace any file with a real image of the
same name, or point the data at a new path in src/social/world.js).
"""
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "social")
os.makedirs(OUT, exist_ok=True)

FONT = "font-family='Inter, Segoe UI, Helvetica, Arial, sans-serif'"


def svg(w, h, body, bg="#f6f1e7"):
    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {w} {h}' width='{w}' height='{h}'>"
        f"<rect width='{w}' height='{h}' fill='{bg}'/>{body}</svg>"
    )


def text(x, y, s, size=40, fill="#23313f", weight=700, anchor="middle", extra=""):
    s = s.replace("&", "&amp;")
    return f"<text x='{x}' y='{y}' {FONT} font-size='{size}' font-weight='{weight}' fill='{fill}' text-anchor='{anchor}' {extra}>{s}</text>"


def save(name, content):
    with open(os.path.join(OUT, name + ".svg"), "w") as f:
        f.write(content)


# ---------- Noah's artwork (child-drawing style, NO captions) ----------
paper = "<rect x='30' y='30' width='740' height='540' rx='6' fill='#fffdf7' stroke='#e5dcc8' stroke-width='4'/>"
crayon = "stroke-linecap='round' stroke-linejoin='round'"
art = {
    "art-blue-boat": f"""{paper}
      <path d='M120 470 Q 250 440 400 470 T 680 470' fill='none' stroke='#7fb3e6' stroke-width='14' {crayon}/>
      <path d='M180 380 L620 380 L540 460 L260 460 Z' fill='#2f6fd6' stroke='#1d4fa3' stroke-width='10' {crayon}/>
      <path d='M400 370 L400 140 L560 360 Z' fill='#8ab8f5' stroke='#1d4fa3' stroke-width='9' {crayon}/>
      <path d='M390 360 L390 180 L260 360 Z' fill='#cfe2ff' stroke='#1d4fa3' stroke-width='9' {crayon}/>""",
    "art-red-kite": f"""{paper}
      <path d='M400 90 L560 260 L400 430 L240 260 Z' fill='#e0413a' stroke='#a82621' stroke-width='10' {crayon}/>
      <path d='M400 90 L400 430 M240 260 L560 260' stroke='#a82621' stroke-width='7'/>
      <path d='M400 430 Q 360 480 410 510 T 380 560' fill='none' stroke='#555' stroke-width='6'/>
      <path d='M392 480 l-26 -12 m40 40 l26 -14' stroke='#e0413a' stroke-width='10' {crayon}/>""",
    "art-green-tree": f"""{paper}
      <rect x='370' y='340' width='60' height='170' fill='#8a5a2b' stroke='#5e3b19' stroke-width='8'/>
      <circle cx='400' cy='250' r='150' fill='#3fa34d' stroke='#25732f' stroke-width='10'/>
      <circle cx='320' cy='300' r='80' fill='#4cb85a' stroke='#25732f' stroke-width='8'/>
      <circle cx='490' cy='300' r='80' fill='#4cb85a' stroke='#25732f' stroke-width='8'/>""",
    "art-yellow-sun": f"""{paper}
      <g stroke='#e3a400' stroke-width='14' {crayon}>
      <path d='M400 70 v70 M400 460 v70 M170 300 h70 M560 300 h70 M240 140 l50 50 M510 410 l50 50 M560 140 l-50 50 M240 460 l50 -50'/></g>
      <circle cx='400' cy='300' r='130' fill='#ffd21f' stroke='#e3a400' stroke-width='10'/>
      <path d='M350 330 Q 400 380 450 330' fill='none' stroke='#9b6b00' stroke-width='9' {crayon}/>
      <circle cx='355' cy='275' r='12' fill='#9b6b00'/><circle cx='445' cy='275' r='12' fill='#9b6b00'/>""",
    "art-orange-fish": f"""{paper}
      <path d='M200 300 Q 380 130 560 300 Q 380 470 200 300 Z' fill='#f28a1e' stroke='#b85f06' stroke-width='10'/>
      <path d='M560 300 L660 210 L660 390 Z' fill='#f6a54e' stroke='#b85f06' stroke-width='10' {crayon}/>
      <circle cx='290' cy='280' r='16' fill='#2b2b2b'/>
      <path d='M180 160 q 10 -20 20 0 M140 230 q 8 -16 16 0' fill='none' stroke='#7fb3e6' stroke-width='6'/>""",
    "art-purple-flower": f"""{paper}
      <path d='M400 330 Q 390 430 400 520' stroke='#3fa34d' stroke-width='14' fill='none' {crayon}/>
      <path d='M400 450 q -70 -40 -110 0 q 50 40 110 0' fill='#4cb85a'/>
      <g fill='#8b4fc7' stroke='#5e2d94' stroke-width='8'>
        <circle cx='400' cy='170' r='70'/><circle cx='480' cy='240' r='70'/><circle cx='320' cy='240' r='70'/>
        <circle cx='450' cy='320' r='70'/><circle cx='350' cy='320' r='70'/></g>
      <circle cx='400' cy='255' r='50' fill='#ffd21f' stroke='#e3a400' stroke-width='8'/>""",
}
for name, body in art.items():
    save(name, svg(800, 600, body, bg="#efe6d2"))


# ---------- Generic labelled object photo ----------
def object_photo(name, label, body, bg="#eef2f4"):
    save(
        name,
        svg(
            800,
            600,
            body,  # label lives in the app (caption/comment), not in the image
            bg,
        ),
    )


object_photo("planter-deep-wooden", "Deep wooden planter", """
  <rect x='0' y='420' width='800' height='100' fill='#d9cdb8'/>
  <path d='M200 200 L600 200 L570 470 L230 470 Z' fill='#a8723f' stroke='#6e4521' stroke-width='8'/>
  <g stroke='#6e4521' stroke-width='5'><path d='M212 270 H588 M222 340 H578 M230 410 H570'/></g>
  <path d='M260 200 q 40 -110 90 -20 q 30 -120 90 0 q 40 -100 100 0' fill='#4c9a3f'/>""", "#f3ede2")
object_photo("planter-shallow-tray", "Shallow green tray", """
  <rect x='0' y='420' width='800' height='100' fill='#d9cdb8'/>
  <path d='M150 360 L650 360 L620 440 L180 440 Z' fill='#3e9a63' stroke='#256b41' stroke-width='8'/>
  <path d='M220 360 q 20 -50 40 0 M330 360 q 20 -60 40 0 M440 360 q 20 -50 40 0 M550 360 q 20 -60 40 0' fill='#5cb85c'/>""", "#f3ede2")
object_photo("supply-notebooks", "Notebooks", """
  <g transform='rotate(-8 400 280)'><rect x='220' y='120' width='260' height='330' rx='10' fill='#3c6fc4'/><rect x='240' y='120' width='18' height='330' fill='#2a4f8f'/></g>
  <g transform='rotate(6 450 300)'><rect x='330' y='140' width='260' height='330' rx='10' fill='#e2683c'/><rect x='350' y='140' width='18' height='330' fill='#a8461f'/></g>""")
object_photo("supply-pens", "Pens", """
  <g stroke-linecap='round'>
  <path d='M200 420 L600 160' stroke='#1f4fa8' stroke-width='34'/><path d='M230 450 L630 190' stroke='#d33b3b' stroke-width='34'/>
  <path d='M260 480 L660 220' stroke='#2b2b2b' stroke-width='34'/></g>""")
object_photo("supply-cleaning-spray", "Cleaning spray", """
  <rect x='330' y='220' width='160' height='270' rx='30' fill='#47b3d6'/><rect x='370' y='150' width='80' height='80' fill='#f2f2f2'/>
  <path d='M450 160 L540 160 L540 190 L450 200 Z' fill='#f2f2f2'/><rect x='350' y='300' width='120' height='90' rx='8' fill='#fff' opacity='.85'/>""")
object_photo("supply-gloves", "Gloves", """
  <g fill='#f2c84b' stroke='#b8901c' stroke-width='6'>
  <path d='M220 470 V280 q0 -30 25 -30 q25 0 25 30 V230 q0 -30 25 -30 q25 0 25 30 V220 q0 -30 25 -30 q25 0 25 30 V250 q0 -30 25 -30 q25 0 25 30 V470 Z'/>
  <path d='M440 470 V280 q0 -30 25 -30 q25 0 25 30 V230 q0 -30 25 -30 q25 0 25 30 V220 q0 -30 25 -30 q25 0 25 30 V250 q0 -30 25 -30 q25 0 25 30 V470 Z'/></g>""")

# ---------- Device gallery photos ----------
save("gallery-noah-birthday-cake", svg(800, 800, """
  <rect width='800' height='800' fill='#fbe9ef'/>
  <ellipse cx='400' cy='620' rx='300' ry='50' fill='#e9d2da'/>
  <rect x='180' y='380' width='440' height='230' rx='20' fill='#fff7f0' stroke='#e7b9a8' stroke-width='8'/>
  <path d='M180 420 q 55 40 110 0 q 55 40 110 0 q 55 40 110 0 q 55 40 110 0' fill='none' stroke='#5aa9e6' stroke-width='18'/>
  <g fill='#ffd21f' stroke='#c8901a' stroke-width='5'>
    <rect x='280' y='280' width='24' height='100'/><rect x='388' y='280' width='24' height='100'/><rect x='496' y='280' width='24' height='100'/></g>
  <g fill='#ff8a3d'><ellipse cx='292' cy='262' rx='14' ry='24'/><ellipse cx='400' cy='262' rx='14' ry='24'/><ellipse cx='508' cy='262' rx='14' ry='24'/></g>
  """ + text(400, 530, "NOAH", 70, "#d94f7a", 800)))
save("gallery-garden-flowers", svg(800, 800, """
  <rect width='800' height='800' fill='#cfe8c4'/><rect y='560' width='800' height='240' fill='#6f9e4f'/>
  <g fill='#e84a7f'><circle cx='200' cy='420' r='60'/><circle cx='560' cy='380' r='70'/></g>
  <g fill='#ffd21f'><circle cx='380' cy='460' r='55'/><circle cx='680' cy='480' r='45'/></g>
  <g stroke='#3d7a2a' stroke-width='12'><path d='M200 480 V700 M560 450 V700 M380 515 V700 M680 525 V700'/></g>""", "#cfe8c4"))
save("gallery-shopping-receipt", svg(800, 800, """
  <rect width='800' height='800' fill='#d7d9dc'/>
  <path d='M240 80 H560 V720 l-20 -16 l-20 16 l-20 -16 l-20 16 l-20 -16 l-20 16 l-20 -16 l-20 16 l-20 -16 l-20 16 l-20 -16 l-20 16 l-20 -16 l-20 16 l-20 -16 l-20 16 Z' fill='#fff'/>
  """ + text(400, 150, "GROCERY MART", 30) + "".join(
    text(270, 230 + i * 52, item, 24, "#444", 500, "start") + text(530, 230 + i * 52, price, 24, "#444", 500, "end")
    for i, (item, price) in enumerate([("Milk", "3.49"), ("Bread", "2.99"), ("Apples", "4.20"), ("Eggs", "5.10"), ("Coffee", "8.75"), ("Soap", "2.40")])
) + text(270, 600, "TOTAL", 28, "#222", 800, "start") + text(530, 600, "26.93", 28, "#222", 800, "end"), "#d7d9dc"))


# ---------- Maps ----------
def map_img(name, title, pin_label, extra="", pins=None):
    pins = pins or [(400, 300, pin_label, "#e0413a")]
    pin_svg = ""
    for x, y, label, color in pins:
        pin_svg += (
            f"<path d='M{x} {y} c -30 -40 -40 -60 -40 -80 a40 40 0 1 1 80 0 c0 20 -10 40 -40 80 Z' fill='{color}' stroke='#fff' stroke-width='5'/>"
            f"<circle cx='{x}' cy='{y-82}' r='14' fill='#fff'/>"
            f"<rect x='{x-150}' y='{y+12}' width='300' height='50' rx='25' fill='#fff' stroke='#ccd4dc'/>"
            + text(x, y + 46, label, 24, "#23313f", 700)
        )
    body = f"""
      <rect width='800' height='600' fill='#e8efe3'/>
      <path d='M-20 420 Q 200 360 400 430 T 820 400' stroke='#9cc7e8' stroke-width='60' fill='none'/>
      <g stroke='#fff' stroke-width='22' fill='none'><path d='M0 160 H800'/><path d='M260 0 V600'/><path d='M560 0 V600'/></g>
      <g stroke='#f6d77a' stroke-width='10' fill='none'><path d='M0 160 H800'/></g>
      <rect x='600' y='40' width='160' height='90' fill='#cfe3c0'/><rect x='300' y='200' width='200' height='120' fill='#dde3ea'/>
      {extra}{pin_svg}
      <rect x='0' y='0' width='800' height='64' fill='#ffffffe6'/>""" + text(24, 42, title, 28, "#23313f", 800, "start")
    save(name, svg(800, 600, body))


map_img("map-riverside-walk", "Riverside Walk map", "", extra="""
  <path d='M120 470 C 250 380, 380 520, 520 400 S 690 300, 700 250' stroke='#e0413a' stroke-width='10' stroke-dasharray='22 14' fill='none'/>""",
        pins=[(120, 470, "Start: Boat House", "#2e8b57"), (700, 250, "Finish: Stone Bridge", "#e0413a")])
map_img("map-hill-trail", "Hill Trail map", "", extra="""
  <path d='M150 520 C 220 300, 420 360, 480 200 S 640 120, 680 110' stroke='#8b4fc7' stroke-width='10' stroke-dasharray='22 14' fill='none'/>""",
        pins=[(150, 520, "Start: Car Park", "#2e8b57"), (640, 150, "Finish: Hilltop", "#8b4fc7")])
map_img("map-river-cafe", "River Café · 18 River Road", "River Café")
map_img("map-river-park", "River Park · Park Avenue", "River Park")
map_img("map-museum-south-pickup", "Museum south pickup bay · South Lane", "South pickup bay")
map_img("map-museum-front-entrance", "Museum front entrance · Main Street", "Front entrance")

# ---------- Menu / flyers / misc ----------
save("river-cafe-menu", svg(800, 1000, text(400, 120, "River Café", 64, "#5b3a1e", 800) + text(400, 175, "MENU", 30, "#8a6a4a", 600, extra="letter-spacing='8'") +
     "".join(text(140, 280 + i * 80, a, 32, "#3a2a1a", 600, "start") + text(660, 280 + i * 80, b, 32, "#3a2a1a", 600, "end")
             for i, (a, b) in enumerate([("Tomato soup", "$6"), ("Grilled cheese", "$8"), ("Garden salad", "$7"), ("Scones", "$4"), ("Coffee", "$3"), ("Tea", "$3"), ("Hot chocolate", "$4")])), "#fbf3e4"))


def flyer(name, title_lines, sub, foot, bg, accent):
    body = "".join(text(400, 170 + i * 92, l, 84, accent, 800) for i, l in enumerate(title_lines))
    y = 170 + len(title_lines) * 92 + 30
    body += f"<rect x='120' y='{y}' width='560' height='76' rx='38' fill='#ffffffcc'/>" + text(400, y + 50, sub, 34, "#23313f", 700)
    body += f"<circle cx='400' cy='{y+300}' r='170' fill='{accent}' opacity='.15'/>"
    body += text(400, 1130, foot, 40, "#fff", 800).replace("<text", f"<rect x='80' y='1072' width='640' height='90' rx='20' fill='{accent}'/><text", 1)
    save(name, svg(800, 1200, body, bg))


flyer("flyer-seed-swap", ["SEED", "SWAP"], "Saturday, November 16 · 2 p.m.", "Community Garden · All welcome", "#f1f6e8", "#4a8a3a")
flyer("flyer-craft-fair", ["COMMUNITY", "CRAFT FAIR"], "November 22 · 10 a.m.–2 p.m.", "Town Hall · Open to everyone", "#fbeee8", "#c4553a")


def food(name, title, soup, garnish):
    body = f"""
      <rect width='800' height='600' fill='#e9ddc9'/>
      <ellipse cx='400' cy='330' rx='280' ry='190' fill='#fff' stroke='#d8cbb5' stroke-width='6'/>
      <ellipse cx='400' cy='320' rx='220' ry='140' fill='{soup}'/>
      {garnish}"""
    save(name, svg(800, 600, body))


food("recipe-tomato-soup", "Roasted tomato soup", "#d9442b", "<g fill='#3d8a3a'><ellipse cx='360' cy='300' rx='26' ry='12'/><ellipse cx='420' cy='330' rx='26' ry='12'/></g>")
food("recipe-mushroom-soup", "Creamy mushroom soup", "#c9b08a", "<g fill='#7a5a3a'><ellipse cx='340' cy='300' rx='34' ry='18'/><ellipse cx='450' cy='320' rx='34' ry='18'/><ellipse cx='400' cy='280' rx='28' ry='15'/></g>")
food("recipe-lentil-soup", "Hearty lentil soup", "#c7892f", "<g fill='#a8642a'>" + "".join(f"<circle cx='{300+i*37%200}' cy='{270+i*23%110}' r='9'/>" for i in range(18)) + "</g>")

object_photo("lee-garden-after-rain", "Oak Street garden", """
  <rect y='330' width='800' height='190' fill='#7aa85a'/>
  <g fill='#e84a7f'><circle cx='150' cy='300' r='40'/><circle cx='620' cy='280' r='45'/></g>
  <g fill='#ffd21f'><circle cx='320' cy='320' r='36'/><circle cx='480' cy='300' r='38'/></g>
  <g stroke='#3d7a2a' stroke-width='10'><path d='M150 340 V420 M620 325 V420 M320 356 V420 M480 338 V420'/></g>""", "#cde6f3")
object_photo("noah-music-lesson", "First music lesson", """
  <rect x='180' y='250' width='440' height='200' rx='16' fill='#2b2b2b'/>
  <g fill='#fff'>""" + "".join(f"<rect x='{200+i*50}' y='330' width='44' height='110' rx='4'/>" for i in range(8)) + """</g>
  <g fill='#2b2b2b'>""" + "".join(f"<rect x='{232+i*50}' y='330' width='26' height='66'/>" for i in [0, 1, 3, 4, 5]) + """</g>
  <g fill='#3c6fc4'><circle cx='620' cy='160' r='22'/><rect x='636' y='70' width='8' height='92'/></g>""", "#f3eadf")
object_photo("museum-visit", "City Art Museum", """
  <path d='M150 200 L400 90 L650 200 Z' fill='#d8d2c4' stroke='#9a917f' stroke-width='6'/>
  <rect x='170' y='200' width='460' height='30' fill='#cfc8b8'/>
  <g fill='#ebe6da' stroke='#9a917f' stroke-width='4'>""" + "".join(f"<rect x='{195+i*90}' y='230' width='40' height='230'/>" for i in range(5)) + """</g>
  <rect x='150' y='460' width='500' height='40' fill='#cfc8b8'/>""", "#dbe7f2")

print("Wrote", len(os.listdir(OUT)), "files to", os.path.abspath(OUT))
