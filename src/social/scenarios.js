// Start screen for each social-app scenario (T01-S … T13-S).
//   tab:   active bottom tab ("home" | "groups" | "messages" | "notifications" | "menu")
//   stack: routes pushed on top of that tab
//   setup: optional extra state on the fresh baseline world (none needed so far)
// Every scenario starts from a fresh copy of world.js (TASK START); steps 2–4
// continue from the participant's current state (CONTINUE).

const feed = { tab: "home", stack: [] };
const chats = { tab: "messages", stack: [] };

export const START_STATES = {
  "T01-S": feed, // Mina Shah profiles
  "T02-S": feed, // Ben Ortiz friend request
  "T03-S": feed, // Rosa's reply notification
  "T04-S": feed, // Garden Volunteers photo note
  "T05-S": feed, // Elena's story
  "T06-S": chats, // Susan's recommendation
  "T07-S": feed, // Oak Street Free Exchange
  "T08-S": feed, // Maple Library hours
  "T09-S": feed, // Museum event invitation
  "T10-S": chats, // Nora's final flyer
  "T11-S": feed, // Book-sale post correction
  "T12-S": feed, // Training-date poll
  "T13-S": chats, // Unsend the old concert post
};

export const DEFAULT_START = feed;

// The social scenarios have no scripted (delayed) events.
export const researcherTriggers = () => [];
