import { useMemo, useState } from "react";
import {
  Send, Users, Link2, Share2, ChevronLeft, X, Download, Image as ImageIcon, Lock, Globe, Check, Search, ChevronRight, MessageCircle, BarChart3,
} from "lucide-react";
import { useSocial, Sheet, SheetItem, PersonAvatar, GroupIcon, copyText } from "../ui.jsx";
import { person, postUrl, profileUrl, uid, findDM, convTitle } from "../store.js";
import { ME } from "../world.js";

// What the shared thing turns into inside a chat message.
function payloadFor(world, req) {
  switch (req.type) {
    case "post": {
      const p = world.posts[req.postId];
      const g = p.group ? world.groups[p.group] : null;
      return { msg: { sharedPostId: req.postId }, label: "post", objectId: req.postId, privateGroup: g?.privacy === "Private group" ? g.id : null };
    }
    case "link": return { msg: { text: req.url }, label: "link", objectId: req.url };
    case "photo": return { msg: { photos: [req.photo] }, label: "photo", objectId: req.photo.id };
    case "profile": return { msg: { profileId: req.personId }, label: "profile", objectId: req.personId };
    case "forward": {
      const m = world.conversations[req.convId].messages.find((x) => x.id === req.msgId);
      const { text, photos, sharedPostId, audio, profileId } = m;
      return { msg: { text, photos, sharedPostId, audio, profileId, forwarded: true }, label: "message", objectId: req.msgId };
    }
    default: return null;
  }
}

function recipientsFor(world) {
  const list = [];
  const seen = new Set();
  for (const id of world.convOrder) {
    const c = world.conversations[id];
    if (c.kind === "dm") { if (!seen.has(c.with)) { seen.add(c.with); list.push({ key: c.with, personId: c.with }); } }
    else list.push({ key: c.id, convId: c.id });
  }
  for (const p of Object.values(world.people)) {
    if (p.id === ME || p.isPage || seen.has(p.id) || p.relationship !== "friend") continue;
    list.push({ key: p.id, personId: p.id });
  }
  return list;
}

export function SendList({ req, onDone, onBack }) {
  const { world, dispatch, log, toast } = useSocial();
  const [q, setQ] = useState("");
  const [note, setNote] = useState(req.type === "forward" ? "" : req.initialNote ?? "");
  const [sent, setSent] = useState({});
  const payload = useMemo(() => payloadFor(world, req), []); // eslint-disable-line
  const all = useMemo(() => recipientsFor(world), []); // eslint-disable-line
  const shown = all.filter((r) => {
    const name = r.personId ? person(world, r.personId).name : convTitle(world, world.conversations[r.convId]);
    return name.toLowerCase().includes(q.toLowerCase());
  });

  const send = (r) => {
    const messages = [{ id: uid("msg"), ...payload.msg }];
    if (note.trim()) messages.push({ id: uid("msg"), text: note.trim() });
    const existing = r.convId ?? findDM(world, r.personId)?.id;
    const newConvId = existing ?? uid("conv");
    dispatch({ type: "send", convId: existing, toPerson: r.personId, newConvId, messages });
    const conv = existing ? world.conversations[existing] : null;
    const recipientMembers = conv?.kind === "group" ? conv.members.filter((m) => m !== ME) : [r.personId];
    const g = payload.privateGroup ? world.groups[payload.privateGroup] : null;
    log("share_sent", {
      via: "messenger", kind: payload.label, objectId: payload.objectId, convId: newConvId,
      recipient: r.personId ?? r.convId, recipientMembers, note: note.trim() || null,
      recipientCanOpen: g ? recipientMembers.every((m) => g.members.includes(m)) : true,
    });
    setSent((s) => ({ ...s, [r.key]: true }));
    toast(`Sent to ${r.personId ? person(world, r.personId).firstName : convTitle(world, conv)}`);
  };

  return (
    <div className="send-list">
      <div className="sheet-head">
        {onBack ? <button className="icon-button" onClick={onBack} aria-label="Back"><ChevronLeft size={20} /></button> : <span />}
        <strong>{req.type === "forward" ? "Forward" : "Send in Messenger"}</strong>
        <button className="icon-button" onClick={onDone} aria-label="Close"><X size={20} /></button>
      </div>
      {payload.privateGroup && (
        <p className="sheet-note"><Lock size={13} /> This post is in a private group. Only members of {world.groups[payload.privateGroup].name} can open it.</p>
      )}
      {req.type !== "forward" && (
        <input className="sheet-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Write a message (optional)…" aria-label="Write a message" />
      )}
      <label className="sheet-search"><Search size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people and groups" aria-label="Search people and groups" /></label>
      <div className="send-rows">
        {shown.map((r) => {
          const conv = r.convId ? world.conversations[r.convId] : null;
          const name = r.personId ? person(world, r.personId).name : convTitle(world, conv);
          return (
            <div className="send-row" key={r.key}>
              {r.personId ? <PersonAvatar id={r.personId} /> : <span className="avatar group-chat-avatar"><Users size={18} /></span>}
              <span className="send-name"><strong>{name}</strong>{conv && <small>{conv.members.length} members</small>}</span>
              <button className={sent[r.key] ? "send-btn sent" : "send-btn"} disabled={sent[r.key]} onClick={() => send(r)} aria-label={`Send to ${name}`}>
                {sent[r.key] ? <><Check size={15} /> Sent</> : "Send"}
              </button>
            </div>
          );
        })}
      </div>
      <button className="sheet-done" onClick={onDone}>Done</button>
    </div>
  );
}

