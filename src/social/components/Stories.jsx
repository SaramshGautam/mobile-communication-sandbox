import { useEffect, useRef, useState } from "react";
import { X, Send, MapPin, Globe, Users, Settings2, Check, ChevronRight, ChevronLeft, Eye } from "lucide-react";
import { useSocial, PersonAvatar, Sheet } from "../ui.jsx";
import { person, friends, findDM, uid } from "../store.js";
import { ME } from "../world.js";

const ITEM_MS = 7000;
const STORY_REACTIONS = ["👍", "❤️", "😆", "😮", "😢", "😡"];

export function StoryItem({ item }) {
  if (item.kind === "photo")
    return (
      <div className="story-item photo">
        <img src={item.src} alt={item.alt ?? ""} />
        {item.text && <p className="story-caption">{item.text}</p>}
      </div>
    );
  return (
    <div className="story-item text" style={{ background: item.bg }}>
      {item.icon === "pin" && <MapPin size={44} />}
      <p>{item.text}</p>
    </div>
  );
}

// Full-screen story viewer. Tap the right side for the next item, left for the
// previous one. Items never expire; reopening a story replays it from the start.
export function StoryViewer({ storyId, onClose }) {
  const { world, dispatch, log, toast } = useSocial();
  const order = world.stories.map((s) => s.id);
  const [sid, setSid] = useState(storyId);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reply, setReply] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const story = world.stories.find((s) => s.id === sid);
  const item = story?.items[i];
  const mine = story?.author === ME;
  const t0 = useRef(Date.now());
  const acc = useRef(0);

  useEffect(() => { if (story) { dispatch({ type: "storyViewed", storyId: sid }); } }, [sid]); // eslint-disable-line
  useEffect(() => {
    if (!item) return;
    log("story_item_viewed", { storyId: sid, itemId: item.id, author: story.author, index: i + 1, of: story.items.length });
    acc.current = 0; t0.current = Date.now(); setElapsed(0);
  }, [sid, i]); // eslint-disable-line

  const go = (d, how) => {
    log("story_navigate", { storyId: sid, from: i + 1, direction: d > 0 ? "next" : "previous", how });
    if (i + d >= 0 && i + d < story.items.length) { setI(i + d); return; }
    const k = order.indexOf(sid) + (d > 0 ? 1 : -1);
    if (d < 0 && i === 0) { acc.current = 0; t0.current = Date.now(); setElapsed(0); return; }
    if (k < 0 || k >= order.length) { onClose(); return; }
    setSid(order[k]); setI(0);
  };

  useEffect(() => {
    if (paused || !item) return;
    t0.current = Date.now();
    const t = setInterval(() => {
      const e = acc.current + Date.now() - t0.current;
      setElapsed(e);
      if (e >= ITEM_MS) { clearInterval(t); go(1, "auto"); }
    }, 100);
    return () => { clearInterval(t); acc.current += Date.now() - t0.current; };
  }, [paused, sid, i]); // eslint-disable-line

  if (!story) return null;
  const author = person(world, story.author);

  const sendToAuthor = (msg, logType, extra) => {
    const dm = findDM(world, story.author);
    const id = uid("msg");
    dispatch({ type: "send", convId: dm?.id, toPerson: dm ? undefined : story.author, newConvId: uid("conv"), messages: [{ id, storyRef: { storyId: sid, itemId: item.id, text: item.text, src: item.src, bg: item.bg, author: story.author }, ...msg }] });
    log(logType, { storyId: sid, itemId: item.id, author: story.author, msgId: id, ...extra });
  };
  const react = (emoji) => {
    sendToAuthor({ reaction: emoji }, "story_reaction_sent", { reaction: emoji });
    toast(`Reaction sent to ${author.firstName}`);
  };
  const submit = (e) => {
    e.preventDefault();
    const v = reply.trim();
    if (!v) return;
    sendToAuthor({ text: v }, "story_reply_sent", { text: v });
    setReply(""); setPaused(false);
    toast(`Reply sent to ${author.firstName}`);
  };

  return (
    <div className="story-viewer" role="dialog" aria-label={`${author.name}’s story`}>
      <div className="story-bars">
        {story.items.map((it, k) => (
          <span key={it.id}><i style={{ width: k < i ? "100%" : k === i ? `${Math.min(100, (elapsed / ITEM_MS) * 100)}%` : "0%" }} /></span>
        ))}
      </div>
      <div className="story-top">
        <PersonAvatar id={story.author} size="sm" />
        <span><strong>{mine ? "Your story" : author.name}</strong><small>{story.time}{mine && story.audience ? ` · ${audienceLabel(world, story)}` : ""}</small></span>
        <button className="icon-button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play" : "Pause"}>{paused ? "▶" : "❚❚"}</button>
        <button className="icon-button" onClick={() => { log("story_closed", { storyId: sid, itemId: item.id }); onClose(); }} aria-label="Close story"><X size={26} /></button>
      </div>
      <div className="story-stage">
        <StoryItem item={item} />
        <button className="story-tap prev" aria-label="Previous" onClick={() => go(-1, "tap")}><ChevronLeft size={30} /></button>
        <button className="story-tap next" aria-label="Next" onClick={() => go(1, "tap")}><ChevronRight size={30} /></button>
      </div>
      {mine ? (
        <div className="story-bottom mine"><Eye size={18} /> Shared with: {audienceLabel(world, story)}</div>
      ) : (
        <div className="story-bottom">
          <form className="story-reply" onSubmit={submit}>
            <input value={reply} onFocus={() => setPaused(true)} onBlur={() => !reply && setPaused(false)} onChange={(e) => setReply(e.target.value)} placeholder={`Reply to ${author.firstName}…`} aria-label={`Reply to ${author.firstName}`} />
            {reply.trim() && <button type="submit" className="icon-button" aria-label="Send reply"><Send size={20} /></button>}
          </form>
          <div className="story-reactions" aria-label="React to story">
            {STORY_REACTIONS.map((em) => <button key={em} onClick={() => react(em)} aria-label={`React ${em}`}>{em}</button>)}
          </div>
        </div>
      )}
    </div>
  );
}

