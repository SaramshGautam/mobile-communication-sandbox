// Shared baseline dataset for the social-media app (task bank v2, T01-S … T13-S).
// Every scenario starts from a fresh copy of this world; scenarios.js sets the
// start screen and any extra state. All people, places, URLs and documents are
// fictional. The study account is Alex.

import { photo as P, avatar as realAvatar } from "./photos.js";

const A = "/assets/avatars/";
export const ME = "me";

// relationship: "you" | "friend" | "following" | "none" | "request" (sent you a friend request)
export const people = {
  me: { id: "me", name: "Alex Morgan", firstName: "Alex", bio: "Gardening, good books and neighborhood walks.", relationship: "you" },
  sam: { id: "sam", name: "Sam Rivera", firstName: "Sam", avatar: A + "sam-rivera.webp", bio: "Neighbor on Oak Street", relationship: "friend" },
  adam: { id: "adam", name: "Adam Reed", firstName: "Adam", avatar: A + "david-morgan.webp", bio: "Neighbor · Retired teacher", relationship: "friend" },
  susan: { id: "susan", name: "Susan Clark", firstName: "Susan", avatar: A + "maria-santos.webp", bio: "Neighbor · Always cooking something", relationship: "friend" },
  lee: { id: "lee", name: "Lee Johnson", firstName: "Lee", avatar: A + "lee-johnson.webp", bio: "Oak Street since 2009", relationship: "friend" },
  pat: { id: "pat", name: "Pat Williams", firstName: "Pat", avatar: A + "pat-williams.webp", bio: "Admin, Oak Street Neighbors", relationship: "friend" },
  grace: { id: "grace", name: "Grace Hill", firstName: "Grace", bio: "Maple resident", relationship: "friend" },
  tom: { id: "tom", name: "Tom Baker", firstName: "Tom", bio: "", relationship: "friend" },
  rosa: { id: "rosa", name: "Rosa Martinez", firstName: "Rosa", bio: "Local gardening volunteer", relationship: "friend" },
  elena: { id: "elena", name: "Elena Ruiz", firstName: "Elena", avatar: A + "anna-morgan.webp", bio: "Local walk organizer · Garden Volunteers organizer", relationship: "following", public: true },
  nora: { id: "nora", name: "Nora Kim", firstName: "Nora", bio: "Craft session organizer", relationship: "friend" },
  maya: { id: "maya", name: "Maya Patel", firstName: "Maya", bio: "Book sale organizer, Maple Hall", relationship: "friend" },
  priya: { id: "priya", name: "Priya Shah", firstName: "Priya", bio: "Coordinator, Community Volunteers", relationship: "friend" },
  luis: { id: "luis", name: "Luis Ortega", firstName: "Luis", bio: "", relationship: "friend" },
  kim: { id: "kim", name: "Kim Nguyen", firstName: "Kim", bio: "", relationship: "friend" },
  daniel: { id: "daniel", name: "Daniel Brooks", firstName: "Daniel", bio: "Organizes local museum visits", relationship: "friend" },
  // T01-S: two accounts with the same name
  mina_art: { id: "mina_art", name: "Mina Shah", firstName: "Mina", bio: "Art sessions at Maple Community Center", relationship: "none", public: true, followers: "312 followers" },
  mina_travel: { id: "mina_travel", name: "Mina Shah", firstName: "Mina", bio: "Travel photography", relationship: "none", public: true, followers: "1.2K followers" },
  // T02-S: pending friend requests
  ben_ortiz: { id: "ben_ortiz", name: "Ben Ortiz", firstName: "Ben", bio: "Oak Street Pottery Club", relationship: "request", public: true, lives: "Lives in Maple" },
  bea_ortega: { id: "bea_ortega", name: "Bea Ortega", firstName: "Bea", bio: "Maple Running Club", relationship: "request", public: true, lives: "Lives in Riverside" },
  // Pages / public accounts
  maple_library: { id: "maple_library", name: "Maple Library", firstName: "Maple Library", isPage: true, public: true, bio: "The local public library for Maple · Official account", relationship: "none", followers: "2.4K followers" },
  maple_music: { id: "maple_music", name: "Maple Music", firstName: "Maple Music", isPage: true, public: true, bio: "Community concerts at Riverside Stage", relationship: "none", followers: "5.1K followers" },
  everyday_kitchen: { id: "everyday_kitchen", name: "Everyday Kitchen", firstName: "Everyday Kitchen", isPage: true, public: true, bio: "Quick, simple recipes for every day", relationship: "none", followers: "48K followers" },
  home_baking: { id: "home_baking", name: "Home Baking", firstName: "Home Baking", isPage: true, public: true, bio: "Breads and bakes from a home kitchen", relationship: "none", followers: "21K followers" },
  garden_table: { id: "garden_table", name: "Garden Table", firstName: "Garden Table", isPage: true, public: true, bio: "Fresh salads from the garden", relationship: "none", followers: "9K followers" },
};
for (const p of Object.values(people)) if (!p.avatar) p.avatar = realAvatar(p.id);

