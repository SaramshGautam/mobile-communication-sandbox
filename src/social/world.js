// Baseline "social world" for the feed-style (Facebook-like) app.
// Every -S task starts from a fresh copy of this world (see tasks.js for the
// per-task start screen and any preloaded state such as an existing reaction).
//
// All names, places, URLs and documents are fictional.

import { photo as P, avatar as realAvatar } from "./photos.js";

const A = "/assets/avatars/";

export const ME = "me";

export const people = {
  me: { id: "me", name: "Alex Morgan", firstName: "Alex", bio: "Family, gardening and good books.", relationship: "you" },
  sam: { id: "sam", name: "Sam Rivera", firstName: "Sam", avatar: A + "sam-rivera.webp", bio: "Neighbor · Community lunch organizer", relationship: "friend" },
  lee: { id: "lee", name: "Lee Johnson", firstName: "Lee", avatar: A + "lee-johnson.webp", bio: "Oak Street since 2009", relationship: "neighbor" },
  pat: { id: "pat", name: "Pat Williams", firstName: "Pat", avatar: A + "pat-williams.webp", bio: "Oak Street Neighbors admin", relationship: "neighbor" },
  anna: { id: "anna", name: "Anna Morgan", firstName: "Anna", avatar: A + "anna-morgan.webp", bio: "Mom of Noah", relationship: "daughter" },
  adam: { id: "adam", name: "Adam Morgan", firstName: "Adam", avatar: A + "david-morgan.webp", bio: "", relationship: "husband" },
  susan: { id: "susan", name: "Susan Clark", firstName: "Susan", bio: "Soup enthusiast", relationship: "sister" },
  maria: { id: "maria", name: "Maria Santos", firstName: "Maria", avatar: A + "maria-santos.webp", bio: "", relationship: "friend" },
  maya: { id: "maya", name: "Maya Patel", firstName: "Maya", bio: "Community shelf volunteer", relationship: "friend" },
  daniel: { id: "daniel", name: "Daniel Brooks", firstName: "Daniel", bio: "Museum Friends organizer", relationship: "friend" },
  nora: { id: "nora", name: "Nora Kim", firstName: "Nora", bio: "Book Club & Craft Circle organizer", relationship: "friend" },
  ben: { id: "ben", name: "Ben Carter", firstName: "Ben", bio: "", relationship: "friend" },
  elena: { id: "elena", name: "Elena Ruiz", firstName: "Elena", bio: "Walking Group organizer", relationship: "friend" },
  omar: { id: "omar", name: "Omar Haddad", firstName: "Omar", bio: "", relationship: "friend" },
  priya: { id: "priya", name: "Priya Shah", firstName: "Priya", bio: "Volunteer Team coordinator", relationship: "friend" },
  luis: { id: "luis", name: "Luis Ortega", firstName: "Luis", bio: "", relationship: "friend" },
  rosa: { id: "rosa", name: "Rosa Martinez", firstName: "Rosa", bio: "Gardening coordinator, Garden Club", relationship: "friend" },
  grace: { id: "grace", name: "Grace Hill", firstName: "Grace", bio: "", relationship: "neighbor" },
  tom: { id: "tom", name: "Tom Baker", firstName: "Tom", bio: "", relationship: "neighbor" },
  // Creator pages (recipes)
  everyday_kitchen: { id: "everyday_kitchen", name: "Everyday Kitchen", firstName: "Everyday Kitchen", isPage: true, bio: "Quick, healthy recipes for every day · 48K followers" },
  tomato_thyme: { id: "tomato_thyme", name: "Tomato & Thyme", firstName: "Tomato & Thyme", isPage: true, bio: "Seasonal comfort food · 12K followers" },
  lentil_lane: { id: "lentil_lane", name: "Lentil Lane", firstName: "Lentil Lane", isPage: true, bio: "Budget plant-based cooking · 9K followers" },
};

// People without a bundled avatar use src/assets/photos/avatars/<id>.webp if present.
for (const p of Object.values(people)) if (!p.avatar) p.avatar = realAvatar(p.id);

export const groups = {
  oak: {
    id: "oak", name: "Oak Street Neighbors", privacy: "Private group", color: "#41658a",
    members: ["me", "lee", "pat", "grace", "tom"], admins: ["pat"],
    description: "A private group for Oak Street neighbors to share local news, events and help.",
  },
  book: {
    id: "book", name: "Book Club", privacy: "Private group", color: "#7a4f9a",
    members: ["me", "nora", "ben"], admins: ["nora"],
    description: "Monthly book club. Nora organizes our meetings and reading lists.",
    featured: ["book_reading_list"],
  },
  walk: {
    id: "walk", name: "Walking Group", privacy: "Private group", color: "#2e8b57",
    members: ["me", "elena", "omar"], admins: ["elena"],
    description: "Saturday morning walks. Elena organizes our routes.",
  },
  volunteer: {
    id: "volunteer", name: "Volunteer Team", privacy: "Private group", color: "#c4553a",
    members: ["me", "priya", "luis"], admins: ["priya"],
    description: "Volunteers for the community food pantry. Priya coordinates the team and rota.",
  },
  family: {
    id: "family", name: "Family", privacy: "Private group", color: "#d9822b",
    members: ["me", "anna", "adam"], admins: ["me"],
    description: "Just us — photos and family news.",
  },
  garden: {
    id: "garden", name: "Garden Club", privacy: "Private group", color: "#4a8a3a",
    members: ["me", "rosa", "ben"], admins: ["rosa"],
    description: "Garden Club for Oak Street gardeners. Rosa Martinez is our gardening coordinator — ask her about tools, seeds and planting sessions.",
  },
  craft: {
    id: "craft", name: "Craft Circle", privacy: "Private group", color: "#b04a7a",
    members: ["me", "nora", "elena"], admins: ["nora"],
    description: "Sewing, knitting and craft workshops. Nora arranges our workshops.",
  },
  museum: {
    id: "museum", name: "Museum Friends", privacy: "Private group", color: "#3b6f8f",
    members: ["me", "daniel", "maya"], admins: ["daniel"],
    description: "Museum visits and tours. Daniel arranges our visits.",
  },
};

