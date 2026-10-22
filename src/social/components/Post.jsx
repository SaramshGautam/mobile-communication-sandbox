import { useEffect, useRef, useState } from "react";
import {
  ThumbsUp, MessageCircle, Share2, MoreHorizontal, FileText, MapPin, Bookmark,
  BookmarkCheck, Link2, Send, Lock, ChevronRight, X, Smile, CalendarDays,
} from "lucide-react";
import {
  useSocial, PersonAvatar, AudienceIcon, RichText, useLongPress, Sheet, SheetItem, copyText,
} from "../ui.jsx";
import {
  REACTIONS, reactionById, person, countComments, canSee, postUrl, uid,
} from "../store.js";
import { ME } from "../world.js";

// ---------------- Reactions ----------------
function ReactionButton({ post }) {
  const { dispatch, log } = useSocial();
  const [picker, setPicker] = useState(false);
  const mine = post.reactions?.[ME];
  const r = mine ? reactionById[mine] : null;

  const set = (reaction, via) => {
    dispatch({ type: "react", postId: post.id, reaction });
    log(reaction ? "reaction_set" : "reaction_removed", { objectId: post.id, reaction, previous: mine ?? null, via });
    setPicker(false);
  };
  const press = useLongPress(
    () => { setPicker(true); log("reaction_picker_opened", { objectId: post.id }); },
    () => set(mine ? null : "like", "tap"),
  );

  useEffect(() => {
    if (!picker) return;
    const close = () => setPicker(false);
    const t = setTimeout(() => window.addEventListener("pointerdown", close), 0);
    return () => { clearTimeout(t); window.removeEventListener("pointerdown", close); };
  }, [picker]);

  return (
    <div className="reaction-wrap">
      {picker && (
        <div className="reaction-picker" role="menu" aria-label="Reactions" onPointerDown={(e) => e.stopPropagation()}>
          {REACTIONS.map((x) => (
            <button key={x.id} role="menuitem" aria-label={x.label} title={x.label} className={mine === x.id ? "active" : ""} onClick={() => set(x.id, "picker")}>
              <span>{x.emoji}</span><small>{x.label}</small>
            </button>
          ))}
        </div>
      )}
      <button className="action-btn" style={r ? { color: r.color, fontWeight: 700 } : undefined} aria-label={r ? `${r.label} (press and hold to change)` : "Like (press and hold for reactions)"} {...press}>
        {r && r.id !== "like" ? <span className="action-emoji">{r.emoji}</span> : <ThumbsUp size={19} fill={r ? r.color : "none"} />}
        {r ? r.label : "Like"}
      </button>
    </div>
  );
}

function ReactionSummary({ post, onComments }) {
  const entries = Object.entries(post.reactions ?? {}).filter(([, v]) => v);
  const n = countComments(post);
  if (!entries.length && !n) return null;
  const types = [...new Set(entries.map(([, v]) => v))].slice(0, 3);
  const mine = post.reactions?.[ME];
  const others = entries.length - (mine ? 1 : 0);
  const label = mine ? (others ? `You and ${others} other${others > 1 ? "s" : ""}` : "You") : entries.length || "";
  return (
    <div className="reaction-summary">
      <span className="reaction-stack">
        {types.map((t) => <span key={t} className="reaction-dot">{reactionById[t].emoji}</span>)}
        {entries.length > 0 && <span className="reaction-count">{label}</span>}
      </span>
      {n > 0 && <button className="link-button" onClick={onComments}>{n} comment{n > 1 ? "s" : ""}</button>}
    </div>
  );
}

// ---------------- Comments ----------------
function Comment({ post, c, parent, onReply, highlight }) {
  const { dispatch, log, nav, openViewer, world } = useSocial();
  const author = person(world, c.author);
  const liked = c.likes?.includes(ME);
  const replyTarget = c.replyToId && parent ? (parent.id === c.replyToId ? parent : parent.replies?.find((r) => r.id === c.replyToId)) : null;
  return (
    <div className={`comment ${highlight === c.id ? "highlight" : ""}`} data-anchor={c.id}>
      <button className="avatar-btn" onClick={() => nav.push({ name: "profile", personId: c.author })}><PersonAvatar id={c.author} size={parent ? "xs" : "sm"} /></button>
      <div className="comment-main">
        <div className="comment-bubble">
          <button className="name-link" onClick={() => nav.push({ name: "profile", personId: c.author })}>{author.name}</button>
          {replyTarget && replyTarget.id !== parent?.id && (
            <span className="reply-ref">Replying to {person(world, replyTarget.author).firstName}</span>
          )}
          <span className="comment-text"><RichText text={c.text} /></span>
        </div>
        {c.image && (
          <button className="comment-image" onClick={() => openViewer([c.image], 0, { postId: post.id })}>
            <img src={c.image.src} alt={c.image.alt} loading="lazy" />
          </button>
        )}
        <div className="comment-meta">
          <span>{c.time}</span>
          <button className={liked ? "liked" : ""} onClick={() => { dispatch({ type: "likeComment", postId: post.id, commentId: c.id }); log(liked ? "comment_unliked" : "comment_liked", { objectId: c.id, postId: post.id }); }}>Like</button>
          <button onClick={() => onReply(parent ?? c, c)}>Reply</button>
          {c.likes?.length > 0 && <span className="comment-likes">👍 {c.likes.length}</span>}
        </div>
      </div>
    </div>
  );
}

