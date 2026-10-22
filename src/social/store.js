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

export const APP_ORIGIN = "https://connect.example";
export const postUrl = (id) => `${APP_ORIGIN}/post/${id}`;
export const profileUrl = (id) => `${APP_ORIGIN}/profile/${id}`;

const clock = (d = new Date()) =>
  d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

let seq = 0;
const uid = (p) => `${p}_${Date.now().toString(36)}_${++seq}`;

// Build a fresh, mutable copy of the world. `setup` lets a task preload state.
export function createWorld(setup) {
  const now = Date.now();
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
    conversations: Object.fromEntries(base.conversations.map((c) => [c.id, c])),
    convOrder: base.conversations.map((c) => c.id),
  });
  for (const c of Object.values(w.conversations)) {
    for (const msg of c.messages) {
      if (msg.sentAtOffsetMin != null) {
        msg.sentAt = now + msg.sentAtOffsetMin * 60000;
        msg.time = clock(new Date(msg.sentAt));
      }
    }
  }
  setup?.(w);
  return w;
}

// ---------- Selectors ----------
export const person = (w, id) => w.people[id] ?? { id, name: id, firstName: id };
export const isMember = (w, groupId) => w.groups[groupId]?.members.includes(base.ME);
export const canSee = (w, post) =>
  !post.group || isMember(w, post.group);

export function findComment(post, commentId) {
  for (const c of post.comments ?? []) {
    if (c.id === commentId) return { comment: c, parent: null };
    for (const r of c.replies ?? []) if (r.id === commentId) return { comment: r, parent: c };
  }
  return null;
}

export function countComments(post) {
  return (post.comments ?? []).reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0);
}

export function convTitle(w, conv) {
  return conv.kind === "dm" ? person(w, conv.with).name : conv.title;
}

export function findDM(w, personId) {
  return Object.values(w.conversations).find((c) => c.kind === "dm" && c.with === personId);
}

// Resolve a URL to an in-app destination.
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
  switch (action.type) {
    case "react": {
      const p = next.posts[action.postId];
      if (action.reaction) p.reactions[base.ME] = action.reaction;
      else delete p.reactions[base.ME];
      return next;
    }
    case "likeComment": {
      const hit = findComment(next.posts[action.postId], action.commentId);
      if (hit) {
        hit.comment.likes ??= [];
        const i = hit.comment.likes.indexOf(base.ME);
        if (i >= 0) hit.comment.likes.splice(i, 1);
        else hit.comment.likes.push(base.ME);
      }
      return next;
    }
    case "comment": {
      const p = next.posts[action.postId];
      const c = { id: action.id, author: base.ME, time: "Just now", text: action.text, replyToId: action.replyToId ?? null };
      if (action.parentId) {
        const parent = p.comments.find((x) => x.id === action.parentId);
        parent.replies ??= [];
        parent.replies.push(c);
      } else {
        p.comments.push({ ...c, replies: [] });
      }
      return next;
    }
    case "vote": {
      const poll = next.posts[action.postId].poll;
      const opt = poll.options.find((o) => o.id === action.optionId);
      const had = opt.votes.includes(base.ME);
      if (poll.multiple) {
        opt.votes = had ? opt.votes.filter((v) => v !== base.ME) : [...opt.votes, base.ME];
      } else {
        poll.options.forEach((o) => (o.votes = o.votes.filter((v) => v !== base.ME)));
        if (!had) opt.votes.push(base.ME);
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
        id, author: base.ME, time: "Just now", reactions: {}, comments: [],
        audience: action.group ? undefined : "public",
        group: action.group ?? undefined,
        text: action.text ?? "",
        photos: action.photos?.length ? action.photos : undefined,
        sharedPostId: action.sharedPostId,
        inFeed: action.group ? undefined : 0,
      };
      next.postOrder.unshift(id);
      return next;
    }
    case "send": {
      // action: { convId?, toPerson?, message }
      let conv = action.convId ? next.conversations[action.convId] : findDM(next, action.toPerson);
      if (!conv) {
        conv = { id: action.newConvId, kind: "dm", with: action.toPerson, messages: [] };
        next.conversations[conv.id] = conv;
        next.convOrder.unshift(conv.id);
      }
      conv.archived = false;
      for (const msg of action.messages) {
        conv.messages.push({ from: base.ME, day: "Today", time: clock(now), sentAt: now.getTime(), ...msg });
      }
      next.convOrder = [conv.id, ...next.convOrder.filter((id) => id !== conv.id)];
      return next;
    }
    case "editMessage": {
      const msg = next.conversations[action.convId].messages.find((x) => x.id === action.msgId);
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
      const n = next.notifications.find((x) => x.id === action.id);
      if (n) n.unread = false;
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