// ---------- Documents (opened in the in-app PDF viewer) ----------
export const documents = {
  nov_reading: {
    id: "nov_reading", filename: "November reading list — final.pdf",
    url: "https://lanternreaders.example/lists/november-reading-list-final.pdf",
    pages: [["Lantern Readers Book Club", "November reading list — FINAL", "", "Book: The Lantern House", "Read: chapters 1–4", "", "Discussion questions will be shared at the meeting.", "Members may share this list with friends."]],
  },
  oct_reading: {
    id: "oct_reading", filename: "October reading list.pdf",
    url: "https://lanternreaders.example/lists/october-reading-list.pdf",
    pages: [["Lantern Readers Book Club", "October reading list", "", "Book: The Quiet Orchard", "Read: chapters 5–9"]],
  },
  rota_nov_draft: {
    id: "rota_nov_draft", filename: "Nov08_rota_DRAFT.pdf", private: true,
    pages: [["Volunteer rota — November 8", "DRAFT — not final", "", "Alex: packing, 10 a.m.–noon", "Luis: welcome desk, noon–2 p.m.", "Priya: coordinator, all day"]],
  },
  rota_nov_final: {
    id: "rota_nov_final", filename: "Nov08_rota_FINAL.pdf", private: true,
    pages: [["Volunteer rota — November 8", "FINAL", "", "Alex: welcome desk, 10 a.m.–noon", "Luis: packing, noon–2 p.m.", "Priya: coordinator, all day"]],
  },
  rota_oct_final: {
    id: "rota_oct_final", filename: "Oct25_rota_FINAL.pdf", private: true,
    pages: [["Volunteer rota — October 25", "FINAL", "", "Alex: packing, 9–11 a.m.", "Luis: welcome desk, 11 a.m.–1 p.m."]],
  },
  museum_pickup: {
    id: "museum_pickup", filename: "Museum pickup instructions.pdf",
    url: "https://cityartmuseum.example/visit/museum-pickup-instructions.pdf",
    pages: [["City Art Museum", "Pickup instructions", "", "Drivers collecting visitors should use the south pickup bay on South Lane.", "Please wait in the marked pickup bay on South Lane.", "Do not stop at the front entrance on Main Street."]],
  },
};

// ---------- Map places (opened in the in-app map viewer) ----------
export const places = {
  river_cafe: { id: "river_cafe", name: "River Café", address: "18 River Road", image: P("map-river-cafe"), url: "https://maps.example/place/river-cafe-18-river-road" },
  river_park: { id: "river_park", name: "River Park", address: "Park Avenue", image: P("map-river-park"), url: "https://maps.example/place/river-park" },
  museum_south: { id: "museum_south", name: "Museum south pickup bay", address: "South Lane", image: P("map-museum-south-pickup"), url: "https://maps.example/place/museum-south-pickup-bay-south-lane" },
  museum_front: { id: "museum_front", name: "Museum front entrance — visitor map", address: "Main Street", image: P("map-museum-front-entrance"), url: "https://maps.example/place/museum-front-entrance" },
};

const photo = (id, src, alt, extra = {}) => ({ id, src, alt, ...extra });

