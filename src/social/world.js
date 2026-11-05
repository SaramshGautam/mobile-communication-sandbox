// Shared baseline dataset for the social-media app (task bank v3, T01-S … T04-S).
// Every scenario starts from a fresh copy of this world; scenarios.js sets the
// start screen and any extra state (for example your own story). All people,
// places and URLs are fictional. The study account is "You".

import { photo as P, avatar as realAvatar } from "./photos.js";

const A = "/assets/avatars/";
export const ME = "me";

// relationship: "you" | "friend" | "following" | "none" | "request" (sent you a friend request)
export const people = {
  me: { id: "me", name: "Jordan Morgan", firstName: "Jordan", username: "jordan.morgan", bio: "Gardening, good books and neighborhood walks.", relationship: "you" },
  // T01-S
  linda: { id: "linda", name: "Linda Park", firstName: "Linda", username: "linda.park", avatar: A + "linda-park.webp", bio: "Book lover · Maple", relationship: "friend" },
  rachel: { id: "rachel", name: "Rachel Brady", firstName: "Rachel", username: "rachel.brady", avatar: A + "rachel-brady.webp", bio: "Maple Neighbors Social Club", relationship: "request", public: true, lives: "Lives in Maple" },
  sarah_pottery: { id: "sarah_pottery", name: "Sarah Mitchell", firstName: "Sarah", username: "Sarah_Mitchell", avatar: A + "sarah-mitchell.webp", bio: "Pottery classes for adults in Maple · Wheel and hand-building · Maple Arts Studio", relationship: "none", public: true, followers: "486 followers" },
  sarah_runner: { id: "sarah_runner", name: "Sarah Mitchell", firstName: "Sarah", username: "SarahMitchell47", bio: "Runner · Coffee lover · Chicago", relationship: "none", public: true, followers: "1.1K followers" },
  sarah_nurse: { id: "sarah_nurse", name: "Sarah Mitchell", firstName: "Sarah", username: "Sarah_Mitchell2000", bio: "Nurse · Mom of two · Riverside", relationship: "none", public: true, followers: "230 followers" },
  // T02-S
  maple_cc: { id: "maple_cc", name: "Maple Community Center", firstName: "Maple Community Center", username: "maplecommunitycenter", isPage: true, public: true, bio: "Events and classes for Maple residents · 24 Oak Street", relationship: "following", followedByMe: true, followers: "3.2K followers" },
  susan: { id: "susan", name: "Susan Clark", firstName: "Susan", username: "susan.clark", avatar: A + "susan-clark-social.webp", bio: "Neighbor · Always cooking something", relationship: "friend" },
  // T03-S
  jenna: { id: "jenna", name: "Jenna Lopez", firstName: "Jenna", username: "jenna.lopez", avatar: A + "jenna-lopez.webp", bio: "Neighbor · Garden enthusiast", relationship: "friend" },
  // T04-S
  daniel: { id: "daniel", name: "Daniel Brooks", firstName: "Daniel", username: "daniel.brooks", avatar: A + "daniel-brooks.webp", bio: "Organizer, Maple Hiking Group", relationship: "friend" },
  pat: { id: "pat", name: "Pat Williams", firstName: "Pat", username: "pat.williams", avatar: A + "pat-williams.webp", bio: "Neighbor · Weekend hiker", relationship: "friend" },
  michael: { id: "michael", name: "Michael Chen", firstName: "Michael", username: "michael.chen", avatar: A + "michael-chen.webp", bio: "Neighbor", relationship: "friend" },
  // Everyday friends and pages
  grace: { id: "grace", name: "Grace Hill", firstName: "Grace", username: "grace.hill", bio: "Maple resident", relationship: "friend", avatar: A + "grace-hill.webp" },
  lee: { id: "lee", name: "Lee Johnson", firstName: "Lee", username: "lee.johnson", avatar: A + "lee-johnson.webp", bio: "Oak Street since 2009", relationship: "friend" },
  sam: { id: "sam", name: "Sam Rivera", firstName: "Sam", username: "sam.rivera", avatar: A + "sam-rivera.webp", bio: "Neighbor on Oak Street", relationship: "friend" },
  rosa: { id: "rosa", name: "Rosa Martinez", firstName: "Rosa", username: "rosa.martinez", bio: "Local gardening volunteer", relationship: "friend", avatar: A + "rosa-martinez.webp" },
  kim: { id: "kim", name: "Kim Nguyen", firstName: "Kim", username: "kim.nguyen", bio: "Maple Book Club", relationship: "request", public: true },
  tom: { id: "tom", name: "Tom Baker", firstName: "Tom", username: "tom.baker", bio: "Retired · Woodworking", relationship: "request", public: true, avatar: A + "tom-baker.webp" },
  maple_library: { id: "maple_library", name: "Maple Library", firstName: "Maple Library", username: "maplelibrary", isPage: true, public: true, bio: "The local public library for Maple", relationship: "none", followers: "2.4K followers" },
  everyday_kitchen: { id: "everyday_kitchen", name: "Everyday Kitchen", firstName: "Everyday Kitchen", username: "everydaykitchen", isPage: true, public: true, bio: "Quick, simple recipes for every day", relationship: "following", followedByMe: true, followers: "48K followers", avatar: A + "everyday-kitchen.webp" },
};
for (const p of Object.values(people)) if (!p.avatar) p.avatar = realAvatar(p.id);