function audienceLabel(world, story) {
  if (story.audience === "custom") return (story.customAudience ?? []).map((id) => person(world, id).firstName).join(", ") || "Custom";
  return story.audience === "public" ? "Public" : "Friends";
}

// Create a photo story from the study phone's gallery. Audience defaults to Friends.
export function StoryCreator({ onClose }) {
  const { world, dispatch, log, toast } = useSocial();
  const [pick, setPick] = useState(null);
  const [audience, setAudience] = useState("friends");
  const [custom, setCustom] = useState([]);
  const [sheet, setSheet] = useState(null); // "audience" | "custom"
  const [draftCustom, setDraftCustom] = useState([]);
  const share = () => {
    const id = uid("story");
    const items = [{ id: uid("si"), kind: "photo", src: pick.src, alt: pick.title, galleryId: pick.id }];
    dispatch({ type: "createStory", id, audience, customAudience: audience === "custom" ? custom : undefined, items });
    log("story_created", { storyId: id, galleryId: pick.id, photo: pick.title, audience, customAudience: audience === "custom" ? custom : null, customNames: audience === "custom" ? custom.map((x) => person(world, x).name) : null });
    toast("Your story was shared");
    onClose();
  };

  if (!pick)
    return (
      <div className="fullscreen-modal" role="dialog" aria-label="Create story">
        <div className="modal-head">
          <button className="icon-button" onClick={onClose} aria-label="Close"><X size={22} /></button>
          <strong>Create story</strong><span />
        </div>
        <p className="modal-sub">Choose a photo from your phone</p>
        <div className="gallery-grid">
          {world.gallery.map((g) => (
            <button key={g.id} className="gallery-cell" onClick={() => { setPick(g); log("story_photo_selected", { galleryId: g.id, photo: g.title }); }} aria-label={g.title}>
              <img src={g.src} alt={g.title} /><span className="gallery-name">{g.title}</span>
            </button>
          ))}
        </div>
      </div>
    );

  const label = audience === "custom" ? `Custom (${custom.length})` : audience === "public" ? "Public" : "Friends";
  return (
    <div className="story-viewer creator" role="dialog" aria-label="Story preview">
      <div className="story-top">
        <button className="icon-button" onClick={() => setPick(null)} aria-label="Back"><ChevronLeft size={26} /></button>
        <span><strong>Preview</strong></span>
        <button className="audience-btn" onClick={() => { setSheet("audience"); log("story_audience_opened", { current: audience }); }}><Settings2 size={16} /> Audience: {label}</button>
      </div>
      <div className="story-stage"><StoryItem item={{ kind: "photo", src: pick.src, alt: pick.title }} /></div>
      <div className="story-bottom">
        <button className="btn primary wide" onClick={share}>Share to story</button>
      </div>
      {sheet === "audience" && (
        <Sheet title="Story audience" onClose={() => setSheet(null)}>
          <p className="sheet-note">Who can see your story?</p>
          {[
            { id: "public", icon: Globe, label: "Public", sub: "Anyone on or off the Social Media Prototype" },
            { id: "friends", icon: Users, label: "Friends", sub: "Your friends on the Social Media Prototype" },
            { id: "custom", icon: Settings2, label: "Custom", sub: custom.length ? custom.map((x) => person(world, x).firstName).join(", ") : "Choose specific friends" },
          ].map(({ id, icon: Icon, label: l, sub }) => (
            <button key={id} className="radio-row" role="radio" aria-checked={audience === id} onClick={() => {
              if (id === "custom") { setDraftCustom(custom); setSheet("custom"); return; }
              setAudience(id); log("story_audience_set", { audience: id }); setSheet(null);
            }}>
              <span className="sheet-item-icon"><Icon size={20} /></span>
              <span><strong>{l}</strong><small>{sub}</small></span>
              <span className={audience === id ? "radio on" : "radio"} />
            </button>
          ))}
        </Sheet>
      )}
      {sheet === "custom" && (
        <Sheet title="Custom audience" onClose={() => setSheet("audience")} className="tall">
          <p className="sheet-note">Only the friends you select will see your story.</p>
          <div className="send-rows">
            {friends(world).map((p) => {
              const on = draftCustom.includes(p.id);
              return (
                <button key={p.id} className="check-row" aria-pressed={on} onClick={() => setDraftCustom((s) => (on ? s.filter((x) => x !== p.id) : [...s, p.id]))}>
                  <PersonAvatar id={p.id} /><span className="send-name"><strong>{p.name}</strong></span>
                  <span className={on ? "checkbox on" : "checkbox"}>{on && <Check size={15} />}</span>
                </button>
              );
            })}
          </div>
          <button className="sheet-done primary" disabled={!draftCustom.length} onClick={() => {
            setCustom(draftCustom); setAudience("custom");
            log("story_audience_set", { audience: "custom", customAudience: draftCustom, customNames: draftCustom.map((x) => person(world, x).name) });
            setSheet(null);
          }}>Done{draftCustom.length ? ` (${draftCustom.length} selected)` : ""}</button>
        </Sheet>
      )}
    </div>
  );
}