// ---------- Posts ----------
// audience: "public" | "friends" | group id (via `group`)
// Comments: { id, author, text, time, image?, replies: [...], reactions? }
export const posts = [
  // ----- Home feed / profile posts -----
  {
    id: "anna_noah", author: "anna", audience: "friends", time: "Today · 9:14 AM", inFeed: 1,
    text: "Noah celebrating with the class today!",
    photos: [photo("photo_noah_100_days", "/assets/feed/noah-kindergarten-100-days.webp", "Noah and his classmates wearing decorated paper crowns in their classroom", { width: 1200, height: 800 })],
    reactions: { susan: "love", adam: "love", maria: "like", lee: "like", grace: "love" },
    comments: [
      { id: "c_noah_q", author: "adam", time: "1h", text: "What’s the celebration for?", replies: [
        { id: "c_noah_a", author: "anna", time: "52m", text: "They’ve reached their hundredth day of school! Everyone made a crown with 100 decorations." },
      ] },
      { id: "c_noah_susan", author: "susan", time: "40m", text: "Look at those crowns! So sweet." },
    ],
  },
  {
    id: "lee_garden", author: "lee", audience: "friends", time: "Yesterday · 3:40 PM", inFeed: 2,
    text: "The neighborhood garden is looking wonderful after the rain.",
    photos: [photo("photo_lee_garden", P("lee-garden-after-rain"), "Flowers in the Oak Street garden", { width: 800, height: 600 })],
    reactions: { grace: "like", pat: "love", tom: "like" }, comments: [],
  },
  {
    id: "maria_bread", author: "maria", audience: "friends", time: "Yesterday · 11:02 AM", inFeed: 4,
    text: "First attempt at sourdough — not bad! Anyone have tips for a crispier crust?",
    reactions: { susan: "like", anna: "like" },
    comments: [{ id: "c_bread_1", author: "susan", time: "20h", text: "Bake it in a covered pot for the first 20 minutes!" }],
  },
  {
    id: "elena_bookclub_old", author: "elena", audience: "friends", time: "Monday · 8:20 AM", inFeed: 6,
    text: "Lovely sunrise on this morning’s walk by the river.", reactions: { omar: "like" }, comments: [],
  },

  // ----- Sam's profile -----
  {
    id: "sam_seedswap", author: "sam", audience: "public", time: "Today · 8:05 AM",
    text: "Seed swap, November 16, 2 p.m., Community Garden. Bring any seeds you’d like to share — everyone is welcome, please pass it on!",
    photos: [photo("photo_seed_swap", P("flyer-seed-swap"), "Seed swap flyer: Saturday, November 16, 2 p.m., Community Garden", { width: 800, height: 1200 })],
    reactions: { lee: "like", rosa: "love" }, comments: [],
  },
  {
    id: "sam_bike", author: "sam", audience: "public", time: "Tuesday · 6:40 PM",
    text: "Finally fixed up my old bike. Ready for some weekend rides!", reactions: { lee: "like" }, comments: [],
  },
  {
    id: "sam_flyer", author: "sam", audience: "public", time: "Monday · 11:05 AM",
    text: "Please join us for the Oak Street community lunch. Everyone is welcome!",
    photos: [photo("photo_lunch_flyer", "/assets/feed/community-lunch-flyer.webp", "Flyer for the Oak Street Community Lunch, Saturday 12:00–2:00 PM at Oak Street Community Center", { width: 800, height: 1200 })],
    reactions: { lee: "like", pat: "like", grace: "love", maria: "like" },
    comments: [{ id: "c_flyer_1", author: "maria", time: "2d", text: "Count me in!" }],
  },
  {
    id: "sam_coffee", author: "sam", audience: "public", time: "Last week",
    text: "Thanks to everyone who came to the garden meeting. Notes coming soon.", reactions: { rosa: "like" }, comments: [],
  },

  // ----- Maya / Nora public posts -----
  {
    id: "maya_books", author: "maya", audience: "public", time: "Wednesday · 10:12 AM",
    text: "I am collecting books for the community shelf. Message me if you have some to donate. — Maya",
    reactions: { sam: "like", daniel: "love" }, comments: [],
  },
  {
    id: "nora_craftfair", author: "nora", audience: "public", time: "Today · 7:30 AM", inFeed: 3,
    text: "Community craft fair, November 22, 10 a.m.–2 p.m., Town Hall. This is open to anyone — please invite friends and family!",
    photos: [photo("photo_craft_fair", P("flyer-craft-fair"), "Community craft fair flyer: November 22, 10 a.m.–2 p.m., Town Hall", { width: 800, height: 1200 })],
    reactions: { elena: "love", ben: "like" }, comments: [],
  },

  // ----- Recipe creator posts (shared in Susan's chat) -----
  {
    id: "recipe_tomato", author: "tomato_thyme", audience: "public", time: "October 2",
    text: "ROASTED TOMATO SOUP — tomatoes, red pepper, onion, garlic, vegetable broth, basil, salt and pepper. Roast, blend, and simmer for 10 minutes.",
    photos: [photo("photo_recipe_tomato", P("recipe-tomato-soup"), "Bowl of roasted tomato soup", { width: 800, height: 600 })],
    reactions: {}, comments: [],
  },
  {
    id: "recipe_mushroom", author: "everyday_kitchen", audience: "public", time: "October 5",
    text: "CREAMY MUSHROOM SOUP — mushrooms, onion, garlic, butter, milk, vegetable broth, thyme, salt and pepper. Cook until creamy. Ready in 25 minutes!",
    photos: [photo("photo_recipe_mushroom", P("recipe-mushroom-soup"), "Bowl of creamy mushroom soup", { width: 800, height: 600 })],
    reactions: {}, comments: [],
  },
  {
    id: "recipe_lentil", author: "lentil_lane", audience: "public", time: "October 4",
    text: "HEARTY LENTIL SOUP — lentils, onion, carrots, celery, vegetable broth, garlic, cumin, salt and pepper. Simmer for 30 minutes.",
    photos: [photo("photo_recipe_lentil", P("recipe-lentil-soup"), "Bowl of lentil soup", { width: 800, height: 600 })],
    reactions: {}, comments: [],
  },
  {
    id: "ek_salad", author: "everyday_kitchen", audience: "public", time: "September 28",
    text: "10-minute chickpea salad — chickpeas, cucumber, tomato, red onion, lemon and olive oil.", reactions: {}, comments: [],
  },

  // ----- Oak Street Neighbors -----
  {
    id: "oak_shared_lunch", author: "me", group: "oak", time: "Monday · 4:02 PM", inFeed: 5,
    text: "Sam asked me to share this here — hope lots of us can make it!",
    sharedPostId: "sam_flyer",
    reactions: { lee: "like", pat: "like", grace: "like" },
    comments: [
      { id: "c_oak_join", author: "grace", time: "Mon", text: "I’ll join! 👍" },
      { id: "c_oak_entrance_q", author: "lee", time: "Mon", text: "I’m bringing my father, who uses a walker. There’s an entrance on Oak Street and another beside the parking lot. Which would be easier for us?", replies: [
        { id: "c_oak_entrance_a", author: "pat", time: "Mon", text: "The second one has a ramp and a step-free path to the lunch room. I’d use that one." },
      ] },
      { id: "c_oak_nice", author: "tom", time: "Mon", text: "Nice, thanks for sharing 👌" },
      { id: "c_oak_attendance", author: "pat", time: "Tue", text: "Who’s planning to come to the lunch? Please let us know if you’re bringing anyone.", replies: [] },
    ],
  },
  {
    id: "oak_ladder", author: "pat", group: "oak", time: "Today · 10:20 AM",
    text: "Does anyone have a step ladder I could borrow?", reactions: {},
    comments: [{ id: "c_ladder_1", author: "tom", time: "1h", text: "Mine is broken, sorry Pat!" }],
  },
  {
    id: "oak_repair_nov", author: "pat", group: "oak", time: "Yesterday · 9:00 AM",
    text: "#RepairCafe November 9: Town Hall, open 10 a.m.–1 p.m. Bring broken lamps, toasters, bikes and clothes — our volunteers will help fix them.",
    reactions: { lee: "like", grace: "like" },
    comments: [
      { id: "c_repair_q", author: "lee", time: "20h", text: "Should I take my broken lamp to Town Hall or the library annex?", replies: [
        { id: "c_repair_a", author: "pat", time: "19h", text: "The library annex is only for collecting repaired items. Bring things that still need fixing to Town Hall." },
      ] },
    ],
  },
  {
    id: "oak_toolswap", author: "lee", group: "oak", time: "Sunday · 2:15 PM",
    text: "#ToolSwap this Sunday on my driveway — bring tools you don’t use and swap for ones you need.", reactions: { tom: "like" }, comments: [],
  },
  {
    id: "oak_repair_oct", author: "lee", group: "oak", time: "October 1",
    text: "#RepairCafe October update: thanks to everyone who came on October 12 — we fixed 23 items! Next date to be announced.", reactions: { pat: "love" }, comments: [],
  },

  // ----- Book Club -----
  {
    id: "book_reading_list", author: "nora", group: "book", time: "Wednesday · 6:00 PM",
    text: "Here is the final November reading list. Members are welcome to send it to friends.",
    links: [{ kind: "pdf", docId: "nov_reading" }],
    reactions: { ben: "like" }, comments: [],
  },
  {
    id: "book_poll", author: "nora", group: "book", time: "Today · 8:00 AM",
    text: "Time to choose our December book!",
    poll: { question: "December book choice", multiple: false, options: [
      { id: "river", text: "The River Path", votes: ["ben"] },
      { id: "winter", text: "Winter Letters", votes: ["nora"] },
      { id: "garden", text: "A Small Garden", votes: [] },
    ] },
    reactions: {}, comments: [],
  },
  {
    id: "book_planning", author: "nora", group: "book", time: "Yesterday · 5:10 PM",
    text: "Planning our November meeting — I’ve posted two options as separate comments. Please reply to the one that works for you.",
    reactions: { ben: "like" },
    comments: [
      { id: "c_book_library", author: "nora", time: "1d", text: "Library meeting, November 6 at 2 p.m.", replies: [
        { id: "c_book_library_r", author: "nora", time: "1d", text: "The library has a quiet room we can use." },
      ] },
      { id: "c_book_cafe", author: "nora", time: "1d", text: "Café meeting, November 13 at 2 p.m.", replies: [
        { id: "c_book_cafe_ben", author: "ben", time: "20h", text: "I cannot make this one." },
      ] },
    ],
  },
  {
    id: "book_oct_list", author: "nora", group: "book", time: "September 30",
    text: "October reading list is here.", links: [{ kind: "pdf", docId: "oct_reading" }], reactions: { ben: "like" }, comments: [],
  },

  // ----- Walking Group -----
  {
    id: "walk_booking", author: "elena", group: "walk", time: "Today · 9:45 AM",
    text: "I have booked our table at River Café for 11 a.m.", reactions: { omar: "like" }, comments: [],
  },
  {
    id: "walk_announcement", author: "elena", group: "walk", time: "Today · 7:50 AM",
    text: "Saturday’s outdoor walk is cancelled because of rain. We are still meeting inside River Café at 11 a.m.",
    reactions: { omar: "sad" }, comments: [{ id: "c_walk_ann_1", author: "omar", time: "2h", text: "Shame about the walk, see you at the café!" }],
  },
  {
    id: "walk_rain", author: "omar", group: "walk", time: "Yesterday · 8:30 PM",
    text: "The forecast says heavy rain all Saturday morning ☔", reactions: { elena: "like" }, comments: [],
  },
  {
    id: "walk_meeting", author: "elena", group: "walk", time: "Yesterday · 6:00 PM",
    text: "Saturday meeting places — tap a link to open it in maps.",
    links: [{ kind: "map", placeId: "river_cafe" }, { kind: "map", placeId: "river_park" }],
    reactions: {}, comments: [],
  },
  {
    id: "walk_plan", author: "elena", group: "walk", time: "Monday · 9:00 AM",
    text: "Saturday plan: outdoor walk along the river at 9 a.m., then we’ll warm up inside River Café at 11 a.m.", reactions: { omar: "like" }, comments: [],
  },
  {
    id: "walk_riverside_map", author: "elena", group: "walk", time: "September 21",
    text: "Riverside Walk map — Start: Boat House; Finish: Stone Bridge.",
    photos: [photo("photo_riverside_map", P("map-riverside-walk"), "Riverside Walk map. Start: Boat House. Finish: Stone Bridge.", { width: 800, height: 600 })],
    reactions: { omar: "like" }, comments: [],
  },
  {
    id: "walk_hill_map", author: "omar", group: "walk", time: "September 14",
    text: "Hill Trail map for anyone wanting a harder walk.",
    photos: [photo("photo_hill_map", P("map-hill-trail"), "Hill Trail map. Start: Car Park. Finish: Hilltop.", { width: 800, height: 600 })],
    reactions: {}, comments: [],
  },
  {
    id: "walk_cafe_menu", author: "omar", group: "walk", time: "September 10",
    text: "River Café menu, in case anyone wants to plan ahead.",
    photos: [photo("photo_cafe_menu", P("river-cafe-menu"), "River Café menu", { width: 800, height: 1000 })],
    reactions: {}, comments: [],
  },

  // ----- Volunteer Team -----
  {
    id: "vol_equipment", author: "priya", group: "volunteer", time: "Today · 8:30 AM",
    text: "Equipment for November 8 — let me know what you can bring.",
    reactions: {},
    comments: [
      { id: "c_vol_tablecloth", author: "luis", time: "3h", text: "I can bring the tablecloths." },
      { id: "c_vol_chairs", author: "priya", time: "2h", text: "@Alex, can you bring two folding chairs on November 8?", replies: [] },
    ],
  },
  {
    id: "vol_supplies", author: "priya", group: "volunteer", time: "Yesterday · 4:00 PM",
    text: "Here are the supplies we have spare. Happy for you to share these photos with anyone collecting them.",
    photos: [
      photo("photo_supply_notebooks", P("supply-notebooks"), "Notebooks", { caption: "Notebooks", width: 800, height: 600 }),
      photo("photo_supply_pens", P("supply-pens"), "Pens", { caption: "Pens", width: 800, height: 600 }),
      photo("photo_supply_spray", P("supply-cleaning-spray"), "Cleaning spray", { caption: "Cleaning spray", width: 800, height: 600 }),
      photo("photo_supply_gloves", P("supply-gloves"), "Gloves", { caption: "Gloves", width: 800, height: 600 }),
    ],
    reactions: { luis: "like" }, comments: [],
  },
  {
    id: "vol_rota_final", author: "priya", group: "volunteer", time: "Monday · 3:00 PM",
    text: "Final rota for November 8.", files: ["rota_nov_final"],
    reactions: { luis: "like" },
    comments: [
      { id: "c_rota_swap", author: "luis", time: "Mon", text: "@Alex would you swap with me? I’d take your welcome desk shift and you’d take my packing shift.", replies: [
        { id: "c_rota_swap_ok", author: "priya", time: "Tue", text: "@Alex Swap approved. You will take Luis’s packing shift, noon to 2; Luis will cover your welcome desk shift." },
      ] },
    ],
  },
  {
    id: "vol_rota_draft", author: "priya", group: "volunteer", time: "Last week",
    text: "Draft rota for November 8 — comments welcome.", files: ["rota_nov_draft"], reactions: {}, comments: [],
  },
  {
    id: "vol_rota_oct", author: "priya", group: "volunteer", time: "October 20",
    text: "Final rota for October 25.", files: ["rota_oct_final"], reactions: {}, comments: [],
  },

  // ----- Family group -----
  {
    id: "family_music", author: "anna", group: "family", time: "Yesterday · 6:15 PM",
    text: "Noah loved his first music lesson!",
    photos: [photo("photo_music_lesson", P("noah-music-lesson"), "Piano at Noah's music lesson", { width: 800, height: 600 })],
    reactions: { adam: "love" }, comments: [],
  },
  {
    id: "family_dinner", author: "adam", group: "family", time: "Sunday · 7:00 PM",
    text: "Great family dinner tonight — thanks Anna!", reactions: { anna: "love" }, comments: [],
  },

  // ----- Garden Club -----
  {
    id: "garden_rosa_contact", author: "rosa", group: "garden", time: "Today · 9:05 AM",
    text: "@Alex You can send Sam my contact so he can ask me about joining.", reactions: {}, comments: [],
  },
  {
    id: "garden_poll", author: "rosa", group: "garden", time: "Yesterday · 10:00 AM",
    text: "Planning our autumn planting!",
    poll: { question: "Which planting sessions can you attend?", multiple: true, options: [
      { id: "tue", text: "Tuesday morning", votes: ["ben"] },
      { id: "thu", text: "Thursday afternoon", votes: [] },
      { id: "sat", text: "Saturday morning", votes: ["ben", "rosa"] },
    ] },
    reactions: {}, comments: [],
  },
  {
    id: "garden_planters", author: "rosa", group: "garden", time: "Tuesday · 2:00 PM",
    text: "Comparing two planters for balconies — pictures in the comments.",
    reactions: { ben: "like" },
    comments: [
      { id: "c_planter_deep", author: "rosa", time: "Tue", text: "Deep wooden planter", image: photo("photo_planter_deep", P("planter-deep-wooden"), "Deep wooden planter"), replies: [
        { id: "c_planter_reco", author: "rosa", time: "Wed", text: "This one gives the roots more room. I would choose it for the balcony." },
      ] },
      { id: "c_planter_tray", author: "rosa", time: "Tue", text: "Shallow green tray", image: photo("photo_planter_tray", P("planter-shallow-tray"), "Shallow green tray"), replies: [] },
    ],
  },
  {
    id: "garden_seeds", author: "ben", group: "garden", time: "Monday · 5:00 PM",
    text: "Seed starting instructions: soak seeds overnight, plant 1 cm deep, keep the soil moist and warm.", reactions: { rosa: "like" }, comments: [],
  },
  {
    id: "garden_tools", author: "rosa", group: "garden", time: "September 28",
    text: "Borrowing tools: collect from the shed between 9 and 10 a.m.; return by 4 p.m.", reactions: { ben: "like" }, comments: [],
  },

  // ----- Craft Circle -----
  {
    id: "craft_welcome", author: "nora", group: "craft", time: "Monday · 12:00 PM",
    text: "Sewing workshop details are in our group chat. See you there!", reactions: { elena: "like" }, comments: [],
  },

  // ----- Museum Friends -----
  {
    id: "museum_visit", author: "daniel", group: "museum", time: "Monday · 10:00 AM",
    text: "Our next visit is booked!",
    event: { title: "Guided tour", date: "November 15", month: "NOV", day: "15", time: "2:30 p.m.", place: "City Art Museum" },
    photos: [photo("photo_museum", P("museum-visit"), "City Art Museum", { width: 800, height: 600 })],
    reactions: { maya: "like" },
    comments: [
      { id: "c_museum_meet", author: "daniel", time: "Mon", text: "Please meet by the ticket desk 20 minutes before the tour starts." },
      { id: "c_museum_lockers", author: "me", time: "Tue", text: "Are there lockers at the museum?", replies: [
        { id: "c_museum_lockers_a", author: "daniel", time: "1h", text: "Yes, free lockers are beside the ticket desk." },
      ] },
    ],
  },
  {
    id: "museum_poll", author: "daniel", group: "museum", time: "Yesterday · 1:00 PM",
    text: "Which visit time works best?",
    poll: { question: "Preferred museum visit", multiple: true, options: [
      { id: "am", text: "Morning, 10 a.m.", votes: ["maya"] },
      { id: "pm", text: "Afternoon, 2:30 p.m.", votes: ["daniel"] },
    ] },
    reactions: {}, comments: [],
  },
  {
    id: "museum_pickup", author: "daniel", group: "museum", time: "Today · 11:00 AM",
    text: "Pickup information for after the visit. Drivers should use the south pickup bay, not the front entrance.",
    links: [{ kind: "map", placeId: "museum_south" }, { kind: "pdf", docId: "museum_pickup" }, { kind: "map", placeId: "museum_front" }],
    reactions: { maya: "like" }, comments: [],
  },
];

