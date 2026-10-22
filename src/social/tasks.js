// Start state for every social-app (-S) task in the task bank.
//   tab:    bottom-nav tab that is active ("home" | "groups" | "messages" | "notifications" | "menu")
//   stack:  routes pushed on top of that tab (last one is shown)
//   setup:  optional function that preloads state into the fresh world
// Every task starts from a fresh copy of src/social/world.js.

import { ME } from "./world.js";

const dropMessage = (w, convId, msgId) => {
  const c = w.conversations[convId];
  c.messages = c.messages.filter((m) => m.id !== msgId);
};

const home = { tab: "home", stack: [] };
const chats = { tab: "messages", stack: [] };
const chat = (convId, focusMsgId) => ({ tab: "messages", stack: [{ name: "chat", convId, focusMsgId }] });
const post = (postId, extra = {}) => ({ tab: "home", stack: [{ name: "post", postId, ...extra }] });
const group = (groupId, extra = {}) => ({ tab: "groups", stack: [{ name: "group", groupId, ...extra }] });

export const START_STATES = {
  // Community lunch (Sam / Oak Street Neighbors)
  "P01-S": home,
  "P02-S": group("oak", { focusPostId: "oak_shared_lunch" }),
  "P03-S": group("oak", { focusPostId: "oak_shared_lunch" }),
  "P04-S": post("sam_flyer"),
  // Recipes in Susan's chat
  "P05-S": { ...chat("c_susan"), setup: (w) => dropMessage(w, "c_susan", "susan_reco") },
  "P06-S": chat("c_susan"),
  "P07-S": { ...chat("c_susan"), setup: (w) => dropMessage(w, "c_susan", "susan_reco") },
  "P08-S": { ...chat("c_susan", "susan_mushroom"), setup: (w) => dropMessage(w, "c_susan", "susan_reco") },
  // Noah's kindergarten photo
  "P09-S": home,
  "P10-S": home,
  "P11-S": post("anna_noah"),
  "P12-S": post("anna_noah"),
  // Oak Street closure (private messages)
  "P13-S": chats,
  "P14-S": chat("c_maya", "maya_notice"),
  "P15-S": chat("c_adam"),
  "P16-S": chat("c_maya", "maya_correction"),
  // Book Club
  "P17-S": home,
  "P18-S": post("book_planning"),
  "P19-S": group("book", { focusPostId: "book_poll" }),
  "P20-S": post("book_reading_list"),
  // Walking Group
  "P21-S": home,
  "P22-S": group("walk", { focusPostId: "walk_announcement" }),
  "P23-S": group("walk", { focusPostId: "walk_booking" }),
  "P24-S": post("walk_meeting"),
  // Volunteer Team
  "P25-S": group("volunteer"),
  "P26-S": post("vol_rota_final", { expandReplies: true }),
  "P27-S": home,
  "P28-S": post("vol_supplies"),
  // Family
  "P29-S": chat("c_family"),
  "P30-S": chat("c_family"),
  "P31-S": {
    ...post("family_music"),
    setup: (w) => { w.posts.family_music.reactions[ME] = "sad"; },
  },
  "P32-S": group("family"),
  // Garden Club
  "P33-S": group("garden"),
  "P34-S": post("garden_planters", { expandReplies: true }),
  "P35-S": group("garden", { focusPostId: "garden_poll" }),
  "P36-S": group("garden"),
  // Craft Circle
  "P37-S": chats,
  "P38-S": chat("c_craft", "craft_audio"),
  "P39-S": {
    ...chat("c_nora"),
    setup: (w) => { w.conversations.c_nora.archived = false; },
  },
  "P40-S": post("nora_craftfair"),
  // Museum Friends
  "P41-S": home,
  "P42-S": post("museum_visit"),
  "P43-S": {
    ...group("museum", { focusPostId: "museum_poll" }),
    setup: (w) => { w.posts.museum_poll.poll.options.find((o) => o.id === "am").votes.push(ME); },
  },
  "P44-S": post("museum_pickup"),
  // Oak Street Neighbors (repair café, ladder, seed swap)
  "P45-S": home,
  "P46-S": post("oak_repair_nov", { expandReplies: true }),
  "P47-S": group("oak", { focusPostId: "oak_ladder" }),
  "P48-S": post("sam_seedswap"),
  // Susan / Sam / Maya messages
  "P49-S": chats,
  "P50-S": chat("c_sam", "sam_passing"),
  "P51-S": chat("c_maya"),
  "P52-S": chat("c_sam", "sam_passing"),
};

export const DEFAULT_START = home;
