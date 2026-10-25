# Real photos for the social app

Put a generated photo in this folder with the **same base name** as the
placeholder it replaces, and the app uses it automatically (the SVG in
`public/assets/social/` is only a fallback). `.webp`, `.jpg`, `.jpeg` and `.png`
all work. Restart `npm run dev` after adding files.

```
src/assets/photos/planter-deep-wooden.webp   → replaces public/assets/social/planter-deep-wooden.svg
src/assets/photos/avatars/susan.webp          → profile picture for Susan Clark
```

Keep files small: export around **1200 px on the long side as .webp, quality ~80**
(the two existing feed photos are 1200×800 and 800×1200, ~100 KB each).

## Style for every image

Add this to the end of each prompt so the set matches the existing feed photos
(`noah-kindergarten-100-days.webp`, `community-lunch-flyer.webp`):

> Photorealistic smartphone photo, natural light, warm and friendly, everyday
> setting, slightly imperfect casual framing, no watermark, no logos, no brand
> names, no text unless specified.

Everything must stay fictional: no real brands, no recognizable real people or places.

## Images

**Must-keep** notes are what the tasks depend on — check each result against them.

### Noah's artwork — Family chat (P29: find the blue paper boat)
Photos *of* a child's artwork taken by a parent: real paper, crayon/paint/cut
paper, on a table or fridge. **No captions or writing anywhere** (P29 requires the
boat to be found visually, not by text). 4:3, 1200×900.

| File | Prompt | Must-keep |
| --- | --- | --- |
| `art-blue-boat` | A kindergartner's blue paper boat craft — a boat cut from blue construction paper with a triangular sail, glued on white paper with crayon waves, photographed on a kitchen table | Clearly **blue** and clearly a **boat**; no other boats in the set |
| `art-red-kite` | A child's red diamond-shaped kite drawn in crayon with a wiggly string and bows, on white paper stuck to a fridge with a magnet | Red kite |
| `art-green-tree` | A child's painting of a big green tree with a brown trunk, poster paint on white paper, on a table | Green tree |
| `art-yellow-sun` | A child's crayon drawing of a smiling yellow sun with rays, on white paper | Yellow sun |
| `art-orange-fish` | A child's orange fish made from torn orange tissue paper glued onto blue paper | Orange fish |
| `art-purple-flower` | A child's purple flower drawing with a green stem and leaves, crayon on white paper | Purple flower |

### Garden Club planters (P34)
4:3, 1200×900. Shown inside comments; each must be obviously different in depth.

| File | Prompt | Must-keep |
| --- | --- | --- |
| `planter-deep-wooden` | A deep rectangular wooden planter box with young herb plants, standing on a small apartment balcony | Obviously **deep** and **wooden** |
| `planter-shallow-tray` | A shallow green plastic seed tray with small seedlings, on the same kind of balcony | Obviously **shallow**, **green**, a tray |

### Volunteer supply photos (P28: send only notebooks and pens)
4:3, 1200×900. One subject per photo, on a plain community-centre table.

| File | Prompt | Must-keep |
| --- | --- | --- |
| `supply-notebooks` | A neat stack of new spiral notebooks in assorted colours on a folding table | Only notebooks |
| `supply-pens` | A handful of ballpoint pens in blue, black and red lying on a folding table | Only pens |
| `supply-cleaning-spray` | Two unbranded spray bottles of cleaning solution on a folding table | Only spray bottles, no labels |
| `supply-gloves` | A pile of yellow rubber cleaning gloves on a folding table | Only gloves |

### Phone gallery (P32: post the cake to Family)
Square, 1200×1200 — these look like photos on the participant's own phone.

| File | Prompt | Must-keep |
| --- | --- | --- |
| `gallery-noah-birthday-cake` | A homemade birthday cake with blue icing and three lit candles on a kitchen counter, child's birthday | Clearly a birthday cake. Writing "Noah" in icing is nice but optional |
| `gallery-garden-flowers` | Pink and yellow flowers in a backyard garden bed | Flowers, no cake |
| `gallery-shopping-receipt` | A crumpled paper grocery receipt lying on a kitchen counter, photographed from above | Receipt; text unreadable/blurred is fine |

### Recipes shared by Susan (P05–P08)
4:3, 1200×900. Overhead food photography, one bowl each, distinct colours.

