// Start screen and extra state for each social-app scenario (task bank v3, T01-S … T04-S).
//   tab:   active bottom tab ("home" | "groups" | "messages" | "notifications" | "menu")
//   stack: routes pushed on top of that tab
//   setup: extra state on the fresh baseline world
// Every scenario starts from a fresh copy of world.js (TASK START); steps 2–4
// continue from the participant's current state (CONTINUE).

import { ME } from "./world.js";
import { photo as P } from "./photos.js";

const feed = { tab: "home", stack: [] };

const addMyStory = (w, items) => {
  w.stories.unshift({ id: "st_me", author: ME, time: items[0].time, audience: "friends", mine: true, items });
};

export const START_STATES = {
  "T01-S": feed, // Sarah Mitchell, Rachel's request, Linda
  "T02-S": feed, // Maple Community Center lunch post
  "T03-S": { ...feed, setup: (w) => { // your garden story (with an accidental blurry photo) and Jenna's reply
    addMyStory(w, [
      { id: "st_me_garden", kind: "photo", src: P("garden-story"), alt: "Flowers in your garden", text: "My garden this morning 🌼", time: "3h", viewers: [["jenna", "2h"], ["susan", "2h"], ["lee", "1h"]] },
      { id: "st_me_blurry", kind: "photo", src: P("garden-blurry"), alt: "A blurry photo", time: "3h", viewers: [["susan", "2h"], ["lee", "1h"]] },
    ]);
    const c = { id: "c_jenna", kind: "dm", with: "jenna", messages: [
      { id: "je_1", from: "jenna", day: "Oct 20", time: "5:00 PM", text: "Thanks for the tomato seedlings!" },
      { id: "je_reply", from: "jenna", day: "Today", time: "9:40 AM", text: "Beautiful! Send me a photo of them when they bloom.",
        storyRef: { storyId: "st_me", itemId: "st_me_garden", src: P("garden-story"), author: ME } },
    ] };
    w.conversations.c_jenna = c;
    w.convOrder = ["c_jenna", ...w.convOrder];
    w.notifications.unshift({ id: "n_jenna", actor: "jenna", text: "replied to your story.", time: "1h", unread: true, route: { name: "chat", convId: "c_jenna" } });
  } },
  "T04-S": { ...feed, setup: (w) => { // your hiking story with viewers
    addMyStory(w, [
      { id: "st_me_hike", kind: "text", text: "We’re going hiking again next week! Reply if you’d like to join.", bg: "#2e8b57", time: "4h",
        viewers: [["michael", "3h"], ["daniel", "3h"], ["pat", "2h"], ["linda", "1h"]] },
    ]);
  } },
};

export const DEFAULT_START = feed;

// The social scenarios have no scripted (delayed) events.
export const researcherTriggers = () => [];
