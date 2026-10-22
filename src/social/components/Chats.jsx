import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Search, ChevronLeft, Info, Send, Mic, Image as ImageIcon, X, Reply, Forward, Copy, Pencil, Download, Archive,
  ArchiveRestore, Play, Pause, Trash2, Square, FileText, MapPin, User, Lock, Check, Users, CornerUpLeft, BellOff, ExternalLink,
} from "lucide-react";
import { useSocial, PersonAvatar, Sheet, SheetItem, RichText, useLongPress, copyText, useFlashScroll } from "../ui.jsx";
import { GalleryPicker } from "./Sheets.jsx";
import { person, convTitle, resolveUrl, uid, findDM } from "../store.js";
import { ME } from "../world.js";

const EDIT_WINDOW_MS = 15 * 60 * 1000;

function ConvAvatar({ conv, size }) {
  if (conv.kind === "dm") return <PersonAvatar id={conv.with} size={size} />;
  const others = conv.members.filter((m) => m !== ME).slice(0, 2);
  return (
    <span className={`avatar-pair ${size ?? ""}`}>
      {others.map((id) => <PersonAvatar key={id} id={id} size="xs" />)}
    </span>
  );
}

function preview(world, conv) {
  const last = conv.messages[conv.messages.length - 1];
  if (!last) return "";
  const who = last.from === ME ? "You: " : conv.kind === "group" ? `${person(world, last.from).firstName}: ` : "";
  const body = last.audio ? "Sent a voice message" : last.photos ? "Sent a photo" : last.sharedPostId ? "Sent a post" : last.profileId ? "Shared a profile" : last.text;
  return who + body;
}