export const groups = {
  hiking: {
    id: "hiking", name: "Maple Hiking Group", privacy: "Private group", color: "#2e8b57",
    members: ["me", "daniel", "pat", "michael", "grace"], admins: ["daniel"],
    description: "Weekly hikes around Maple. Daniel organizes our routes.",
  },
  oak: {
    id: "oak", name: "Oak Street Neighbors", privacy: "Private group", color: "#41658a",
    members: ["me", "lee", "grace", "sam", "susan"], admins: ["lee"],
    description: "Oak Street residents sharing local activities, news and help.",
  },
};

export const documents = {};
export const places = {};

const photo = (id, src, alt, extra = {}) => ({ id, src, alt, ...extra });

// ---------- Posts ----------
// audience: "public" | "friends"; group posts use `group`. inFeed = order in the home feed.
export const posts = [
  // ----- T02-S: Maple Community Center lunch (top of the feed) -----
  { id: "mcc_lunch", author: "maple_cc", audience: "public", time: "Today · 8:00 AM", inFeed: 1,
    text: "Join us for lunch and conversation! We’ll meet in the Main Hall at Maple Community Center, 24 Oak Street. Admission is $10 per person, and lunch is included. Vegetables from our community garden, fresh bread from Brookside Bakery and homemade desserts from our volunteers. Seats are limited, so come early!",
    collapse: true,
    photos: [photo("ph_mcc_lunch", P("maple-community-lunch"), "Maple Community Lunch, November 5th, noon–2 p.m. Everyone is welcome! See the caption for the location and more details.")],
    reactions: { grace: "love", lee: "like", sam: "like", rosa: "like" },
    comments: [
      { id: "c_mcc1", author: "grace", time: "2h", text: "😍", replies: [] },
      { id: "c_mcc2", author: "lee", time: "1h", text: "Awesome!", replies: [] },
      { id: "c_mcc3", author: "rosa", time: "45m", text: "See you there!", replies: [] },
    ] },
  // ----- T04-S: Daniel's announcement -----
  { id: "dn_next_hike", author: "daniel", audience: "public", time: "Today · 7:30 AM", inFeed: 2,
    text: "Let’s head outdoors again next week! 🌿 Join us for a hike and some good company. We’ll meet at the main entrance to Maple Park. Bring water, comfortable walking shoes, and a friend—everyone is welcome!",
    photos: [photo("ph_dn_trail", P("daniel-next-hike"), "Hiking group poster: Join us next week. Meet at Maple Park, main entrance. Everyone welcome!")],
    reactions: { pat: "like", michael: "love" }, comments: [] },
  // ----- Everyday feed -----
  { id: "feed_lee_garden", author: "lee", audience: "friends", time: "Yesterday at 8:05 AM", inFeed: 3,
    text: "The garden after last night’s rain.", photos: [photo("ph_lee_garden", P("lee-garden-after-rain"), "A garden with pink and yellow flowers after rain")],
    reactions: { grace: "love", sam: "like" }, comments: [{ id: "c_lg1", author: "grace", time: "1d", text: "So green!", replies: [] }] },
  { id: "feed_grace", author: "grace", audience: "friends", time: "Yesterday at 2:40 PM", inFeed: 4,
    text: "Finished my first quilt square! Only 29 more to go 😄", reactions: { susan: "love" }, comments: [] },
  { id: "ek_mushroom", author: "everyday_kitchen", audience: "public", time: "October 20", inFeed: 5,
    text: "15-minute mushroom soup — creamy, simple and ready before you know it.", photos: [photo("ph_ek_m", P("recipe-mushroom-soup"), "A bowl of creamy mushroom soup")], reactions: { susan: "love" }, comments: [] },
  { id: "mcc_yoga", author: "maple_cc", audience: "public", time: "October 28",
    text: "Gentle yoga for beginners every Tuesday at 10 a.m. in the Studio Room.", reactions: { grace: "like" }, comments: [] },

  // ----- T04-S: your hike post -----
  { id: "my_hike", author: "me", audience: "friends", time: "Wednesday at 6:10 PM",
    text: "What a hike today with Daniel, Pat and Michael! 🥾",
    photos: [photo("ph_my_hike", P("hike-overlook"), "Daniel, Pat and Michael walking along a trail toward the hills")],
    reactions: { pat: "love", daniel: "like", michael: "like", linda: "like" },
    comments: [
      { id: "c_hk_dn", author: "daniel", time: "2d", text: "Thanks for coming along!", replies: [] },
      { id: "c_hk_mi", author: "michael", time: "2d", text: "Great day 🙌", replies: [] },
      { id: "c_hk_pat", author: "pat", time: "5h", text: "Great photo! That last climb was worth it.", replies: [] },
      { id: "c_hk_dn2", author: "daniel", time: "3h", text: "I’m driving too, but my car is already full.", replies: [] },
    ] },
  { id: "my_soup", author: "me", audience: "friends", time: "October 5",
    text: "First soup of the season!", reactions: { susan: "love" }, comments: [] },

  // ----- T01-S: the three Sarah Mitchell accounts -----
  { id: "sp_class", author: "sarah_pottery", audience: "public", time: "October 30",
    text: "New pottery classes for adults start in November! Beginners welcome. Saturdays at Maple Arts Studio. Message me for dates and prices.",
    photos: [photo("ph_sp1", P("pottery-1"), "Shaping a clay pot on a pottery wheel")], reactions: { grace: "like" }, comments: [] },
  { id: "sp_glaze", author: "sarah_pottery", audience: "public", time: "October 22",
    text: "Glazing day! Look at these colors.", photos: [photo("ph_sp2", P("pottery-2"), "Painting glaze on cups at the studio")], reactions: {}, comments: [] },
  { id: "sr_run", author: "sarah_runner", audience: "public", time: "October 27",
    text: "Half marathon done! Thanks for all the support 🏃‍♀️", reactions: {}, comments: [] },
  { id: "sn_post", author: "sarah_nurse", audience: "public", time: "October 19",
    text: "Fall family picnic in Riverside Park 🍂", reactions: {}, comments: [] },
  { id: "dn_old", author: "daniel", group: "hiking", time: "October 30",
    text: "This week’s hike: Wednesday, 9 a.m. at Pine Ridge. See you there!", reactions: { pat: "like", michael: "like" }, comments: [] },
];

