import * as base from "./world.js";

export const REACTIONS = [
  { id: "like", label: "Like", emoji: "👍", color: "#1b74e4" },
  { id: "love", label: "Love", emoji: "❤️", color: "#e8364f" },
  { id: "care", label: "Care", emoji: "🥰", color: "#f2b01e" },
  { id: "haha", label: "Haha", emoji: "😆", color: "#f2b01e" },
  { id: "wow", label: "Wow", emoji: "😮", color: "#f2b01e" },
  { id: "sad", label: "Sad", emoji: "😢", color: "#f2b01e" },
  { id: "angry", label: "Angry", emoji: "😡", color: "#e9710f" },
];
export const reactionById = Object.fromEntries(REACTIONS.map((r) => [r.id, r]));
export const MSG_REACTIONS = ["❤️", "👍", "😆", "😮", "😢", "🙏"];

export const APP_ORIGIN = "https://connect.example";
export const postUrl = (id) => `${APP_ORIGIN}/post/${id}`;
export const profileUrl = (id) => `${APP_ORIGIN}/profile/${id}`;

const clock = (d = new Date()) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

let seq = 0;
const uid = (p) => `${p}_${Date.now().toString(36)}_${++seq}`;

// Fresh, mutable copy of the baseline world. `setup` lets a scenario preload state.
export function createWorld(setup) {
  const w = structuredClone({
    people: base.people,
    groups: base.groups,
    posts: Object.fromEntries(base.posts.map((p) => [p.id, p])),
    postOrder: base.posts.map((p) => p.id),
    documents: base.documents,
    places: base.places,
    saved: base.saved,
    notifications: base.notifications,
    gallery: base.gallery,
    stories: base.stories,
    events: base.events,
    friendRequests: base.friendRequests,
    conversations: Object.fromEntries(base.conversations.map((c) => [c.id, c])),
    convOrder: base.conversations.map((c) => c.id),
  });
  setup?.(w);
  return w;
}

// ---------- Selectors ----------
export const person = (w, id) => w.people[id] ?? { id, name: id, firstName: id };
export const isMember = (w, groupId) => w.groups[groupId]?.members.includes(base.ME);
export const isFriend = (w, id) => w.people[id]?.relationship === "friend";
export const friends = (w) => Object.values(w.people).filter((p) => p.relationship === "friend");
export const canSee = (w, post) => {
  if (!post || post.removed) return false;
  if (post.group) return isMember(w, post.group) || w.groups[post.group]?.privacy === "Public group";
  if (post.author === base.ME || post.audience === "public") return true;
  return isFriend(w, post.author);
};

export function findComment(post, commentId) {
  for (const c of post.comments ?? []) {
    if (c.id === commentId) return { comment: c, parent: null };
    for (const r of c.replies ?? []) if (r.id === commentId) return { comment: r, parent: c };
  }
  return null;
}
export const countComments = (post) => (post.comments ?? []).reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0);
export const convTitle = (w, conv) => (conv.kind === "dm" ? person(w, conv.with).name : conv.title);
export const findDM = (w, personId) => Object.values(w.conversations).find((c) => c.kind === "dm" && c.with === personId);

export function resolveUrl(w, url) {
  if (!url) return null;
  const clean = url.trim().replace(/[).,]+$/, "");
  for (const d of Object.values(w.documents)) if (d.url && d.url === clean) return { type: "pdf", docId: d.id, url: clean };
  for (const p of Object.values(w.places)) if (p.url === clean) return { type: "map", placeId: p.id, url: clean };
  let m = clean.match(/^https:\/\/connect\.example\/post\/([\w-]+)/);
  if (m && w.posts[m[1]]) return { type: "post", postId: m[1], url: clean };
  m = clean.match(/^https:\/\/connect\.example\/profile\/([\w-]+)/);
  if (m && w.people[m[1]]) return { type: "profile", personId: m[1], url: clean };
  return { type: "external", url: clean };
}