export const groups = {
  oak: {
    id: "oak", name: "Oak Street Neighbors", privacy: "Private group", color: "#41658a",
    members: ["me", "pat", "lee", "grace", "tom", "sam"], admins: ["pat"],
    description: "Oak Street residents sharing local activities, news and help.",
  },
  garden_vol: {
    id: "garden_vol", name: "Garden Volunteers", privacy: "Private group", color: "#4a8a3a",
    members: ["me", "elena", "rosa", "lee", "grace"], admins: ["elena"],
    description: "Volunteers who look after Maple’s shared gardens. Elena Ruiz organizes our events.",
  },
  cooking: {
    id: "cooking", name: "Cooking Ideas", privacy: "Private group", color: "#d9822b",
    members: ["me", "susan", "grace", "kim"], admins: ["grace"],
    description: "Swap useful recipe accounts, ideas and tips.",
  },
  community_vol: {
    id: "community_vol", name: "Community Volunteers", privacy: "Private group", color: "#c4553a",
    members: ["me", "priya", "luis", "kim", "grace"], admins: ["priya"],
    description: "Volunteers for Maple community events. Priya Shah coordinates the team. Members can create posts and polls.",
  },
  free_exchange: {
    id: "free_exchange", name: "Oak Street Free Exchange", privacy: "Public group", color: "#2e8b57",
    members: ["sam", "lee", "grace", "tom", "kim"], admins: ["lee"],
    description: "A public group for giving away usable household items for free.",
    rules: [
      { title: "Everything must be free", text: "No prices, swaps for money or “make an offer.”" },
      { title: "Include a photo and your pickup area", text: "Say roughly where the item can be picked up, for example the street." },
      { title: "Arrange the exact address privately", text: "Don’t post your home address. Share it in a private message." },
    ],
  },
  buy_sell: {
    id: "buy_sell", name: "Oak Street Buy and Sell", privacy: "Public group", color: "#8a5a2b",
    members: ["tom", "grace", "luis"], admins: ["tom"],
    description: "Buy and sell secondhand items with neighbors.",
    rules: [
      { title: "Include a price", text: "Every listing must show a price." },
      { title: "Be respectful", text: "No spam." },
    ],
  },
};

// ---------- Documents and places (in-app viewers) ----------
export const documents = {};
export const places = {
  river_cafe: { id: "river_cafe", name: "River Café", address: "18 River Road", image: P("map-river-cafe"), url: "https://maps.example/place/river-cafe-18-river-road" },
  river_park: { id: "river_park", name: "River Park", address: "Park Avenue", image: P("map-river-park"), url: "https://maps.example/place/river-park" },
};

const photo = (id, src, alt, extra = {}) => ({ id, src, alt, ...extra });