function GroupShare({ postId, personId, onDone, onBack }) {
  const { world, dispatch, log, toast } = useSocial();
  const [groupId, setGroupId] = useState(null);
  const [text, setText] = useState("");
  const mine = Object.values(world.groups).filter((g) => g.members.includes(ME));
  const p = postId ? world.posts[postId] : null;
  const prof = personId ? person(world, personId) : null;
  if (!groupId)
    return (
      <div>
        <div className="sheet-head">
          <button className="icon-button" onClick={onBack} aria-label="Back"><ChevronLeft size={20} /></button>
          <strong>Share to a group</strong>
          <button className="icon-button" onClick={onDone} aria-label="Close"><X size={20} /></button>
        </div>
        <div className="send-rows">
          {mine.map((g) => (
            <button className="sheet-item" key={g.id} onClick={() => { setGroupId(g.id); log("share_group_selected", { objectId: postId ?? personId, groupId: g.id }); }}>
              <GroupIcon group={g} size={38} />
              <span><strong>{g.name}</strong><small>{g.privacy === "Public group" ? <Globe size={11} /> : <Lock size={11} />} {g.privacy} · {g.members.length} members</small></span>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      </div>
    );
  const g = world.groups[groupId];
  const publish = () => {
    const id = uid("post");
    dispatch({ type: "createPost", id, group: groupId, text: text.trim(), sharedPostId: postId, sharedProfileId: personId });
    log("shared_to_group", { kind: postId ? "post" : "profile", objectId: postId ?? personId, groupId, newPostId: id, text: text.trim() || null, sharedPostText: p?.text ?? null });
    toast(`Shared to ${g.name}`);
    onDone();
  };
  return (
    <div>
      <div className="sheet-head">
        <button className="icon-button" onClick={() => setGroupId(null)} aria-label="Back"><ChevronLeft size={20} /></button>
        <strong>Share to group</strong>
        <button className="primary-small" onClick={publish}>Post</button>
      </div>
      <div className="share-audience"><GroupIcon group={g} size={34} /><span><strong>{g.name}</strong><small>{g.privacy === "Public group" ? <><Globe size={11} /> Anyone can see this</> : <><Lock size={11} /> Only members will see this</>}</small></span></div>
      <textarea className="sheet-textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Say something about this…" aria-label="Say something about this" />
      {p && <div className="share-preview"><strong>{person(world, p.author).name}</strong><span>{p.text}</span></div>}
      {prof && <div className="share-preview"><strong>{prof.name}</strong><span>{prof.bio} · Profile on Connect</span></div>}
    </div>
  );
}

// Main share sheet router.
export function ShareSheet({ req, onClose }) {
  const { world, dispatch, log, toast } = useSocial();
  const [step, setStep] = useState(req.type === "forward" || req.direct ? "send" : "menu");

  const post = req.type === "post" ? world.posts[req.postId] : null;
  const group = post?.group ? world.groups[post.group] : null;
  const privateGroup = group?.privacy === "Private group";
  const url = req.type === "post" ? postUrl(req.postId) : req.type === "profile" ? profileUrl(req.personId) : req.url;

  const copy = async () => {
    await copyText(url);
    log("link_copied", { kind: req.type, objectId: req.postId ?? req.personId ?? url, url });
    toast("Link copied");
    onClose();
  };

  return (
    <Sheet onClose={onClose} className="share-sheet">
      {step === "send" && <SendList req={req} onDone={onClose} onBack={req.type === "forward" || req.direct ? null : () => setStep("menu")} />}
      {step === "group" && <GroupShare postId={req.postId} personId={req.type === "profile" ? req.personId : undefined} onDone={onClose} onBack={() => setStep("menu")} />}
      {step === "menu" && (
        <>
          <div className="sheet-head"><strong>{req.type === "profile" ? "Share profile" : req.type === "photo" ? "Photo" : "Share"}</strong>
            <button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
          {privateGroup && <p className="sheet-note"><Lock size={13} /> Posts in {group.name} can only be seen by its members.</p>}
          <SheetItem icon={MessageCircle} label="Send in Messenger" sub="Send privately to a person or chat" onClick={() => { setStep("send"); log("share_option", { option: "messenger", kind: req.type }); }} />
          {req.type === "profile" && (
            <SheetItem icon={Users} label="Share to a group" sub="Post this profile in one of your groups" onClick={() => { setStep("group"); log("share_option", { option: "group", kind: "profile", objectId: req.personId }); }} />
          )}
          {req.type === "post" && !privateGroup && (
            <>
              <SheetItem icon={Users} label="Share to a group" sub="Post in one of your groups" onClick={() => { setStep("group"); log("share_option", { option: "group", objectId: req.postId }); }} />
              <SheetItem icon={Globe} label="Share now (Public)" sub="Post to your profile" onClick={() => {
                const id = uid("post");
                dispatch({ type: "createPost", id, sharedPostId: req.postId, text: "" });
                log("shared_to_profile", { objectId: req.postId, newPostId: id });
                toast("Shared to your profile"); onClose();
              }} />
            </>
          )}
          {req.type === "photo" && (
            <SheetItem icon={Download} label="Save to phone" onClick={() => { dispatch({ type: "saveToGallery", photo: req.photo }); log("photo_saved", { objectId: req.photo.id }); toast("Saved to Photos"); onClose(); }} />
          )}
          {url && <SheetItem icon={Link2} label={req.type === "profile" ? "Copy link to profile" : "Copy link"} onClick={copy} />}
        </>
      )}
    </Sheet>
  );
}

// ---------------- Photo viewer ----------------
export function PhotoViewer({ photos, index, context, onClose }) {
  const { dispatch, log, toast, openSheet } = useSocial();
  const [i, setI] = useState(index);
  const p = photos[i];
  const go = (d) => { const n = (i + d + photos.length) % photos.length; setI(n); log("photo_viewed", { objectId: photos[n].id, ...context }); };
  return (
    <div className="viewer" role="dialog" aria-label="Photo viewer">
      <div className="viewer-top">
        <button className="icon-button" onClick={onClose} aria-label="Close photo"><X size={24} /></button>
        {photos.length > 1 && <span>{i + 1} of {photos.length}</span>}
        <span />
      </div>
      <div className="viewer-stage" onClick={onClose}>
        <img src={p.src} alt={p.alt} onClick={(e) => e.stopPropagation()} />
        {photos.length > 1 && (
          <>
            <button className="viewer-nav prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous photo"><ChevronLeft size={28} /></button>
            <button className="viewer-nav next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next photo"><ChevronRight size={28} /></button>
          </>
        )}
      </div>
      {(p.caption) && <div className="viewer-caption">{p.caption}</div>}
      <div className="viewer-actions">
        <button onClick={() => { dispatch({ type: "saveToGallery", photo: p }); log("photo_saved", { objectId: p.id, ...context }); toast("Saved to Photos"); }}><Download size={22} /><span>Save</span></button>
        <button onClick={() => { openSheet({ type: "photo", photo: p, direct: true }); log("photo_send_opened", { objectId: p.id, ...context }); }}><Send size={22} /><span>Send</span></button>
        <button onClick={() => openSheet({ type: "photo", photo: p })}><Share2 size={22} /><span>More</span></button>
      </div>
    </div>
  );
}

// ---------------- Device gallery picker ----------------
export function GalleryPicker({ onPick, onClose, multiple = true }) {
  const { world, log } = useSocial();
  const [sel, setSel] = useState([]);
  const toggle = (g) => setSel((s) => (s.includes(g.id) ? s.filter((x) => x !== g.id) : multiple ? [...s, g.id] : [g.id]));
  return (
    <div className="fullscreen-modal" role="dialog" aria-label="Choose photos">
      <div className="modal-head">
        <button className="icon-button" onClick={onClose} aria-label="Cancel"><X size={22} /></button>
        <strong>Photos</strong>
        <button className="primary-small" disabled={!sel.length} onClick={() => {
          const chosen = world.gallery.filter((g) => sel.includes(g.id)).map((g) => ({ id: uid("ph"), galleryId: g.id, src: g.src, alt: g.title, caption: undefined }));
          log("gallery_photos_selected", { galleryIds: sel, titles: world.gallery.filter((g) => sel.includes(g.id)).map((g) => g.title) });
          onPick(chosen);
        }}>Add{sel.length ? ` (${sel.length})` : ""}</button>
      </div>
      <p className="modal-sub">Recents</p>
      <div className="gallery-grid">
        {world.gallery.map((g) => {
          const n = sel.indexOf(g.id);
          return (
            <button key={g.id} className={n >= 0 ? "gallery-cell selected" : "gallery-cell"} onClick={() => toggle(g)} aria-pressed={n >= 0} aria-label={g.title}>
              <img src={g.src} alt={g.title} /><span className="gallery-name">{g.title}</span>
              <span className="gallery-check">{n >= 0 ? n + 1 : ""}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- Create / edit post ----------------
// Personal posts start with the Public audience selected (participants must
// choose Friends deliberately). Group posts can include a poll.
export function PostComposer({ groupId, editPostId, onClose }) {
  const { world, dispatch, log, toast } = useSocial();
  const editing = editPostId ? world.posts[editPostId] : null;
  const gid = editing ? editing.group : groupId;
  const g = gid ? world.groups[gid] : null;
  const [text, setText] = useState(editing?.text ?? "");
  const [photos, setPhotos] = useState([]);
  const [picking, setPicking] = useState(false);
  const [audience, setAudience] = useState(editing?.audience ?? "public");
  const [audSheet, setAudSheet] = useState(false);
  const [poll, setPoll] = useState(null); // { question, options: [..], multiple }

  const pollOk = !poll || (poll.question.trim() && poll.options.filter((o) => o.trim()).length >= 2);
  const canPost = editing ? text.trim() && text !== editing.text : (text.trim() || photos.length || poll) && pollOk;

  const publish = () => {
    if (editing) {
      dispatch({ type: "editPost", postId: editing.id, text: text.trim() });
      log("post_edited", { objectId: editing.id, previousText: editing.text, text: text.trim(), audience: editing.audience ?? null, groupId: editing.group ?? null });
      toast("Post updated");
      onClose();
      return;
    }
    const id = uid("post");
    const pollData = poll ? {
      question: poll.question.trim(), multiple: poll.multiple,
      options: poll.options.map((o) => o.trim()).filter(Boolean).map((t, i) => ({ id: `o${i + 1}`, text: t, votes: [] })),
    } : undefined;
    dispatch({ type: "createPost", id, group: gid, text: text.trim(), photos, audience: gid ? undefined : audience, poll: pollData });
    log("post_created", {
      objectId: id, groupId: gid ?? null, audience: gid ? `group:${gid}` : audience, text: text.trim(),
      photos: photos.map((p) => p.alt), galleryIds: photos.map((p) => p.galleryId),
      poll: pollData ? { question: pollData.question, options: pollData.options.map((o) => o.text), multiple: pollData.multiple } : null,
    });
    toast(g ? `Posted in ${g.name}` : "Posted");
    onClose();
  };

  const setOpt = (i, v) => setPoll((p) => ({ ...p, options: p.options.map((o, k) => (k === i ? v : o)) }));

  return (
    <div className="fullscreen-modal" role="dialog" aria-label={editing ? "Edit post" : "Create post"}>
      <div className="modal-head">
        <button className="icon-button" onClick={onClose} aria-label="Cancel"><X size={22} /></button>
        <strong>{editing ? "Edit post" : "Create post"}</strong>
        <button className="primary-small" disabled={!canPost} onClick={publish}>{editing ? "Save" : "Post"}</button>
      </div>
      <div className="composer-who">
        <PersonAvatar id={ME} />
        <span><strong>{person(world, ME).name}</strong>
          {g ? (
            <small className="audience-chip">{g.privacy === "Public group" ? <Globe size={11} /> : <Lock size={11} />} {g.name}</small>
          ) : editing ? (
            <small className="audience-chip">{audience === "friends" ? <Users size={11} /> : <Globe size={11} />} {audience === "friends" ? "Friends" : "Public"}</small>
          ) : (
            <button className="audience-chip button" onClick={() => { setAudSheet(true); log("audience_picker_opened", { current: audience }); }}>
              {audience === "friends" ? <Users size={11} /> : <Globe size={11} />} {audience === "friends" ? "Friends" : "Public"} ▾
            </button>
          )}
        </span>
      </div>
      <textarea className="composer-text" autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder={poll ? "Say something about your poll (optional)" : g ? "Write something…" : `What’s on your mind, ${person(world, ME).firstName}?`} aria-label="Post text" />
      {editing?.photos && <div className="composer-photos">{editing.photos.map((p) => <span key={p.id}><img src={p.src} alt={p.alt} /></span>)}</div>}
      {photos.length > 0 && (
        <div className="composer-photos">
          {photos.map((p) => (
            <span key={p.id}><img src={p.src} alt={p.alt} /><button aria-label={`Remove ${p.alt}`} onClick={() => setPhotos((x) => x.filter((y) => y.id !== p.id))}><X size={14} /></button></span>
          ))}
        </div>
      )}
      {poll && (
        <div className="poll-editor" aria-label="Poll">
          <div className="poll-editor-head"><strong>Poll</strong><button className="icon-button" aria-label="Remove poll" onClick={() => { setPoll(null); log("poll_removed"); }}><X size={18} /></button></div>
          <input className="sheet-input" value={poll.question} onChange={(e) => setPoll((p) => ({ ...p, question: e.target.value }))} placeholder="Ask a question…" aria-label="Poll question" />
          {poll.options.map((o, i) => (
            <div className="poll-editor-opt" key={i}>
              <input className="sheet-input" value={o} onChange={(e) => setOpt(i, e.target.value)} placeholder={`Option ${i + 1}`} aria-label={`Option ${i + 1}`} />
              {poll.options.length > 2 && <button className="icon-button" aria-label={`Remove option ${i + 1}`} onClick={() => setPoll((p) => ({ ...p, options: p.options.filter((_, k) => k !== i) }))}><X size={16} /></button>}
            </div>
          ))}
          <button className="link-button" onClick={() => setPoll((p) => ({ ...p, options: [...p.options, ""] }))}>+ Add option</button>
          <label className="toggle-row">
            <span><strong>Allow multiple answers</strong><small>People can choose more than one option</small></span>
            <input type="checkbox" role="switch" checked={poll.multiple} onChange={(e) => { setPoll((p) => ({ ...p, multiple: e.target.checked })); log("poll_multiple_toggled", { on: e.target.checked }); }} />
          </label>
        </div>
      )}
      {!editing && (
        <div className="composer-tools">
          <button className="composer-add" onClick={() => setPicking(true)}><ImageIcon size={22} color="#45bd62" /> Photo/video</button>
          {g && !poll && <button className="composer-add" onClick={() => { setPoll({ question: "", options: ["", ""], multiple: false }); log("poll_editor_opened", { groupId: gid }); }}><BarChart3 size={22} color="#f2b01e" /> Poll</button>}
        </div>
      )}
      {picking && <GalleryPicker onClose={() => setPicking(false)} onPick={(p) => { setPhotos((x) => [...x, ...p]); setPicking(false); }} />}
      {audSheet && (
        <Sheet title="Post audience" onClose={() => setAudSheet(false)}>
          <p className="sheet-note">Who can see your post?</p>
          {[{ id: "public", icon: Globe, label: "Public", sub: "Anyone on or off Connect" }, { id: "friends", icon: Users, label: "Friends", sub: "Your friends on Connect" }].map(({ id, icon: Icon, label, sub }) => (
            <button key={id} className="radio-row" role="radio" aria-checked={audience === id} onClick={() => { setAudience(id); log("audience_set", { audience: id }); setAudSheet(false); }}>
              <span className="sheet-item-icon"><Icon size={20} /></span><span><strong>{label}</strong><small>{sub}</small></span>
              <span className={audience === id ? "radio on" : "radio"} />
            </button>
          ))}
        </Sheet>
      )}
    </div>
  );
}