// Saved items (by post id), newest first
export const saved = ["walk_cafe_menu", "walk_riverside_map", "walk_hill_map"];

// ---------- Notifications ----------
export const notifications = [
  { id: "n_priya", actor: "priya", text: "mentioned you in a comment in Volunteer Team: “@Alex, can you bring two folding chairs on November 8?”", time: "2h", postId: "vol_equipment", commentId: "c_vol_chairs", unread: true },
  { id: "n_daniel", actor: "daniel", text: "replied to your comment in Museum Friends: “Yes, free lockers are beside the ticket desk.”", time: "1h", postId: "museum_visit", commentId: "c_museum_lockers_a", unread: true },
  { id: "n_lee", actor: "lee", text: "reacted to your post in Oak Street Neighbors.", time: "3h", postId: "oak_shared_lunch", unread: true },
  { id: "n_anna", actor: "anna", text: "added a new photo.", time: "5h", postId: "anna_noah" },
  { id: "n_nora", actor: "nora", text: "posted in Book Club: “Time to choose our December book!”", time: "6h", postId: "book_poll" },
  { id: "n_maria", actor: "maria", text: "has a birthday today. Wish her well!", time: "8h", profileId: "maria" },
  { id: "n_elena", actor: "elena", text: "posted in Walking Group.", time: "1d", postId: "walk_rain" },
];