// ---------- Posts ----------
// audience: "public" | "friends"; group posts use `group`. inFeed = order in the home feed.
export const posts = [
  // ----- Home feed (ordinary content) -----
  { id: "feed_lee_garden", author: "lee", audience: "friends", time: "Today · 8:05 AM", inFeed: 1,
    text: "The garden after last night’s rain.", photos: [photo("ph_lee_garden", P("lee-garden-after-rain"), "A garden with pink and yellow flowers after rain")],
    reactions: { grace: "love", sam: "like", pat: "like" }, comments: [{ id: "c_lg1", author: "grace", time: "1h", text: "So green!", replies: [] }] },
  { id: "feed_pat_oak", author: "pat", group: "oak", time: "Yesterday at 6:12 PM", inFeed: 2,
    text: "Reminder: recycling pickup moves to Thursday next week.", reactions: { lee: "like", tom: "like" }, comments: [] },
  { id: "feed_grace", author: "grace", audience: "friends", time: "Yesterday at 2:40 PM", inFeed: 3,
    text: "Finished my first quilt square! Only 29 more to go 😄", reactions: { susan: "love" }, comments: [] },
  { id: "feed_sam", author: "sam", audience: "friends", time: "October 29", inFeed: 4,
    text: "Tomatoes are finally done for the year. Thanks to everyone who took some!", photos: [photo("ph_sam_flowers", P("gallery-garden-flowers"), "Flowers in Sam’s garden")],
    reactions: { lee: "like", adam: "like" }, comments: [] },
  { id: "feed_rosa", author: "rosa", audience: "public", time: "October 28", inFeed: 5,
    text: "Seed swap at the Community Garden on November 9, 10 a.m. Bring seeds in labeled envelopes.", reactions: { grace: "like" }, comments: [] },

  // ----- T01-S: Mina Shah (art) and Mina Shah (travel) -----
  { id: "mina_art_session", author: "mina_art", audience: "public", time: "October 30",
    text: "Free art session this Saturday! Beginners welcome. We supply paper and paints. Saturday, 2 p.m., Maple Community Center.",
    photos: [photo("ph_mina_art", P("mina-art-session"), "Paper, paints and brushes on a table")],
    reactions: { grace: "like", kim: "love" }, comments: [{ id: "c_ma1", author: "kim", time: "2d", text: "Had so much fun last time!", replies: [] }] },
  { id: "mina_art_old", author: "mina_art", audience: "public", time: "October 18",
    text: "Thank you to everyone who came to last week’s session. Look at these colors!",
    photos: [photo("ph_mina_old", P("mina-art-last-week"), "Four colorful paintings on a wall")], reactions: { kim: "like" }, comments: [] },
  { id: "mina_travel_1", author: "mina_travel", audience: "public", time: "October 25",
    text: "Morning light over the harbor. New prints in my online shop soon.", photos: [photo("ph_mt1", P("mina-travel-harbor"), "A harbor with boats")], reactions: {}, comments: [] },
  { id: "mina_travel_2", author: "mina_travel", audience: "public", time: "October 2",
    text: "Mountain trail at sunrise.", photos: [photo("ph_mt2", P("mina-travel-mountains"), "Snowy mountains")], reactions: {}, comments: [] },

  // ----- T02-S: Ben Ortiz public post -----
  { id: "ben_pottery", author: "ben_ortiz", audience: "public", time: "October 26",
    text: "Great turnout at the Oak Street Pottery Club workshop today. Thanks, everyone!", reactions: {}, comments: [] },
  { id: "bea_run", author: "bea_ortega", audience: "public", time: "October 20",
    text: "Maple Running Club 5K this Sunday. All paces welcome!", reactions: {}, comments: [] },

  // ----- T03-S: Alex's plant post (Friends) with Rosa's reply -----
  { id: "my_plants", author: "me", audience: "friends", time: "Yesterday at 9:30 AM",
    text: "One of these is wilting—any suggestions?",
    photos: [photo("ph_plants", P("balcony-plants"), "Two plants on a balcony: basil in a blue pot labeled BASIL and mint in a white pot labeled MINT")],
    reactions: { lee: "like", susan: "care" },
    comments: [
      { id: "c_pl_lee", author: "lee", time: "1d", text: "Your balcony looks lovely!", replies: [] },
      { id: "c_pl_rosa", author: "rosa", time: "2h", text: "The one in the blue pot needs more water. Keep the other one as it is.", replies: [] },
    ] },

  // ----- T04-S: Garden Volunteers -----
  { id: "gv_photos_note", author: "elena", group: "garden_vol", time: "Today at 10:15 AM",
    text: "Sharing our cleanup photos 📷\nPlease share the finished flower bed. Keep the sign-in sheet private because it contains phone numbers.",
    reactions: { rosa: "like", grace: "like" }, comments: [] },
  { id: "gv_thanks", author: "elena", group: "garden_vol", time: "Yesterday at 4:00 PM",
    text: "Thank you, everyone! We filled 14 bags at the cleanup.", photos: [photo("ph_bags", P("cleanup-bags"), "Garden waste bags on the grass")],
    reactions: { lee: "love", rosa: "like" }, comments: [] },
  { id: "gv_event", author: "elena", group: "garden_vol", time: "October 24",
    text: "Garden cleanup this Saturday, 9 a.m. at Maple Park. Gloves and tools provided.", reactions: { grace: "like" }, comments: [] },
  { id: "gv_rosa", author: "rosa", group: "garden_vol", time: "October 22",
    text: "Does anyone have a spare watering can for the shared beds?", reactions: {}, comments: [{ id: "c_gvr", author: "lee", time: "Oct 22", text: "I have one, I’ll bring it.", replies: [] }] },

  // ----- T06-S: recipe creators -----
  { id: "ek_mushroom", author: "everyday_kitchen", audience: "public", time: "October 20",
    text: "15-minute mushroom soup — creamy, simple and ready before you know it.", photos: [photo("ph_ek_m", P("recipe-mushroom-soup"), "A bowl of creamy mushroom soup")], reactions: { susan: "love" }, comments: [] },
  { id: "ek_pasta", author: "everyday_kitchen", audience: "public", time: "October 12",
    text: "Weeknight tomato pasta with five ingredients.", photos: [photo("ph_ek_p", P("recipe-pasta"), "Tomato pasta in a bowl")], reactions: {}, comments: [] },
  { id: "ek_tomato", author: "everyday_kitchen", audience: "public", time: "October 3",
    text: "Roasted tomato soup — one tray, no fuss.", photos: [photo("ph_ek_t", P("recipe-tomato-soup"), "Tomato soup")], reactions: {}, comments: [] },
  { id: "hb_bread", author: "home_baking", audience: "public", time: "October 18",
    text: "Crusty no-knead bread. Start it tonight, bake it tomorrow.", photos: [photo("ph_hb", P("recipe-bread"), "A loaf of crusty bread")], reactions: {}, comments: [] },
  { id: "gt_salad", author: "garden_table", audience: "public", time: "October 16",
    text: "Autumn garden salad with apples and walnuts.", photos: [photo("ph_gt", P("recipe-salad"), "A colorful salad")], reactions: {}, comments: [] },
  { id: "cook_tip", author: "grace", group: "cooking", time: "October 27",
    text: "Tip: freeze leftover herbs in olive oil in an ice-cube tray.", reactions: { susan: "like" }, comments: [] },
  { id: "cook_kim", author: "kim", group: "cooking", time: "October 21",
    text: "Does anyone know a good account for slow-cooker meals?", reactions: {}, comments: [] },

  // ----- T07-S: public groups -----
  { id: "fx_boxes", author: "tom", group: "free_exchange", time: "October 29",
    text: "Does anyone need moving boxes? I have about ten.", reactions: { grace: "like" }, comments: [{ id: "c_fx1", author: "kim", time: "Oct 29", text: "Yes please! I’ll message you.", replies: [] }] },
  { id: "fx_thanks", author: "grace", group: "free_exchange", time: "October 25",
    text: "Thank you to the neighbor who took my old bookshelf!", reactions: { lee: "love" }, comments: [] },
  { id: "bs_bike", author: "luis", group: "buy_sell", time: "October 28",
    text: "Selling: kids’ bike, good condition, $40.", reactions: {}, comments: [] },

  // ----- T08-S: Maple Library -----
  { id: "lib_hours_new", author: "maple_library", audience: "public", time: "October 27",
    text: "#LibraryHours New opening hours from November 1: weekdays 10 a.m.–6 p.m.; Saturday 10 a.m.–2 p.m.; Sunday closed.",
    photos: [photo("ph_lib_new", P("library-hours"), "Maple Library new opening hours from November 1")], reactions: { grace: "like", lee: "like" },
    comments: [{ id: "c_lib1", author: "grace", time: "4d", text: "Thanks for letting us know!", replies: [] }] },
  { id: "lib_hours_old", author: "maple_library", audience: "public", time: "June 2",
    text: "#LibraryHours Summer opening hours: weekdays 9 a.m.–7 p.m.; Saturday 10 a.m.–4 p.m.; Sunday noon–4 p.m.",
    photos: [photo("ph_lib_old", P("library-summer-hours"), "Maple Library summer hours")], reactions: { tom: "like" }, comments: [] },
  { id: "lib_story", author: "maple_library", audience: "public", time: "October 15",
    text: "Story time for children every Wednesday at 10 a.m.", reactions: {}, comments: [] },
  { id: "resident_lib", author: "tom", audience: "public", time: "October 29",
    text: "Spent a lovely afternoon in the library garden. #LibraryHours well spent!", reactions: {}, comments: [] },

  // ----- T11-S: Alex's public book-sale post -----
  { id: "my_booksale", author: "me", audience: "public", time: "October 26",
    text: "Book sale, November 23, 10 a.m.–4 p.m., Maple Hall.",
    reactions: { lee: "like", grace: "like" },
    comments: [
      { id: "c_bs_lee", author: "lee", time: "Oct 26", text: "I’ll bring a bag of paperbacks!", replies: [] },
      { id: "c_bs_maya", author: "maya", time: "Oct 30", text: "Small correction: we close at 2 p.m., not 4. The start time and place are unchanged.", replies: [] },
    ] },
  { id: "my_sunset", author: "me", audience: "public", time: "October 14",
    text: "Lovely sunset walk by the river this evening.", reactions: { sam: "love" }, comments: [] },
  { id: "my_soup", author: "me", audience: "friends", time: "October 5",
    text: "First soup of the season!", reactions: { susan: "love" }, comments: [] },

  // ----- T12-S: Community Volunteers -----
  { id: "cv_training", author: "priya", group: "community_vol", time: "Yesterday at 11:00 AM",
    text: "We need to choose a date for volunteer training. Please suggest times in the comments. Alex, after reading the discussion, could you create a poll in the group?",
    reactions: { luis: "like", kim: "like" },
    comments: [
      { id: "c_cv_luis", author: "luis", time: "1d", text: "Tuesday morning works for me.", replies: [] },
      { id: "c_cv_kim", author: "kim", time: "1d", text: "Thursday afternoon would be better for me.", replies: [] },
      { id: "c_cv_grace", author: "grace", time: "20h", text: "What about Saturday morning?", replies: [] },
      { id: "c_cv_priya", author: "priya", time: "3h", text: "Saturday is no longer available. Please offer the two weekday options and let people choose every option they can attend.", replies: [] },
    ] },
  { id: "cv_supplies", author: "priya", group: "community_vol", time: "October 28",
    text: "Supplies list for the food drive: boxes, tape and markers. Please comment if you can bring something.", reactions: {},
    comments: [{ id: "c_cvs", author: "luis", time: "Oct 28", text: "I can bring tape.", replies: [] }] },
  { id: "cv_supplies2", author: "kim", group: "community_vol", time: "October 24",
    text: "The supply cupboard key is at the front desk now.", reactions: { priya: "like" }, comments: [] },

  // ----- T13-S: Maple Music -----
  { id: "mm_2026", author: "maple_music", audience: "public", time: "October 30",
    text: "Summer concert, June 20, 2026, 6 p.m., Riverside Stage. Save the date!",
    photos: [photo("ph_mm26", P("concert-2026"), "Summer concert 2026 flyer: June 20, 2026, 6 p.m., Riverside Stage")], reactions: { lee: "love" }, comments: [] },
  { id: "mm_2025", author: "maple_music", audience: "public", time: "May 2, 2025",
    text: "Summer concert, June 12, 2025, 6 p.m., Riverside Stage.",
    photos: [photo("ph_mm25", P("concert-2025"), "Summer concert 2025 flyer: June 12, 2025, 6 p.m., Riverside Stage")], reactions: { tom: "like" }, comments: [] },
];