// ---------- Reducer ----------
export function reducer(w, action) {
  const next = structuredClone(w);
  const now = new Date();
  const ME = base.ME;
  const findMsg = (convId, msgId) => next.conversations[convId]?.messages.find((x) => x.id === msgId);
  switch (action.type) {
    case "react": {
      const p = next.posts[action.postId];
      if (action.reaction) p.reactions[ME] = action.reaction;
      else delete p.reactions[ME];
      return next;
    }
    case "likeComment": {
      const hit = findComment(next.posts[action.postId], action.commentId);
      if (hit) {
        hit.comment.likes ??= [];
        const i = hit.comment.likes.indexOf(ME);
        if (i >= 0) hit.comment.likes.splice(i, 1);
        else hit.comment.likes.push(ME);
      }
      return next;
    }
    case "comment": {
      const p = next.posts[action.postId];
      const c = { id: action.id, author: ME, time: "Just now", text: action.text, replyToId: action.replyToId ?? null };
      if (action.parentId) {
        const parent = p.comments.find((x) => x.id === action.parentId);
        parent.replies ??= [];
        parent.replies.push(c);
      } else p.comments.push({ ...c, replies: [] });
      return next;
    }
    case "vote": {
      const poll = next.posts[action.postId].poll;
      const opt = poll.options.find((o) => o.id === action.optionId);
      const had = opt.votes.includes(ME);
      if (poll.multiple) opt.votes = had ? opt.votes.filter((v) => v !== ME) : [...opt.votes, ME];
      else {
        poll.options.forEach((o) => (o.votes = o.votes.filter((v) => v !== ME)));
        if (!had) opt.votes.push(ME);
      }
      return next;
    }
    case "toggleSave": {
      const i = next.saved.indexOf(action.postId);
      if (i >= 0) next.saved.splice(i, 1);
      else next.saved.unshift(action.postId);
      return next;
    }
    case "createPost": {
      const id = action.id;
      next.posts[id] = {
        id, author: ME, time: "Just now", reactions: {}, comments: [],
        audience: action.group ? undefined : action.audience ?? "public",
        group: action.group ?? undefined,
        text: action.text ?? "",
        photos: action.photos?.length ? action.photos : undefined,
        sharedPostId: action.sharedPostId,
        sharedProfileId: action.sharedProfileId,
        poll: action.poll,
        inFeed: 0,
      };
      next.postOrder.unshift(id);
      return next;
    }
    case "editPost": {
      const p = next.posts[action.postId];
      p.history ??= [];
      p.history.push(p.text);
      p.text = action.text;
      p.edited = true;
      return next;
    }
    case "follow": {
      const p = next.people[action.personId];
      if (action.on) { p.relationship = p.relationship === "none" ? "following" : p.relationship; p.followedByMe = true; }
      else { p.followedByMe = false; if (p.relationship === "following") p.relationship = "none"; }
      return next;
    }
    case "respondRequest": {
      const r = next.friendRequests.find((x) => x.id === action.requestId);
      if (!r) return w;
      r.status = action.accept ? "accepted" : "deleted";
      next.people[r.from].relationship = action.accept ? "friend" : "none";
      return next;
    }
    case "joinGroup": {
      const g = next.groups[action.groupId];
      if (!g.members.includes(ME)) g.members.push(ME);
      return next;
    }
    case "rsvp": {
      next.events[action.eventId].myRsvp = action.rsvp;
      return next;
    }
    case "inviteToEvent": {
      const e = next.events[action.eventId];
      e.invitedByMe ??= [];
      for (const id of action.personIds) {
        if (!e.invited.includes(id)) e.invited.push(id);
        if (!e.invitedByMe.includes(id)) e.invitedByMe.push(id);
      }
      return next;
    }
    case "storyViewed": {
      const s = next.stories.find((x) => x.id === action.storyId);
      if (s) s.viewed = true;
      return next;
    }
    case "createStory": {
      next.stories.unshift({ id: action.id, author: ME, time: "Just now", audience: action.audience, customAudience: action.customAudience, items: action.items, mine: true });
      return next;
    }
    case "send": {
      let conv = action.convId ? next.conversations[action.convId] : findDM(next, action.toPerson);
      if (!conv) {
        conv = { id: action.newConvId, kind: "dm", with: action.toPerson, messages: [] };
        next.conversations[conv.id] = conv;
        next.convOrder.unshift(conv.id);
      }
      conv.archived = false;
      for (const msg of action.messages) conv.messages.push({ from: ME, day: "Today", time: clock(now), sentAt: now.getTime(), ...msg });
      next.convOrder = [conv.id, ...next.convOrder.filter((id) => id !== conv.id)];
      return next;
    }
    case "msgReact": {
      const msg = findMsg(action.convId, action.msgId);
      msg.reactions ??= {};
      if (action.emoji && msg.reactions[ME] !== action.emoji) msg.reactions[ME] = action.emoji;
      else delete msg.reactions[ME];
      return next;
    }
    case "unsend": {
      const msg = findMsg(action.convId, action.msgId);
      if (action.forEveryone) {
        for (const k of ["text", "photos", "sharedPostId", "audio", "profileId", "replyTo", "reactions"]) delete msg[k];
        msg.unsent = true;
      } else msg.hiddenForMe = true;
      return next;
    }
    case "editMessage": {
      const msg = findMsg(action.convId, action.msgId);
      msg.previousText = msg.text;
      msg.text = action.text;
      msg.edited = true;
      return next;
    }
    case "setArchived": {
      next.conversations[action.convId].archived = action.archived;
      return next;
    }
    case "readNotification": {
      const nn = next.notifications.find((x) => x.id === action.id);
      if (nn) nn.unread = false;
      return next;
    }
    case "saveToGallery": {
      if (!next.gallery.some((g) => g.src === action.photo.src))
        next.gallery.unshift({ id: uid("g"), title: action.photo.caption || action.photo.alt || "Photo", src: action.photo.src });
      return next;
    }
    default:
      return w;
  }
}

export { uid, clock };