// ---------- Device photo gallery ----------
export const gallery = [
  { id: "g_cake", title: "Noah birthday cake", src: P("gallery-noah-birthday-cake") },
  { id: "g_flowers", title: "Garden flowers", src: P("gallery-garden-flowers") },
  { id: "g_receipt", title: "Shopping receipt", src: P("gallery-shopping-receipt") },
];

// ---------- Messenger conversations ----------
// Message: { id, from, text?, day, time, photos?, sharedPostId?, audio?, replyTo?, profileId?, edited? }
let n = 0;
const m = (from, day, time, body) => ({ id: `m${++n}`, from, day, time, ...(typeof body === "string" ? { text: body } : body) });

const susanMessages = [
  m("susan", "October 3", "9:10 AM", "October 12 coffee: Maple Café, 24 Maple Street"),
  m("me", "October 3", "9:14 AM", "Perfect, see you there!"),
  m("susan", "October 4", "4:30 PM", "Heads up: Pine Avenue will be closed for repaving on October 20, 8 a.m.–noon."),
  m("susan", "October 9", "7:05 PM", "I have some books to give away. Let me know if you hear of anyone collecting them."),
  m("me", "October 9", "7:20 PM", "Will do!"),
  m("susan", "October 14", "11:00 AM", "October 26 coffee: River Café, 18 River Road"),
  m("me", "October 14", "11:06 AM", "Great, that one is closer for me."),
  m("susan", "Today", "8:02 AM", "Found some soup recipes for when it gets cold!"),
  { ...m("susan", "Today", "8:03 AM", { sharedPostId: "recipe_tomato" }), id: "susan_tomato" },
  { ...m("susan", "Today", "8:03 AM", { sharedPostId: "recipe_mushroom" }), id: "susan_mushroom" },
  { ...m("susan", "Today", "8:04 AM", { sharedPostId: "recipe_lentil" }), id: "susan_lentil" },
  m("me", "Today", "8:20 AM", "These look great, thank you!"),
  m("susan", "Today", "8:22 AM", "How was your weekend?"),
  m("me", "Today", "8:25 AM", "Busy! We went to the farmers market on Saturday."),
  m("susan", "Today", "8:26 AM", "Lucky you. It rained all day here."),
  m("susan", "Today", "8:27 AM", "Did you get those apples you wanted?"),
  m("me", "Today", "8:31 AM", "Yes, a whole bag. I might make a crumble."),
  m("susan", "Today", "8:33 AM", "Save me a piece 😄"),
  m("me", "Today", "8:35 AM", "Of course!"),
  m("susan", "Today", "8:40 AM", "Is Noah enjoying kindergarten?"),
  m("me", "Today", "8:42 AM", "He loves it. Anna says he talks about his teacher all the time."),
  m("susan", "Today", "8:45 AM", "That’s lovely to hear."),
  m("me", "Today", "8:47 AM", "Are you still coming over tonight?"),
  m("susan", "Today", "8:48 AM", "Yes! Around 6."),
  { ...m("susan", "Today", "8:52 AM", { text: "This creator shares lots of quick, healthy recipes. You might like their other posts too.", replyTo: "susan_mushroom" }), id: "susan_reco" },
];