export const saved = [];

// ---------- Stories (T05-S, T10-S). Items never expire during a session. ----------
export const stories = [
  { id: "st_elena", author: "elena", time: "1h", audience: "public", items: [
    { id: "st_elena_1", kind: "text", text: "Rain today—meeting indoors instead. Same time, 11 a.m.", bg: "#41658a" },
    { id: "st_elena_2", kind: "text", text: "River Café, 18 River Road", bg: "#2e8b57", icon: "pin" },
  ] },
  { id: "st_sam", author: "sam", time: "3h", audience: "friends", items: [
    { id: "st_sam_1", kind: "photo", src: P("gallery-garden-flowers"), alt: "Flowers", text: "Last flowers of the year 🌼" },
  ] },
  { id: "st_lee", author: "lee", time: "5h", audience: "friends", items: [
    { id: "st_lee_1", kind: "text", text: "Coffee and the crossword ☕", bg: "#8a5a2b" },
  ] },
  { id: "st_library", author: "maple_library", time: "8h", audience: "public", items: [
    { id: "st_lib_1", kind: "text", text: "New large-print books have arrived!", bg: "#20364d" },
  ] },
];

// ---------- Events (T09-S) ----------
export const events = {
  ev_museum: {
    id: "ev_museum", title: "Maple Museum afternoon visit", host: "daniel",
    month: "NOV", day: "16", dateLabel: "Sunday, November 16", time: "2 p.m.", place: "Maple Museum",
    cover: P("museum-visit"), privacy: "Private · Guests can invite friends", guestsCanInvite: true,
    description: "Join us for an afternoon at Maple Museum. Meet at the main entrance at 2 p.m.",
    updates: [{ id: "evu_1", author: "daniel", time: "Yesterday", text: "Please use the south entrance instead. Meet 15 minutes earlier so we can enter together." }],
    invitedYou: true, myRsvp: null,
    going: ["maya", "lee"], maybe: ["grace"], invited: ["sam", "susan"],
  },
  ev_seed: {
    id: "ev_seed", title: "Seed swap", host: "rosa", month: "NOV", day: "9", dateLabel: "Sunday, November 9", time: "10 a.m.",
    place: "Community Garden", cover: P("gallery-garden-flowers"), privacy: "Public", guestsCanInvite: true,
    description: "Bring seeds in labeled envelopes.", updates: [], invitedYou: false, myRsvp: "going", going: ["grace", "lee"], maybe: [], invited: [],
  },
  ev_potluck: {
    id: "ev_potluck", title: "Oak Street potluck", host: "pat", month: "NOV", day: "30", dateLabel: "Sunday, November 30", time: "Noon",
    place: "Oak Street Park pavilion", cover: P("lee-garden-after-rain"), privacy: "Private", guestsCanInvite: false,
    description: "Bring a dish to share.", updates: [], invitedYou: true, myRsvp: "maybe", going: ["tom"], maybe: [], invited: [],
  },
};