export const saved = [];

// ---------- Stories. Items never expire during a session. ----------
// Your own story is added per scenario in scenarios.js.
export const stories = [
  { id: "st_sarah", author: "sarah_pottery", time: "3h", audience: "public", items: [
    { id: "st_sp1", kind: "photo", src: P("pottery-1"), alt: "Pottery wheel class", text: "Pottery wheel class 🏺" },
    { id: "st_sp2", kind: "photo", src: P("pottery-2"), alt: "Glazing bowls", text: "Glazing our bowls" },
    { id: "st_sp3", kind: "photo", src: P("pottery-3"), alt: "Finished cups and bowls from class", text: "Fresh from the kiln" },
  ] },
  { id: "st_rachel", author: "rachel", time: "6h", audience: "public", items: [
    { id: "st_ra1", kind: "photo", src: P("rachel-pottery-night"), alt: "Friends making pottery at a studio table", text: "Pottery night with friends 🏺" },
  ] },
  { id: "st_michael", author: "michael", time: "2h", audience: "friends", items: [
    { id: "st_mi1", kind: "photo", src: P("hike-trail-story"), alt: "Three hikers walking along a trail this week", text: "This week’s hike ⛰️" },
    { id: "st_mi2", kind: "photo", src: P("michael-ride-question"), alt: "I need a ride to next week’s hike. Does anyone have a spare seat?" },
  ] },
  { id: "st_lee", author: "lee", time: "5h", audience: "friends", items: [
    { id: "st_lee_1", kind: "text", text: "Coffee and the crossword ☕", bg: "#8a5a2b" },
  ] },
  { id: "st_library", author: "maple_library", time: "8h", audience: "public", items: [
    { id: "st_lib_1", kind: "text", text: "New large-print books have arrived!", bg: "#20364d" },
  ] },
];