const mayaMessages = [
  m("maya", "October 10", "6:00 PM", "My mum is visiting this weekend, so I’ll be a bit slow to reply."),
  m("me", "October 10", "6:10 PM", "Have a lovely time with her!"),
  { ...m("maya", "October 15", "9:30 AM", "Oak Street closure, October 18: closed between Pine Avenue and River Road, 1–6 p.m."), id: "maya_notice" },
  m("me", "October 15", "9:41 AM", "Thanks for letting me know."),
  m("maya", "October 15", "12:15 PM", "My brother just had his second baby — a girl! 🎉"),
  m("me", "October 15", "12:20 PM", "Congratulations to him! What’s her name?"),
  m("maya", "October 15", "12:22 PM", "Lily. Mum is over the moon."),
  { ...m("maya", "October 16", "8:05 AM", { text: "Update from the road crew: reopening is now 5 p.m., not 6 p.m. The closure still starts at 1.", replyTo: "maya_notice" }), id: "maya_correction" },
  m("maya", "October 16", "8:30 AM", "Off to help my sister move house today. Wish me luck!"),
  m("me", "October 16", "8:45 AM", "Good luck — don’t lift anything too heavy!"),
  m("maya", "October 17", "7:15 PM", "The kids loved the pumpkin patch."),
  { ...m("maya", "Today", "10:30 AM", "I am collecting books for the community shelf. Do you have any books to donate? If so, what can you bring, and when?"), id: "maya_books_q" },
];