| File | Prompt | Must-keep |
| --- | --- | --- |
| `recipe-tomato-soup` | A bowl of roasted red tomato soup with a basil leaf, on a wooden table | Red soup |
| `recipe-mushroom-soup` | A bowl of creamy beige mushroom soup topped with sliced mushrooms and thyme | Visibly mushrooms |
| `recipe-lentil-soup` | A bowl of hearty orange-brown lentil soup with carrots | Lentils visible |

### Flyers (P40, P48)
Portrait 2:3, 800×1200, styled like the existing `community-lunch-flyer.webp`
(a printed poster with an illustrated/photo scene). These need **exact text** — check spelling, or keep the SVG.

| File | Prompt | Must-keep text |
| --- | --- | --- |
| `flyer-seed-swap` | A friendly community poster for a seed swap, with seed packets, small pots and a community garden scene | "SEED SWAP", "Saturday, November 16 · 2 p.m.", "Community Garden", "All welcome" |
| `flyer-craft-fair` | A friendly community poster for a craft fair with handmade crafts, knitting and pottery | "COMMUNITY CRAFT FAIR", "November 22 · 10 a.m.–2 p.m.", "Town Hall", "Open to everyone" |

### Maps (P21, P24, P44)
Landscape 4:3, 1200×900. Ask for a **"screenshot of a generic phone map app"**
(flat map style, not a satellite photo), fictional streets, a river where noted.
Labels must be legible — if the generator mangles them, keep the SVG.

| File | Prompt | Must-keep text |
| --- | --- | --- |
| `map-riverside-walk` | Walking route drawn as a dashed line along a river, green start pin and red finish pin | "Start: Boat House", "Finish: Stone Bridge" |
| `map-hill-trail` | Hiking route dashed line up a hill with contour lines | "Start: Car Park", "Finish: Hilltop" |
| `map-river-cafe` | Single red pin beside a river | "River Café", "18 River Road" |
| `map-river-park` | Single pin on a park area | "River Park" |
| `map-museum-south-pickup` | Pin at the side of a museum building on a lane | "South pickup bay", "South Lane" |
| `map-museum-front-entrance` | Pin at the front of the same museum on a main street | "Front entrance", "Main Street" |

### Other post photos
| File | Size | Prompt | Must-keep |
| --- | --- | --- | --- |
| `river-cafe-menu` | 4:5, 960×1200 | A printed café menu card on a table, photographed from above | Title "River Café"; items legible is nice, not required |
| `lee-garden-after-rain` | 4:3 | A small neighbourhood community garden after rain, wet leaves, flower beds, raised beds | No people needed |
| `noah-music-lesson` | 4:3 | A child's small hands on piano keys at a music lesson, face not visible | Hands/piano only — no face |
| `museum-visit` | 4:3 | Exterior of a classical-style art museum with columns and steps, sunny day | Fictional building, no signs |

## Avatars (optional)
Square, 512×512, head-and-shoulders portrait, plain background. Save as
`avatars/<id>.webp`. People who already have a photo (Sam, Lee, Pat, Anna, Adam,
Maria) are not listed.

| File | Person | Prompt |
| --- | --- | --- |
| `avatars/susan` | Susan Clark, the participant's sister | Woman in her 60s, warm smile, cardigan |
| `avatars/maya` | Maya Patel, friend | Woman in her 40s, friendly, casual |
| `avatars/daniel` | Daniel Brooks, museum organizer | Man in his 50s, glasses, smart-casual |
| `avatars/nora` | Nora Kim, book & craft organizer | Woman in her 50s, cheerful |
| `avatars/ben` | Ben Carter | Man in his 60s, outdoorsy |
| `avatars/elena` | Elena Ruiz, walking group | Woman in her 50s, sporty jacket |
| `avatars/omar` | Omar Haddad | Man in his 40s, beard |
| `avatars/priya` | Priya Shah, volunteer coordinator | Woman in her 30s, lanyard |
| `avatars/luis` | Luis Ortega | Man in his 30s |
| `avatars/rosa` | Rosa Martinez, gardening coordinator | Woman in her 60s, sun hat, garden behind |
| `avatars/grace` | Grace Hill, neighbor | Woman in her 70s |
| `avatars/tom` | Tom Baker, neighbor | Man in his 70s |
| `avatars/me` | Alex Morgan, the participant | Gender-neutral older adult — or leave as initials so it suits any participant |
| `avatars/everyday_kitchen` | Recipe page logo | A simple photo of a wooden spoon and fresh vegetables (page logo, not a person) |
| `avatars/tomato_thyme` | Recipe page logo | Fresh tomatoes and a sprig of thyme |
| `avatars/lentil_lane` | Recipe page logo | A small bowl of dry lentils |