// ---------- Friend requests (T02-S) ----------
export const friendRequests = [
  { id: "fr_ben", from: "ben_ortiz", time: "2d", mutual: 1 },
  { id: "fr_bea", from: "bea_ortega", time: "5d", mutual: 0 },
];

// ---------- Notifications ----------
// route: where the notification opens.
export const notifications = [
  { id: "n_rosa", actor: "rosa", text: "replied to your post: “The one in the blue pot needs more water…”", time: "2h", unread: true,
    route: { name: "post", postId: "my_plants", focusCommentId: "c_pl_rosa" } },
  { id: "n_ben", actor: "ben_ortiz", text: "sent you a friend request.", time: "2d", unread: true, route: { name: "friends" } },
  { id: "n_daniel", actor: "daniel", text: "invited you to his event: Maple Museum afternoon visit.", time: "2d", unread: true, route: { name: "event", eventId: "ev_museum" } },
  { id: "n_lee", actor: "lee", text: "commented on your post: “Your balcony looks lovely!”", time: "1d", unread: false, route: { name: "post", postId: "my_plants", focusCommentId: "c_pl_lee" } },
  { id: "n_maya", actor: "maya", text: "commented on your post: “Small correction…”", time: "Oct 30", unread: false, route: { name: "post", postId: "my_booksale", focusCommentId: "c_bs_maya" } },
  { id: "n_pat", actor: "pat", text: "posted in Oak Street Neighbors.", time: "Yesterday", unread: false, route: { name: "group", groupId: "oak" } },
  { id: "n_bea", actor: "bea_ortega", text: "sent you a friend request.", time: "5d", unread: false, route: { name: "friends" } },
];