const familyMessages = [
  m("anna", "Monday", "3:10 PM", "Look what Noah made at school this week!"),
  { ...m("anna", "Monday", "3:11 PM", { photos: [photo("art_kite", P("art-red-kite"), "Photo")] }) },
  { ...m("anna", "Monday", "3:11 PM", { photos: [photo("art_tree", P("art-green-tree"), "Photo")] }) },
  m("adam", "Monday", "3:20 PM", "Wonderful! 🎨"),
  { ...m("anna", "Monday", "3:25 PM", { photos: [photo("art_boat", P("art-blue-boat"), "Photo")] }) },
  { ...m("anna", "Monday", "3:26 PM", { photos: [photo("art_sun", P("art-yellow-sun"), "Photo")] }) },
  m("me", "Monday", "3:40 PM", "He’s a real artist!"),
  { ...m("anna", "Tuesday", "5:02 PM", { photos: [photo("art_fish", P("art-orange-fish"), "Photo")] }) },
  { ...m("anna", "Tuesday", "5:02 PM", { photos: [photo("art_flower", P("art-purple-flower"), "Photo")] }) },
  m("adam", "Tuesday", "5:30 PM", "We need a bigger fridge for all of these 😄"),
  m("anna", "Today", "9:00 AM", "Plans for this afternoon:"),
  m("anna", "Today", "9:01 AM", "Adam will pick Noah up. I will meet them at home."),
  { ...m("adam", "Today", "9:05 AM", "Should I bring his coat?"), id: "family_coat_q" },
  { ...m("anna", "Today", "9:07 AM", { text: "Yes, please. Noah left it at your house. He will need it for the playground afterward.", replyTo: "family_coat_q" }) },
];