// ---------------- Chats list ----------------
export function ChatsList({ route }) {
  const { world, nav, log } = useSocial();
  const [q, setQ] = useState("");
  const archivedView = !!route.archived;
  const convs = world.convOrder.map((id) => world.conversations[id]).filter((c) => !!c.archived === archivedView);
  const archivedCount = Object.values(world.conversations).filter((c) => c.archived).length;
  const term = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return null;
    const contacts = Object.values(world.conversations).filter((c) => convTitle(world, c).toLowerCase().includes(term));
    const messages = [];
    for (const c of Object.values(world.conversations))
      for (const m of c.messages) {
        const hay = [m.text, m.sharedPostId && world.posts[m.sharedPostId]?.text].filter(Boolean).join(" ").toLowerCase();
        if (hay.includes(term)) messages.push({ conv: c, m });
      }
    return { contacts, messages };
  }, [term, world]);

  return (
    <div className="chats">
      {archivedView ? (
        <div className="page-head"><button className="icon-button" onClick={nav.back} aria-label="Back"><ChevronLeft size={24} /></button><span className="page-title"><strong>Archived chats</strong></span><span /></div>
      ) : (
        <h2 className="page-h2 chats-title">Chats</h2>
      )}
      {!archivedView && (
        <label className="search-field chats-search"><Search size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search messages and people" aria-label="Search messages and people"
            onBlur={() => q && log("chat_search", { q })} onKeyDown={(e) => e.key === "Enter" && log("chat_search", { q })} />
          {q && <button className="icon-button" onClick={() => setQ("")} aria-label="Clear search"><X size={16} /></button>}
        </label>
      )}
      {results ? (
        <div className="search-results">
          {results.contacts.length > 0 && <h3 className="section-label">Contacts &amp; chats</h3>}
          {results.contacts.map((c) => (
            <button key={c.id} className="conv-row" onClick={() => { log("chat_search_result", { q, convId: c.id }); nav.push({ name: "chat", convId: c.id }); }}>
              <ConvAvatar conv={c} /><span className="conv-copy"><strong>{convTitle(world, c)}</strong>{c.archived && <small>Archived</small>}</span>
            </button>
          ))}
          <h3 className="section-label">Messages</h3>
          {results.messages.length === 0 && <div className="empty">No messages found.</div>}
          {results.messages.map(({ conv, m }) => (
            <button key={conv.id + m.id} className="conv-row result" onClick={() => { log("chat_search_result", { q, convId: conv.id, msgId: m.id }); nav.push({ name: "chat", convId: conv.id, focusMsgId: m.id }); }}>
              <ConvAvatar conv={conv} />
              <span className="conv-copy">
                <strong>{convTitle(world, conv)}{conv.archived ? " · Archived" : ""}</strong>
                <small className="result-meta">{m.from === ME ? "You" : person(world, m.from).name} · {m.day}{m.time ? `, ${m.time}` : ""}</small>
                <span className="result-snippet"><Highlight text={m.text ?? world.posts[m.sharedPostId]?.text ?? ""} term={term} /></span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="conv-list">
          {convs.map((c) => {
            const last = c.messages[c.messages.length - 1];
            return (
              <button key={c.id} className="conv-row" onClick={() => { log("conversation_opened", { convId: c.id }); nav.push({ name: "chat", convId: c.id }); }}>
                <ConvAvatar conv={c} />
                <span className="conv-copy"><strong>{convTitle(world, c)}</strong><small>{preview(world, c)}</small></span>
                <time>{last?.day === "Today" ? last.time : last?.day}</time>
              </button>
            );
          })}
          {convs.length === 0 && <div className="empty">No chats.</div>}
          {!archivedView && archivedCount > 0 && (
            <button className="conv-row archived-link" onClick={() => { log("archived_opened"); nav.push({ name: "chats", archived: true }); }}>
              <span className="avatar group-chat-avatar"><Archive size={18} /></span>
              <span className="conv-copy"><strong>Archived chats</strong><small>{archivedCount} chat{archivedCount > 1 ? "s" : ""}</small></span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Highlight({ text, term }) {
  const i = text.toLowerCase().indexOf(term);
  if (i < 0) return text.slice(0, 90);
  const start = Math.max(0, i - 30);
  return (
    <>{start > 0 ? "…" : ""}{text.slice(start, i)}<mark>{text.slice(i, i + term.length)}</mark>{text.slice(i + term.length, i + term.length + 60)}</>
  );
}

// ---------------- Message content ----------------
function LinkPreview({ url }) {
  const { world, nav, log } = useSocial();
  const r = resolveUrl(world, url);
  if (!r || r.type === "external") return null;
  let icon, title, sub;
  if (r.type === "pdf") { const d = world.documents[r.docId]; icon = <FileText size={20} />; title = d.filename; sub = `PDF · ${new URL(url).hostname}`; }
  if (r.type === "map") { const p = world.places[r.placeId]; icon = <MapPin size={20} />; title = p.name; sub = `${p.address} · Maps`; }
  if (r.type === "profile") { const p = person(world, r.personId); icon = <User size={20} />; title = p.name; sub = "Connect profile"; }
  if (r.type === "post") { const p = world.posts[r.postId]; icon = <ExternalLink size={20} />; title = `${person(world, p.author).name}’s post`; sub = "connect.example"; }
  return (
    <button className="msg-link-preview" onClick={(e) => { e.stopPropagation(); log("chat_link_opened", { url }); nav.openUrl(url); }}>
      <span className={`link-icon ${r.type}`}>{icon}</span><span className="link-copy"><strong>{title}</strong><small>{sub}</small></span>
    </button>
  );
}

function SharedPostMsg({ postId }) {
  const { world, nav, log } = useSocial();
  const p = world.posts[postId];
  const g = p?.group ? world.groups[p.group] : null;
  if (!p) return <div className="msg-post unavailable">This content isn’t available.</div>;
  const thumb = p.photos?.[0];
  return (
    <button className="msg-post" onClick={(e) => { e.stopPropagation(); log("shared_post_opened", { objectId: postId }); nav.push({ name: "post", postId }); }}>
      {thumb && <img src={thumb.src} alt={thumb.alt} />}
      <span className="msg-post-body">
        <span className="msg-post-author"><PersonAvatar id={p.author} size="xxs" /> <strong>{person(world, p.author).name}</strong></span>
        <span className="msg-post-text">{p.text}</span>
        {g && <small><Lock size={10} /> {g.name}</small>}
      </span>
    </button>
  );
}

function ProfileMsg({ personId }) {
  const { world, nav } = useSocial();
  const p = person(world, personId);
  return (
    <button className="msg-post profile" onClick={(e) => { e.stopPropagation(); nav.push({ name: "profile", personId }); }}>
      <span className="msg-post-body"><span className="msg-post-author"><PersonAvatar id={personId} size="sm" /> <strong>{p.name}</strong></span><small>View profile on Connect</small></span>
    </button>
  );
}

function fmt(sec) { const s = Math.max(0, Math.round(sec)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }

export function AudioMsg({ audio, msgId }) {
  const { log } = useSocial();
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const el = useRef(null);
  const timer = useRef(null);
  const mode = useRef(null);

  const stop = () => {
    clearInterval(timer.current);
    el.current?.pause();
    if (mode.current === "tts") window.speechSynthesis?.cancel();
    setPlaying(false);
  };
  useEffect(() => stop, []); // eslint-disable-line

  const startTts = () => {
    mode.current = "tts";
    const synth = window.speechSynthesis;
    if (synth && audio.transcript) {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(audio.transcript);
      u.rate = 0.95;
      u.onend = () => { clearInterval(timer.current); setPlaying(false); setPos(audio.duration); };
      synth.speak(u);
    }
    const t0 = Date.now();
    timer.current = setInterval(() => {
      const p = (Date.now() - t0) / 1000;
      setPos(Math.min(p, audio.duration));
      if (p >= audio.duration + 3) { clearInterval(timer.current); setPlaying(false); }
    }, 200);
  };

  const play = () => {
    if (playing) { stop(); log("audio_paused", { objectId: msgId }); return; }
    setPlaying(true); setPos(0);
    log("audio_played", { objectId: msgId });
    if (audio.src) {
      const a = new Audio(audio.src);
      el.current = a;
      mode.current = "file";
      a.ontimeupdate = () => setPos(a.currentTime);
      a.onended = () => { setPlaying(false); setPos(audio.duration); };
      a.onerror = () => { if (audio.transcript) startTts(); else setPlaying(false); };
      a.play().catch(() => { if (audio.transcript) startTts(); else setPlaying(false); });
    } else startTts();
  };
  const pct = audio.duration ? Math.min(100, (pos / audio.duration) * 100) : 0;
  return (
    <div className="audio-msg" onClick={(e) => e.stopPropagation()}>
      <button className="audio-play" onClick={play} aria-label={playing ? "Pause voice message" : "Play voice message"}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
      <span className="audio-wave" aria-hidden>
        {Array.from({ length: 26 }, (_, i) => <i key={i} style={{ height: `${6 + ((i * 37) % 17)}px`, opacity: (i / 26) * 100 < pct ? 1 : 0.35 }} />)}
      </span>
      <small>{playing || pos ? fmt(pos) : fmt(audio.duration)}</small>
    </div>
  );
}

function replyLabel(world, m, quoted) {
  const who = m.from === ME ? "You" : person(world, m.from).firstName;
  if (quoted.from === m.from) return `${who} replied to ${m.from === ME ? "yourself" : "an earlier message"}`;
  return `${who} replied to ${quoted.from === ME ? "you" : person(world, quoted.from).firstName}`;
}

function Bubble({ conv, m, onAction, highlight, onJump }) {
  const { world, openViewer } = useSocial();
  const mine = m.from === ME;
  const press = useLongPress(() => onAction(m));
  const quoted = m.replyTo ? conv.messages.find((x) => x.id === m.replyTo) : null;
  const urls = (m.text ?? "").match(/https?:\/\/[^\s]+/g) ?? [];
  const bare = !m.text && (m.sharedPostId || m.photos || m.audio || m.profileId);
  return (
    <div className={`msg ${mine ? "mine" : ""} ${highlight ? "highlight" : ""}`} data-anchor={m.id}>
      {!mine && <PersonAvatar id={m.from} size="xs" />}
      <div className="msg-col">
        {!mine && conv.kind === "group" && <small className="msg-sender">{person(world, m.from).firstName}</small>}
        {quoted && (
          <button className="msg-quote" onClick={() => onJump(quoted.id)} aria-label="Go to the message this replies to">
            <span className="msg-quote-label"><CornerUpLeft size={12} /> {replyLabel(world, m, quoted)}</span>
            <span className="msg-quote-body">
              {quoted.sharedPostId ? <span className="quote-post">{world.posts[quoted.sharedPostId]?.photos?.[0] && <img src={world.posts[quoted.sharedPostId].photos[0].src} alt="" />}Shared post</span>
                : quoted.audio ? "Voice message" : quoted.photos ? <span className="quote-post"><img src={quoted.photos[0].src} alt="" />Photo</span> : quoted.text}
            </span>
          </button>
        )}
        {m.forwarded && <small className="msg-forwarded"><Forward size={11} /> Forwarded</small>}
        <div className={`bubble-body ${bare ? "bare" : ""}`} {...press} aria-label="Message. Press and hold for options.">
          {m.photos && (
            <div className={`msg-photos n${Math.min(m.photos.length, 4)}`}>
              {m.photos.map((p, i) => (
                <button key={p.id} onClick={(e) => { e.stopPropagation(); openViewer(m.photos, i, { convId: conv.id, msgId: m.id }); }} aria-label="Open photo">
                  <img src={p.src} alt={p.alt} />
                </button>
              ))}
            </div>
          )}
          {m.sharedPostId && <SharedPostMsg postId={m.sharedPostId} />}
          {m.profileId && <ProfileMsg personId={m.profileId} />}
          {m.audio && <AudioMsg audio={m.audio} msgId={m.id} />}
          {m.text && <span className="msg-text"><RichText text={m.text} /></span>}
          {urls.map((u) => <LinkPreview key={u} url={u} />)}
        </div>
        <small className="msg-time">{m.time}{m.edited ? " · Edited" : ""}</small>
      </div>
    </div>
  );
}

// ---------------- Chat ----------------
export function ChatView({ route }) {
  const { world, dispatch, nav, log, toast, openSheet, now } = useSocial();
  const existing = route.convId ? world.conversations[route.convId] : findDM(world, route.personId);
  const conv = existing ?? { id: null, kind: "dm", with: route.personId, messages: [] };
  const title = convTitle(world, conv);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editing, setEditing] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);
  const [picking, setPicking] = useState(false);
  const [rec, setRec] = useState(null); // {state:'recording'|'preview', start, url, duration, simulated}
  const [flash, setFlash] = useState(route.quiet ? null : route.focusMsgId ?? null);
  const scroller = useRef(null);
  const input = useRef(null);
  const media = useRef(null);
  const newConvId = useRef(uid("conv"));

  // Open at the latest message and stay pinned there while images load,
  // until the person scrolls.
  useLayoutEffect(() => {
    if (route.focusMsgId) return;
    const el = scroller.current?.closest(".social-scroll");
    if (!el) return;
    let pinned = true;
    const toBottom = () => { if (pinned) el.scrollTop = el.scrollHeight; };
    toBottom();
    const ro = new ResizeObserver(toBottom);
    ro.observe(scroller.current);
    const unpin = () => { pinned = false; };
    el.addEventListener("wheel", unpin, { passive: true });
    el.addEventListener("touchstart", unpin, { passive: true });
    const t = setTimeout(() => { pinned = false; ro.disconnect(); }, 2500);
    return () => { clearTimeout(t); ro.disconnect(); el.removeEventListener("wheel", unpin); el.removeEventListener("touchstart", unpin); };
  }, []); // eslint-disable-line
  useFlashScroll(route.focusMsgId, [], { flash: false });
  const prevLen = useRef(conv.messages.length);
  useEffect(() => {
    if (conv.messages.length > prevLen.current) {
      const el = scroller.current?.closest(".social-scroll");
      if (el) el.scrollTop = el.scrollHeight;
    }
    prevLen.current = conv.messages.length;
  }, [conv.messages.length]);

  const jump = (id) => {
    log("reply_reference_opened", { convId: conv.id, msgId: id });
    setFlash(id);
    const el = document.querySelector(`[data-anchor="${id}"]`);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    setTimeout(() => setFlash(null), 2200);
  };

  const sendMessages = (messages) => {
    dispatch({ type: "send", convId: existing?.id, toPerson: existing ? undefined : route.personId, newConvId: newConvId.current, messages });
  };

  const submit = (e) => {
    e?.preventDefault();
    const value = text.trim();
    if (editing) {
      if (!value) return;
      dispatch({ type: "editMessage", convId: conv.id, msgId: editing.id, text: value });
      log("message_edited", { convId: conv.id, msgId: editing.id, previousText: editing.text, text: value, secondsSinceSent: Math.round((Date.now() - editing.sentAt) / 1000) });
      toast("Message edited");
      setEditing(null); setText("");
      return;
    }
    if (!value) return;
    const id = uid("msg");
    sendMessages([{ id, text: value, replyTo: replyTo?.id }]);
    log("message_sent", { convId: existing?.id ?? newConvId.current, to: conv.kind === "dm" ? conv.with : conv.id, msgId: id, text: value, replyTo: replyTo?.id ?? null });
    setText(""); setReplyTo(null);
  };

  // ---- voice ----
  const startRec = async () => {
    log("voice_record_started", { convId: conv.id });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks = [];
      mr.ondataavailable = (ev) => chunks.push(ev.data);
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const url = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType }));
        setRec((r) => ({ ...r, state: "preview", url }));
      };
      mr.start();
      media.current = mr;
      setRec({ state: "recording", start: Date.now(), simulated: false });
    } catch {
      media.current = null;
      setRec({ state: "recording", start: Date.now(), simulated: true });
    }
  };
  const stopRec = () => {
    const duration = Math.max(1, Math.round((Date.now() - rec.start) / 1000));
    log("voice_record_stopped", { convId: conv.id, duration, simulated: rec.simulated });
    if (media.current && media.current.state === "recording") { setRec((r) => ({ ...r, duration })); media.current.stop(); }
    else setRec((r) => ({ ...r, state: "preview", duration }));
  };
  const discardRec = () => { log("voice_discarded", { convId: conv.id }); setRec(null); };
  const sendRec = () => {
    const id = uid("msg");
    sendMessages([{ id, audio: { id, duration: rec.duration, src: rec.url, simulated: rec.simulated } }]);
    log("voice_sent", { convId: existing?.id ?? newConvId.current, msgId: id, duration: rec.duration, simulated: rec.simulated });
    setRec(null);
  };
  const [, force] = useState(0);
  useEffect(() => { if (rec?.state !== "recording") return; const t = setInterval(() => force((n) => n + 1), 500); return () => clearInterval(t); }, [rec?.state]);

  // ---- message actions ----
  const canEdit = (m) => m && m.from === ME && m.text && !m.sharedPostId && m.sentAt && now() - m.sentAt < EDIT_WINDOW_MS;
  const action = (kind) => {
    const m = actionMsg;
    setActionMsg(null);
    log("message_action", { action: kind, convId: conv.id, msgId: m.id });
    if (kind === "reply") { setReplyTo(m); setEditing(null); setTimeout(() => input.current?.focus(), 0); }
    if (kind === "edit") { setEditing(m); setReplyTo(null); setText(m.text); setTimeout(() => input.current?.focus(), 0); }
    if (kind === "copy") { copyText(m.text ?? ""); toast("Copied"); }
    if (kind === "forward") openSheet({ type: "forward", convId: conv.id, msgId: m.id });
    if (kind === "save") { m.photos.forEach((p) => dispatch({ type: "saveToGallery", photo: p })); toast("Saved to Photos"); }
    if (kind === "openPost") nav.push({ name: "post", postId: m.sharedPostId });
  };

  let lastDay = null;
  return (
    <div className="chat">
      <div className="chat-head">
        <button className="icon-button" onClick={nav.back} aria-label="Back"><ChevronLeft size={24} /></button>
        <button className="chat-who" onClick={() => conv.id && nav.push({ name: "chatInfo", convId: conv.id })}>
          <ConvAvatar conv={conv} size="sm" />
          <span><strong>{title}</strong><small>{conv.kind === "group" ? `${conv.members.length} members` : "Active recently"}</small></span>
        </button>
        <button className="icon-button" aria-label="Chat details" onClick={() => conv.id && nav.push({ name: "chatInfo", convId: conv.id })}><Info size={21} /></button>
      </div>
      {conv.archived && <div className="chat-banner"><Archive size={14} /> This chat is archived. Sending a message will unarchive it.</div>}
      <div className="thread" ref={scroller}>
        {conv.messages.length === 0 && (
          <div className="chat-intro"><ConvAvatar conv={conv} size="xl" /><strong>{title}</strong><small>You’re friends on Connect</small></div>
        )}
        {conv.messages.map((m) => {
          const sep = m.day !== lastDay ? <div className="day-sep" key={`d-${m.id}`}>{m.day}</div> : null;
          lastDay = m.day;
          return [sep, <Bubble key={m.id} conv={conv} m={m} onAction={(x) => { setActionMsg(x); log("message_menu_opened", { convId: conv.id, msgId: x.id }); }} highlight={flash === m.id} onJump={jump} />];
        })}
      </div>

      <div className="chat-composer">
        {replyTo && (
          <div className="compose-bar">
            <Reply size={15} />
            <span>Replying to <strong>{replyTo.from === ME ? "yourself" : person(world, replyTo.from).firstName}</strong>
              <small>{replyTo.sharedPostId ? `Shared post: ${world.posts[replyTo.sharedPostId].text.slice(0, 50)}…` : replyTo.audio ? "Voice message" : replyTo.photos ? "Photo" : replyTo.text}</small></span>
            <button className="icon-button" aria-label="Cancel reply" onClick={() => setReplyTo(null)}><X size={16} /></button>
          </div>
        )}
        {editing && (
          <div className="compose-bar editing">
            <Pencil size={15} /><span>Editing message<small>{editing.text}</small></span>
            <button className="icon-button" aria-label="Cancel editing" onClick={() => { setEditing(null); setText(""); log("message_edit_cancelled", { msgId: editing.id }); }}><X size={16} /></button>
          </div>
        )}
        {rec ? (
          <div className="rec-row">
            {rec.state === "recording" ? (
              <>
                <button className="icon-button" onClick={discardRec} aria-label="Cancel recording"><Trash2 size={20} /></button>
                <span className="rec-live"><i className="rec-dot" /> Recording… {fmt((Date.now() - rec.start) / 1000)}{rec.simulated ? " (mic unavailable — simulated)" : ""}</span>
                <button className="rec-stop" onClick={stopRec} aria-label="Stop recording"><Square size={16} fill="#fff" /></button>
              </>
            ) : (
              <>
                <button className="icon-button" onClick={discardRec} aria-label="Delete recording"><Trash2 size={20} /></button>
                <span className="rec-preview">{rec.url ? <AudioMsg audio={{ src: rec.url, duration: rec.duration }} msgId="preview" /> : <span>Voice message · {fmt(rec.duration)}</span>}</span>
                <button className="send-button" onClick={sendRec} aria-label="Send voice message"><Send size={18} /></button>
              </>
            )}
          </div>
        ) : (
          <form className="compose-row" onSubmit={submit}>
            {!editing && <button type="button" className="icon-button" aria-label="Add photos" onClick={() => { setPicking(true); log("attachment_picker_opened", { convId: conv.id }); }}><ImageIcon size={22} /></button>}
            <input ref={input} value={text} onChange={(e) => setText(e.target.value)} placeholder={editing ? "Edit message" : "Message"} aria-label={editing ? "Edit message" : "Message"} />
            {editing ? (
              <button type="submit" className="send-button confirm" aria-label="Save edit"><Check size={19} /></button>
            ) : text.trim() ? (
              <button type="submit" className="send-button" aria-label="Send"><Send size={18} /></button>
            ) : (
              <button type="button" className="icon-button mic" aria-label="Record voice message" onClick={startRec}><Mic size={22} /></button>
            )}
          </form>
        )}
      </div>

      {actionMsg && (
        <Sheet onClose={() => setActionMsg(null)}>
          <div className="sheet-quote">{actionMsg.text ?? (actionMsg.sharedPostId ? world.posts[actionMsg.sharedPostId].text : actionMsg.audio ? "Voice message" : "Photo")}</div>
          <SheetItem icon={Reply} label="Reply" onClick={() => action("reply")} />
          <SheetItem icon={Forward} label="Forward" onClick={() => action("forward")} />
          {actionMsg.text && <SheetItem icon={Copy} label="Copy" onClick={() => action("copy")} />}
          {canEdit(actionMsg) && <SheetItem icon={Pencil} label="Edit" onClick={() => action("edit")} />}
          {actionMsg.photos && <SheetItem icon={Download} label="Save photo" onClick={() => action("save")} />}
          {actionMsg.sharedPostId && <SheetItem icon={ExternalLink} label="View post" onClick={() => action("openPost")} />}
        </Sheet>
      )}
      {picking && (
        <GalleryPicker onClose={() => setPicking(false)} onPick={(photos) => {
          setPicking(false);
          const msgs = [{ id: uid("msg"), photos }];
          if (text.trim()) { msgs.push({ id: uid("msg"), text: text.trim() }); setText(""); }
          sendMessages(msgs);
          log("photos_sent", { convId: existing?.id ?? newConvId.current, to: conv.kind === "dm" ? conv.with : conv.id, photos: photos.map((p) => p.alt), galleryIds: photos.map((p) => p.galleryId) });
        }} />
      )}
    </div>
  );
}

// ---------------- Chat details ----------------
export function ChatInfo({ route }) {
  const { world, nav, dispatch, log, openViewer, toast } = useSocial();
  const conv = world.conversations[route.convId];
  const [view, setView] = useState(route.view ?? null);
  const [q, setQ] = useState("");
  const photos = conv.messages.flatMap((m) => (m.photos ?? []).map((p) => ({ ...p, msgId: m.id })));
  const title = convTitle(world, conv);
  const hits = q.trim() ? conv.messages.filter((m) => (m.text ?? "").toLowerCase().includes(q.toLowerCase())) : [];

  if (view === "media")
    return (
      <div>
        <div className="page-head"><button className="icon-button" onClick={() => setView(null)} aria-label="Back"><ChevronLeft size={24} /></button><span className="page-title"><strong>Media</strong><small>{title}</small></span><span /></div>
        <div className="media-grid">
          {photos.map((p, i) => (
            <button key={p.id} onClick={() => { log("media_opened", { convId: conv.id, objectId: p.id }); openViewer(photos, i, { convId: conv.id }); }} aria-label="Open photo"><img src={p.src} alt={p.alt} /></button>
          ))}
          {photos.length === 0 && <div className="empty">No photos yet.</div>}
        </div>
      </div>
    );
  if (view === "search")
    return (
      <div>
        <div className="page-head search-head"><button className="icon-button" onClick={() => setView(null)} aria-label="Back"><ChevronLeft size={24} /></button>
          <label className="search-field grow"><Search size={16} /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search in ${title}`} aria-label={`Search in ${title}`} onBlur={() => q && log("chat_inner_search", { convId: conv.id, q })} /></label></div>
        {q.trim() && <p className="search-count">{hits.length} result{hits.length === 1 ? "" : "s"}</p>}
        {hits.map((m) => (
          <button key={m.id} className="conv-row result" onClick={() => { log("chat_inner_search_result", { convId: conv.id, msgId: m.id, q }); nav.replace({ name: "chat", convId: conv.id, focusMsgId: m.id }); }}>
            <PersonAvatar id={m.from} />
            <span className="conv-copy"><strong>{m.from === ME ? "You" : person(world, m.from).name}</strong><small className="result-meta">{m.day}{m.time ? `, ${m.time}` : ""}</small><span className="result-snippet"><Highlight text={m.text} term={q.toLowerCase()} /></span></span>
          </button>
        ))}
      </div>
    );
  return (
    <div>
      <div className="page-head"><button className="icon-button" onClick={nav.back} aria-label="Back"><ChevronLeft size={24} /></button><span className="page-title" /><span /></div>
      <div className="chat-info-id"><ConvAvatar conv={conv} size="xl" /><h2>{title}</h2>{conv.kind === "group" && <small>{conv.members.length} members</small>}</div>
      <div className="chat-info-buttons">
        {conv.kind === "dm" && <button onClick={() => nav.push({ name: "profile", personId: conv.with })}><User size={20} /><span>Profile</span></button>}
        <button onClick={() => { setView("search"); log("chat_inner_search_opened", { convId: conv.id }); }}><Search size={20} /><span>Search</span></button>
        <button onClick={() => toast("Notifications muted")}><BellOff size={20} /><span>Mute</span></button>
      </div>
      <div className="list-card">
        <button className="list-row" onClick={() => { setView("media"); log("chat_media_opened", { convId: conv.id }); }}><ImageIcon size={22} /><span><strong>Media</strong><small>{photos.length} photo{photos.length === 1 ? "" : "s"}</small></span></button>
        {conv.kind === "group" && (
          <div className="list-sub">
            <h3 className="section-label">Members</h3>
            {conv.members.map((id) => (
              <button key={id} className="list-row" onClick={() => nav.push({ name: "profile", personId: id })}><PersonAvatar id={id} /><span><strong>{person(world, id).name}{id === ME ? " (you)" : ""}</strong></span></button>
            ))}
          </div>
        )}
        <button className="list-row" onClick={() => { dispatch({ type: "setArchived", convId: conv.id, archived: !conv.archived }); log(conv.archived ? "chat_unarchived" : "chat_archived", { convId: conv.id }); toast(conv.archived ? "Chat unarchived" : "Chat archived"); }}>
          {conv.archived ? <ArchiveRestore size={22} /> : <Archive size={22} />}<span><strong>{conv.archived ? "Unarchive chat" : "Archive chat"}</strong></span>
        </button>
      </div>
      {void Users}
    </div>
  );
}