// ---------- Study phone photo gallery ----------
export const gallery = [
  { id: "g_bowl", title: "Finished bowl.jpg", src: P("finished-bowl") },
  { id: "g_flowerbed", title: "Finished flower bed.jpg", src: P("finished-flower-bed") },
  { id: "g_signin", title: "Volunteer sign-in sheet.jpg", src: P("volunteer-signin-sheet") },
  { id: "g_lamp", title: "Desk lamp.jpg", src: P("desk-lamp") },
  { id: "g_kettle", title: "Kettle.jpg", src: P("household-kettle") },
  { id: "g_chair", title: "Garden chair.jpg", src: P("household-chair") },
  { id: "g_shelf", title: "Bookshelf.jpg", src: P("household-bookshelf") },
  { id: "g_craft_final", title: "Craft session FINAL.jpg", src: P("craft-session-final") },
  { id: "g_flowers", title: "Garden flowers.jpg", src: P("gallery-garden-flowers") },
  { id: "g_cake", title: "Birthday cake.jpg", src: P("gallery-noah-birthday-cake") },
];

// ---------- Private conversations ----------
let n = 0;
const m = (from, day, time, body) => ({ id: `m${++n}`, from, day, time, ...(typeof body === "string" ? { text: body } : body) });

const susanMsgs = [
  m("susan", "Oct 28", "6:02 PM", "I’ve been finding some great recipes lately. Have a look!"),
  m("susan", "Oct 28", "6:03 PM", { id: "su_mushroom", sharedPostId: "ek_mushroom" }),
  m("susan", "Oct 28", "6:03 PM", { id: "su_bread", sharedPostId: "hb_bread" }),
  m("susan", "Oct 28", "6:04 PM", { id: "su_salad", sharedPostId: "gt_salad" }),
  m("me", "Oct 28", "7:15 PM", "These all look delicious!"),
  m("susan", "Oct 28", "7:20 PM", { id: "su_reco", replyTo: "su_mushroom", text: "This creator has lots of quick, simple recipes. You might like their other posts." }),
  m("susan", "Yesterday", "9:10 AM", "Are you going to the craft session next month?"),
  m("me", "Yesterday", "9:30 AM", "I think so! I’ll let you know."),
];
const adamMsgs = [
  m("adam", "Oct 26", "3:10 PM", "Any plans for next summer? 😄"),
  m("me", "Oct 26", "3:40 PM", { id: "ad_concert", sharedPostId: "mm_2025" }),
  m("me", "Oct 26", "3:40 PM", "Shall we go to this together?"),
  m("adam", "Oct 26", "5:02 PM", "Count me in!"),
  m("adam", "Today", "8:15 AM", "Are we still on for Elena’s walk today?"),
  m("me", "Today", "8:30 AM", "Yes! I’ll check her story for any changes."),
];
const elenaMsgs = [
  m("elena", "Oct 20", "10:00 AM", "Thanks for coming on Saturday’s walk!"),
  m("me", "Oct 20", "10:30 AM", "It was lovely, thank you."),
  m("elena", "Today", "9:05 AM", { id: "el_map", text: "Here is the River Café map for today: https://maps.example/place/river-cafe-18-river-road" }),
];
const noraMsgs = [
  m("nora", "Oct 22", "2:00 PM", "Thanks for helping with the craft session! Here’s a first draft of the flyer."),
  m("nora", "Oct 22", "2:01 PM", { id: "no_draft", photos: [photo("ph_craft_draft", P("craft-session-draft"), "Craft session flyer marked DRAFT: November 22, 3 p.m., Community Center studio", { caption: "Craft session DRAFT.jpg" })] }),
  m("me", "Oct 22", "4:30 PM", "Looks great!"),
  m("nora", "Yesterday", "11:20 AM", "Small change — the studio is booked until 4, so we’re starting an hour later. Here is the final flyer."),
  m("nora", "Yesterday", "11:21 AM", { id: "no_final", photos: [photo("ph_craft_final", P("craft-session-final"), "Craft session flyer marked FINAL: November 22, 4 p.m., Community Center studio", { caption: "Craft session FINAL.jpg" })] }),
];
const samMsgs = [
  m("sam", "Oct 29", "5:00 PM", "Thanks for taking some tomatoes!"),
  m("me", "Oct 29", "5:20 PM", "Thank you! They were delicious."),
  m("sam", "Oct 30", "8:00 AM", "How are your balcony plants doing? Mine are looking a bit sad."),
];
const priyaMsgs = [
  m("priya", "Oct 27", "1:00 PM", "Thanks for helping at the food drive!"),
];

export const conversations = [
  { id: "c_adam", kind: "dm", with: "adam", messages: adamMsgs },
  { id: "c_elena", kind: "dm", with: "elena", messages: elenaMsgs },
  { id: "c_nora", kind: "dm", with: "nora", messages: noraMsgs },
  { id: "c_susan", kind: "dm", with: "susan", messages: susanMsgs },
  { id: "c_sam", kind: "dm", with: "sam", messages: samMsgs },
  { id: "c_priya", kind: "dm", with: "priya", messages: priyaMsgs },
];