const noraMessages = [
  m("nora", "October 2", "10:00 AM", "Thanks for coming to the craft evening!"),
  m("nora", "October 2", "10:05 AM", "The lamp I mentioned is the clip-on one from the hardware store — great for evening sewing."),
  { ...m("nora", "October 3", "2:15 PM", "For the workshop I recommend the StitchMate 200."), id: "nora_stitchmate" },
  m("me", "October 3", "2:30 PM", "Thanks, I’ll look it up."),
  m("nora", "October 6", "5:00 PM", "I found some lovely cotton fabric at the market — I’ll bring extra."),
  m("me", "October 6", "5:20 PM", "Can’t wait to see it!"),
  { ...m("nora", "Today", "11:15 AM", "Will you bring scissors to the sewing workshop?"), id: "nora_scissors_q" },
];

export const conversations = [
  { id: "c_susan", kind: "dm", with: "susan", messages: susanMessages },
  { id: "c_maya", kind: "dm", with: "maya", messages: mayaMessages },
  { id: "c_adam", kind: "dm", with: "adam", messages: [
    m("adam", "Today", "7:45 AM", "Morning! Oak Street is closed this afternoon, by the way."),
    m("me", "Today", "7:50 AM", "Thanks, I’ll go another way."),
    { id: "adam_leave", from: "me", day: "Today", time: "", text: "I will leave at 4 p.m.", sentAtOffsetMin: -2 },
  ] },
  { id: "c_sam", kind: "dm", with: "sam", messages: [
    m("sam", "October 12", "1:00 PM", "It was good seeing you at the garden meeting."),
    m("me", "October 12", "1:10 PM", "You too!"),
    { ...m("sam", "Today", "9:30 AM", "Passing on Maya’s announcement."), id: "sam_passing" },
    { ...m("sam", "Today", "9:30 AM", { sharedPostId: "maya_books" }), id: "sam_maya_post" },
  ] },
  { id: "c_family", kind: "group", title: "Family", members: ["me", "anna", "adam"], messages: familyMessages },
  { id: "c_craft", kind: "group", title: "Craft Circle", members: ["me", "nora", "elena"], messages: [
    m("elena", "Yesterday", "6:00 PM", "Excited for the sewing workshop!"),
    { ...m("nora", "Today", "10:00 AM", { audio: { id: "audio_nora_workshop", duration: 12, src: "/assets/audio/nora-workshop-update.mp3",
      transcript: "For the sewing workshop, bring your scissors and a pencil. I will provide the fabric and thread, so you do not need to buy those." } }), id: "craft_audio" },
    m("elena", "Today", "10:20 AM", "Thanks Nora!"),
  ] },
  { id: "c_nora", kind: "dm", with: "nora", archived: true, messages: noraMessages },
  { id: "c_daniel", kind: "dm", with: "daniel", messages: [
    { ...m("daniel", "September 30", "5:00 PM", "Oak Street closure, October 4: closed between Elm Street and Pine Avenue, 9 a.m.–noon."), id: "daniel_notice" },
    m("me", "September 30", "5:15 PM", "Thanks Daniel."),
    m("daniel", "October 9", "3:00 PM", "Looking forward to the museum trip!"),
  ] },
  { id: "c_maria", kind: "dm", with: "maria", messages: [
    m("maria", "October 18", "2:03 PM", "How is your afternoon going?"),
    m("me", "October 18", "2:10 PM", "Lovely, just back from a walk."),
  ] },
  { id: "c_lee", kind: "dm", with: "lee", messages: [
    m("lee", "October 11", "9:00 AM", "Thanks for helping in the garden yesterday!"),
  ] },
];