function CommentThread({ post, c, onReply, highlight, initiallyOpen }) {
  const { log } = useSocial();
  const replies = c.replies ?? [];
  const [open, setOpen] = useState(initiallyOpen || replies.some((r) => r.id === highlight));
  useEffect(() => { if (replies.some((r) => r.id === highlight)) setOpen(true); }, [highlight]); // eslint-disable-line
  // Show the thread when you add a reply to it.
  const lastAuthor = replies[replies.length - 1]?.author;
  const prevCount = useRef(replies.length);
  useEffect(() => {
    if (replies.length > prevCount.current && lastAuthor === ME) setOpen(true);
    prevCount.current = replies.length;
  }, [replies.length]); // eslint-disable-line
  return (
    <div className="comment-thread">
      <Comment post={post} c={c} onReply={onReply} highlight={highlight} />
      {replies.length > 0 && (
        <div className="replies">
          {open ? (
            replies.map((r) => <Comment key={r.id} post={post} c={r} parent={c} onReply={onReply} highlight={highlight} />)
          ) : (
            <button className="view-replies" onClick={() => { setOpen(true); log("replies_expanded", { objectId: c.id, postId: post.id }); }}>
              <ChevronRight size={14} /> View {replies.length} repl{replies.length > 1 ? "ies" : "y"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const QUICK_EMOJI = ["❤️", "😍", "🥰", "👍", "😂", "🎉", "👏", "😢"];

export function Comments({ post, highlight, expandReplies, autoFocus }) {
  const { dispatch, log, world } = useSocial();
  const [text, setText] = useState("");
  const [replying, setReplying] = useState(null); // { parent, target }
  const [emoji, setEmoji] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { if (autoFocus) inputRef.current?.focus({ preventScroll: true }); }, [autoFocus]);

  const onReply = (parent, target) => {
    setReplying({ parent, target });
    log("reply_started", { objectId: target.id, postId: post.id });
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  const submit = (e) => {
    e?.preventDefault();
    const value = text.trim();
    if (!value) return;
    const id = uid("c");
    dispatch({ type: "comment", postId: post.id, id, text: value, parentId: replying?.parent.id, replyToId: replying?.target.id });
    log(replying ? "reply_posted" : "comment_posted", {
      objectId: id, postId: post.id, parentCommentId: replying?.parent.id ?? null,
      replyToCommentId: replying?.target.id ?? null, text: value,
    });
    setText(""); setReplying(null); setEmoji(false);
  };
  const who = replying ? person(world, replying.target.author) : null;

  return (
    <div className="comments">
      {(post.comments ?? []).map((c) => (
        <CommentThread key={c.id} post={post} c={c} onReply={onReply} highlight={highlight}
          initiallyOpen={expandReplies === true || (Array.isArray(expandReplies) && expandReplies.includes(c.id))} />
      ))}
      <form className="comment-composer" onSubmit={submit}>
        {replying && (
          <div className="replying-bar">
            Replying to <strong>{who.name}</strong>
            <button type="button" onClick={() => setReplying(null)} aria-label="Cancel reply"><X size={14} /> Cancel</button>
          </div>
        )}
        <div className="comment-input-row">
          <PersonAvatar id={ME} size="sm" />
          <div className="comment-input">
            <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)}
              placeholder={replying ? `Reply to ${who.firstName}…` : "Write a comment…"} aria-label={replying ? `Reply to ${who.name}` : "Write a comment"} />
            <button type="button" className="icon-button" aria-label="Emoji" onClick={() => setEmoji((v) => !v)}><Smile size={19} /></button>
            <button type="submit" className="icon-button send" aria-label="Post comment" disabled={!text.trim()}><Send size={18} /></button>
          </div>
        </div>
        {emoji && (
          <div className="emoji-row">
            {QUICK_EMOJI.map((em) => (
              <button type="button" key={em} onClick={() => { setText((t) => t + em); inputRef.current?.focus(); }}>{em}</button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}

// ---------------- Attachments ----------------
function Photos({ post }) {
  const { openViewer, log } = useSocial();
  const photos = post.photos ?? [];
  if (!photos.length) return null;
  const open = (i) => { openViewer(photos, i, { postId: post.id }); log("photo_opened", { objectId: photos[i].id, postId: post.id }); };
  if (photos.length === 1) {
    const p = photos[0];
    return (
      <button className="post-photo" onClick={() => open(0)} aria-label={`Open photo: ${p.alt}`}>
        <img src={p.src} alt={p.alt} width={p.width} height={p.height} loading="lazy" decoding="async" />
      </button>
    );
  }
  return (
    <div className={`photo-grid n${Math.min(photos.length, 4)}`}>
      {photos.slice(0, 4).map((p, i) => (
        <button key={p.id} onClick={() => open(i)} aria-label={`Open photo: ${p.caption ?? p.alt}`}>
          <img src={p.src} alt={p.alt} loading="lazy" />
          {p.caption && <span className="photo-caption">{p.caption}</span>}
        </button>
      ))}
    </div>
  );
}

function LinkCard({ link, post }) {
  const { world, nav, openSheet, log } = useSocial();
  const target = link.kind === "pdf" ? world.documents[link.docId] : world.places[link.placeId];
  const url = target.url;
  const open = () => { log("link_opened", { objectId: link.docId ?? link.placeId, url, postId: post.id }); nav.openUrl(url); };
  return (
    <div className="link-card">
      <button className="link-main" onClick={open}>
        <span className={`link-icon ${link.kind}`}>{link.kind === "pdf" ? <FileText size={22} /> : <MapPin size={22} />}</span>
        <span className="link-copy">
          <strong>{link.kind === "pdf" ? target.filename : target.name}</strong>
          <small>{link.kind === "map" ? `${target.address} · ` : "PDF · "}{new URL(url).hostname}</small>
        </span>
      </button>
      <button className="icon-button" aria-label="Link options" onClick={() => openSheet({ type: "link", url, label: link.kind === "pdf" ? target.filename : target.name })}>
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
}

function FileRow({ docId }) {
  const { world, nav, log } = useSocial();
  const d = world.documents[docId];
  return (
    <button className="file-row" onClick={() => { log("file_opened", { objectId: docId }); nav.push({ name: "pdf", docId }); }}>
      <span className="link-icon pdf"><FileText size={22} /></span>
      <span className="link-copy"><strong>{d.filename}</strong><small>PDF document</small></span>
    </button>
  );
}

function Poll({ post }) {
  const { dispatch, log } = useSocial();
  const poll = post.poll;
  const total = new Set(poll.options.flatMap((o) => o.votes)).size;
  return (
    <div className="poll" role="group" aria-label={poll.question}>
      <strong className="poll-q">{poll.question}</strong>
      <small className="poll-hint">{poll.multiple ? "Select one or more options" : "Select one option"} · {total} voter{total === 1 ? "" : "s"}</small>
      {poll.options.map((o) => {
        const mine = o.votes.includes(ME);
        const pct = total ? Math.round((o.votes.length / total) * 100) : 0;
        return (
          <button key={o.id} className={mine ? "poll-option voted" : "poll-option"} role={poll.multiple ? "checkbox" : "radio"} aria-checked={mine}
            onClick={() => { dispatch({ type: "vote", postId: post.id, optionId: o.id }); log(mine ? "poll_vote_removed" : "poll_vote_added", { objectId: post.id, optionId: o.id, option: o.text }); }}>
            <span className="poll-bar" style={{ width: `${pct}%` }} />
            <span className={poll.multiple ? "poll-check square" : "poll-check"}>{mine ? "✓" : ""}</span>
            <span className="poll-text">{o.text}</span>
            <span className="poll-voters">
              {o.votes.slice(0, 3).map((v) => <PersonAvatar key={v} id={v} size="xxs" />)}
              <small>{o.votes.length}</small>
            </span>
          </button>
        );
      })}
      {poll.options.some((o) => o.votes.includes(ME)) && (
        <small className="poll-yours">You voted for {poll.options.filter((o) => o.votes.includes(ME)).map((o) => o.text).join(" and ")}</small>
      )}
    </div>
  );
}

function EventCard({ ev }) {
  return (
    <div className="event-card">
      <span className="event-date"><small>{ev.month}</small><strong>{ev.day}</strong></span>
      <span className="event-copy">
        <strong>{ev.title}</strong>
        <small><CalendarDays size={12} /> {ev.date} at {ev.time}</small>
        <small><MapPin size={12} /> {ev.place}</small>
      </span>
    </div>
  );
}

function SharedEmbed({ postId }) {
  const { world, nav } = useSocial();
  const p = world.posts[postId];
  if (!p) return null;
  return (
    <div className="shared-embed" role="link" tabIndex={0} onClick={(e) => { e.stopPropagation(); nav.push({ name: "post", postId }); }}>
      <Photos post={p} />
      <div className="shared-embed-body">
        <PostHeader post={p} compact />
        <p><RichText text={p.text} /></p>
      </div>
    </div>
  );
}

// ---------------- Header & menu ----------------
export function PostHeader({ post, compact, onMenu }) {
  const { world, nav } = useSocial();
  const a = person(world, post.author);
  const g = post.group ? world.groups[post.group] : null;
  return (
    <div className="post-head">
      <button className="avatar-btn" onClick={(e) => { e.stopPropagation(); nav.push({ name: "profile", personId: post.author }); }}>
        <PersonAvatar id={post.author} size={compact ? "sm" : undefined} />
      </button>
      <div className="post-head-copy">
        <span className="post-head-names">
          <button className="name-link" onClick={(e) => { e.stopPropagation(); nav.push({ name: "profile", personId: post.author }); }}>{a.name}</button>
          {post.sharedPostId && !compact && <span className="muted"> shared a post</span>}
          {g && !compact && (
            <>
              <span className="muted"> ▸ </span>
              <button className="name-link" onClick={(e) => { e.stopPropagation(); nav.push({ name: "group", groupId: g.id }); }}>{g.name}</button>
            </>
          )}
        </span>
        <small>{post.time} · <AudienceIcon post={post} /></small>
      </div>
      {onMenu && (
        <button className="icon-button" aria-label="Post options" onClick={(e) => { e.stopPropagation(); onMenu(); }}>
          <MoreHorizontal size={19} />
        </button>
      )}
    </div>
  );
}

export function PostMenu({ post, onClose }) {
  const { world, dispatch, log, toast } = useSocial();
  const saved = world.saved.includes(post.id);
  return (
    <Sheet onClose={onClose}>
      <SheetItem icon={saved ? BookmarkCheck : Bookmark} label={saved ? "Unsave post" : "Save post"} sub={saved ? "Remove this from your saved items" : "Add this to your saved items"}
        onClick={() => { dispatch({ type: "toggleSave", postId: post.id }); log(saved ? "post_unsaved" : "post_saved", { objectId: post.id }); toast(saved ? "Removed from saved" : "Saved"); onClose(); }} />
      <SheetItem icon={Link2} label="Copy link" onClick={async () => { await copyText(postUrl(post.id)); log("post_link_copied", { objectId: post.id, url: postUrl(post.id) }); toast("Link copied"); onClose(); }} />
    </Sheet>
  );
}

// ---------------- Card ----------------
export default function PostCard({ post, expandComments = false, expandReplies, highlightComment, detail = false, anchor }) {
  const { world, openSheet, log } = useSocial();
  const [showComments, setShowComments] = useState(expandComments || detail || !!highlightComment);
  const [focusComposer, setFocusComposer] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => { if (highlightComment) setShowComments(true); }, [highlightComment]);

  if (!canSee(world, post)) {
    return (
      <article className="post-card unavailable">
        <Lock size={18} /> This content isn’t available. It’s in a private group you’re not a member of.
      </article>
    );
  }
  const toggleComments = () => {
    setShowComments((v) => !v);
    log(showComments ? "comments_collapsed" : "comments_expanded", { objectId: post.id });
  };

  return (
    <article className="post-card" data-anchor={anchor ?? post.id}>
      <PostHeader post={post} onMenu={() => setMenu(true)} />
      {post.text && <p className="post-text"><RichText text={post.text} /></p>}
      {post.event && <EventCard ev={post.event} />}
      {post.sharedPostId ? <SharedEmbed postId={post.sharedPostId} /> : <Photos post={post} />}
      {post.links?.map((l, i) => <LinkCard key={i} link={l} post={post} />)}
      {post.files?.map((f) => <FileRow key={f} docId={f} />)}
      {post.poll && <Poll post={post} />}
      <ReactionSummary post={post} onComments={toggleComments} />
      <div className="post-actions">
        <ReactionButton post={post} />
        <button className="action-btn" onClick={() => { setShowComments(true); setFocusComposer((n) => n + 1); log("comment_opened", { objectId: post.id }); }}>
          <MessageCircle size={19} /> Comment
        </button>
        <button className="action-btn" onClick={() => { openSheet({ type: "post", postId: post.id }); log("share_opened", { objectId: post.id }); }}>
          <Share2 size={19} /> Share
        </button>
      </div>
      {showComments && <Comments post={post} highlight={highlightComment} expandReplies={expandReplies} autoFocus={focusComposer} />}
      {menu && <PostMenu post={post} onClose={() => setMenu(false)} />}
    </article>
  );
}