export const events = {};

// ---------- Friend requests (T01-S) ----------
export const friendRequests = [
  { id: "fr_kim", from: "kim", time: "1d", mutual: 2 },
  { id: "fr_rachel", from: "rachel", time: "3h", mutual: 3 },
  { id: "fr_tom", from: "tom", time: "4d", mutual: 1 },
];

// ---------- Notifications ----------
export const notifications = [
  { id: "n_pat", actor: "pat", text: "commented on your photo: “Great photo! That last climb was worth it.”", time: "5h", unread: true,
    route: { name: "post", postId: "my_hike", focusCommentId: "c_hk_pat" } },
  { id: "n_rachel", actor: "rachel", text: "sent you a friend request.", time: "3h", unread: true, route: { name: "friends" } },
  { id: "n_mcc", actor: "maple_cc", text: "posted: “Join us for lunch and conversation!…”", time: "8h", unread: true, route: { name: "post", postId: "mcc_lunch" } },
  { id: "n_daniel", actor: "daniel", text: "posted about next week’s hike.", time: "9h", unread: false, route: { name: "post", postId: "dn_next_hike" } },
  { id: "n_michael", actor: "michael", text: "reacted to your photo.", time: "2d", unread: false, route: { name: "post", postId: "my_hike" } },
  { id: "n_kim", actor: "kim", text: "sent you a friend request.", time: "1d", unread: false, route: { name: "friends" } },
];

// ---------- Study phone photo gallery ----------
export const gallery = [
  { id: "g_garden", title: "Garden flowers.jpg", src: P("garden-post") },
  { id: "g_blurry", title: "IMG_5120.jpg", src: P("garden-blurry") },
  { id: "g_hike", title: "Hike.jpg", src: P("hike-overlook") },
  { id: "g_cake", title: "Birthday cake.jpg", src: P("gallery-noah-birthday-cake") },
  { id: "g_kettle", title: "Kettle.jpg", src: P("household-kettle") },
  { id: "g_receipt", title: "Receipt.jpg", src: P("gallery-shopping-receipt") },
];

// ---------- Private conversations ----------
let n = 0;
const m = (from, day, time, body) => ({ id: `m${++n}`, from, day, time, ...(typeof body === "string" ? { text: body } : body) });

export const conversations = [
  { id: "c_susan", kind: "dm", with: "susan", messages: [
    m("susan", "Oct 28", "6:02 PM", "Have you tried the new café on Oak Street?"),
    m("me", "Oct 28", "7:15 PM", "Not yet! Let’s go together."),
  ] },
  { id: "c_linda", kind: "dm", with: "linda", messages: [
    m("linda", "Oct 30", "4:00 PM", "Thanks for the book! I’m halfway through."),
    m("me", "Oct 30", "4:20 PM", "So glad you like it 😊"),
  ] },
  { id: "c_michael", kind: "dm", with: "michael", messages: [
    m("michael", "Wednesday", "7:00 PM", "Great hike today!"),
  ] },
  { id: "c_grace", kind: "dm", with: "grace", messages: [
    m("grace", "Oct 25", "10:00 AM", "Are you coming to the quilting circle?"),
  ] },
];
