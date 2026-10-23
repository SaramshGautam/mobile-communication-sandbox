import { useState } from "react";
import { CalendarDays, MapPin, Check, Star, X, Users, UserPlus, Lock, Globe, HelpCircle, Megaphone } from "lucide-react";
import { useSocial, PersonAvatar, Sheet } from "../ui.jsx";
import { PageHeader } from "./Pages.jsx";
import { person, friends } from "../store.js";

// ---------------- Friend requests ----------------
export function RequestButtons({ request, compact }) {
  const { world, dispatch, log, toast } = useSocial();
  const p = person(world, request.from);
  if (request.status === "accepted") return <span className="request-done"><Check size={15} /> Request accepted. You’re now friends.</span>;
  if (request.status === "deleted") return <span className="request-done">Request removed</span>;
  const respond = (accept) => {
    dispatch({ type: "respondRequest", requestId: request.id, accept });
    log(accept ? "friend_request_accepted" : "friend_request_deleted", { requestId: request.id, objectId: p.id, name: p.name, bio: p.bio });
    toast(accept ? `You and ${p.firstName} are now friends` : "Request deleted");
  };
  return (
    <span className={compact ? "request-buttons compact" : "request-buttons"}>
      <button className="btn primary" onClick={() => respond(true)}>Confirm</button>
      <button className="btn secondary" onClick={() => respond(false)}>Delete</button>
    </span>
  );
}

export function FriendsPage() {
  const { world, nav, log } = useSocial();
  const pending = world.friendRequests;
  const mine = friends(world);
  return (
    <div>
      <PageHeader title="Friends" />
      <div className="page-pad">
        <h3 className="section-label">Friend requests <span className="count">{pending.filter((r) => !r.status).length}</span></h3>
        <div className="list-card">
          {pending.length === 0 && <div className="empty">No new requests.</div>}
          {pending.map((r) => {
            const p = person(world, r.from);
            return (
              <div key={r.id} className="request-row">
                <button className="avatar-btn" onClick={() => { log("friend_request_profile_opened", { requestId: r.id, objectId: p.id }); nav.push({ name: "profile", personId: p.id }); }}><PersonAvatar id={p.id} size="lg" /></button>
                <div className="request-copy">
                  <button className="name-link" onClick={() => { log("friend_request_profile_opened", { requestId: r.id, objectId: p.id }); nav.push({ name: "profile", personId: p.id }); }}>{p.name}</button>
                  <small>{p.bio}{r.mutual ? ` · ${r.mutual} mutual friend` : ""} · {r.time}</small>
                  <RequestButtons request={r} compact />
                </div>
              </div>
            );
          })}
        </div>
        <h3 className="section-label">All friends <span className="count">{mine.length}</span></h3>
        <div className="list-card">
          {mine.map((p) => (
            <button key={p.id} className="list-row" onClick={() => nav.push({ name: "profile", personId: p.id })}>
              <PersonAvatar id={p.id} /><span><strong>{p.name}</strong>{p.bio && <small>{p.bio}</small>}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- Events ----------------
const RSVP = [
  { id: "going", label: "Going", icon: Check },
  { id: "maybe", label: "Maybe", icon: Star },
  { id: "cant", label: "Can’t go", icon: X },
];

function EventRow({ ev }) {
  const { world, nav, log } = useSocial();
  return (
    <button className="event-row" onClick={() => { log("event_opened", { eventId: ev.id }); nav.push({ name: "event", eventId: ev.id }); }}>
      <img src={ev.cover} alt="" />
      <span>
        <small className="event-when">{ev.dateLabel.toUpperCase()} AT {ev.time.toUpperCase()}</small>
        <strong>{ev.title}</strong>
        <small>{ev.place} · Hosted by {person(world, ev.host).name}</small>
        {ev.myRsvp && <small className="event-mine">You: {RSVP.find((r) => r.id === ev.myRsvp).label}</small>}
      </span>
    </button>
  );
}

export function EventsPage() {
  const { world } = useSocial();
  const all = Object.values(world.events);
  const invites = all.filter((e) => e.invitedYou && !e.myRsvp);
  const others = all.filter((e) => !(e.invitedYou && !e.myRsvp));
  return (
    <div>
      <PageHeader title="Events" />
      <div className="page-pad">
        <h3 className="section-label">Invitations <span className="count">{invites.length}</span></h3>
        <div className="list-card">
          {invites.length === 0 && <div className="empty">No pending invitations.</div>}
          {invites.map((e) => <EventRow key={e.id} ev={e} />)}
        </div>
        <h3 className="section-label">Upcoming events</h3>
        <div className="list-card">{others.map((e) => <EventRow key={e.id} ev={e} />)}</div>
      </div>
    </div>
  );
}

function InviteSheet({ ev, onClose }) {
  const { world, dispatch, log, toast } = useSocial();
  const [sel, setSel] = useState([]);
  const [q, setQ] = useState("");
  const list = friends(world).filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  const status = (id) => (ev.going.includes(id) ? "Going" : ev.maybe.includes(id) ? "Maybe" : ev.invited.includes(id) ? "Invited" : null);
  const send = () => {
    dispatch({ type: "inviteToEvent", eventId: ev.id, personIds: sel });
    log("event_invites_sent", { eventId: ev.id, personIds: sel, names: sel.map((id) => person(world, id).name) });
    toast(`Invitation sent to ${sel.map((id) => person(world, id).firstName).join(", ")}`);
    onClose();
  };
  return (
    <Sheet title="Invite friends" onClose={onClose} className="tall">
      <label className="sheet-search"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search friends" aria-label="Search friends" /></label>
      <div className="send-rows">
        {list.map((p) => {
          const st = status(p.id);
          const on = sel.includes(p.id);
          return (
            <button key={p.id} className="check-row" disabled={!!st} aria-pressed={on} onClick={() => setSel((s) => (on ? s.filter((x) => x !== p.id) : [...s, p.id]))}>
              <PersonAvatar id={p.id} /><span className="send-name"><strong>{p.name}</strong>{st && <small>{st}</small>}</span>
              <span className={on ? "checkbox on" : "checkbox"}>{on || st ? <Check size={15} /> : null}</span>
            </button>
          );
        })}
      </div>
      <button className="sheet-done primary" disabled={!sel.length} onClick={send}>Send invitation{sel.length > 1 ? "s" : ""}{sel.length ? ` (${sel.length})` : ""}</button>
    </Sheet>
  );
}

export function EventPage({ route }) {
  const { world, dispatch, log, nav, toast } = useSocial();
  const ev = world.events[route.eventId];
  const [inviting, setInviting] = useState(false);
  const [tab, setTab] = useState("About");
  const setRsvp = (id) => {
    const value = ev.myRsvp === id ? null : id;
    dispatch({ type: "rsvp", eventId: ev.id, rsvp: value });
    log("event_rsvp", { eventId: ev.id, rsvp: value, previous: ev.myRsvp });
    if (value) toast(`You responded: ${RSVP.find((r) => r.id === value).label}`);
  };
  const host = person(world, ev.host);
  return (
    <div className="event-page">
      <PageHeader title="Event" />
      <img className="event-cover" src={ev.cover} alt="" />
      <div className="event-head">
        <small className="event-when">{ev.dateLabel.toUpperCase()} AT {ev.time.toUpperCase()}</small>
        <h2>{ev.title}</h2>
        <p className="muted"><MapPin size={14} /> {ev.place}</p>
        <p className="muted">{ev.privacy.startsWith("Public") ? <Globe size={14} /> : <Lock size={14} />} {ev.privacy}</p>
        <button className="event-host" onClick={() => nav.push({ name: "profile", personId: host.id })}><PersonAvatar id={host.id} size="xs" /> Hosted by <strong>{host.name}</strong></button>
        {ev.invitedYou && !ev.myRsvp && <p className="event-invited"><Megaphone size={14} /> {host.firstName} invited you</p>}
        <div className="rsvp-row" role="radiogroup" aria-label="Your response">
          {RSVP.map(({ id, label, icon: Icon }) => (
            <button key={id} role="radio" aria-checked={ev.myRsvp === id} className={ev.myRsvp === id ? "rsvp active" : "rsvp"} onClick={() => setRsvp(id)}>
              <Icon size={17} /> {label}
            </button>
          ))}
        </div>
        {ev.guestsCanInvite && (
          <button className="btn secondary wide" onClick={() => { setInviting(true); log("event_invite_opened", { eventId: ev.id }); }}><UserPlus size={16} /> Invite</button>
        )}
      </div>
      <div className="tabs" role="tablist">
        {["About", "Discussion"].map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "tab active" : "tab"} onClick={() => { setTab(t); log("event_tab", { eventId: ev.id, tab: t }); }}>{t}{t === "Discussion" && ev.updates.length ? ` (${ev.updates.length})` : ""}</button>
        ))}
      </div>
      {tab === "About" && (
        <div className="about-card">
          <h3>Details</h3>
          <p><CalendarDays size={14} /> {ev.dateLabel} at {ev.time}</p>
          <p>{ev.description}</p>
          <p className="muted"><Users size={14} /> {ev.going.length + (ev.myRsvp === "going" ? 1 : 0)} going · {ev.maybe.length + (ev.myRsvp === "maybe" ? 1 : 0)} maybe · {ev.invited.length} invited</p>
          {ev.updates.length > 0 && (
            <button className="link-button" onClick={() => setTab("Discussion")}><HelpCircle size={14} /> {ev.updates.length} update from the host — see Discussion</button>
          )}
        </div>
      )}
      {tab === "Discussion" && (
        <div>
          {ev.updates.length === 0 && <div className="empty">No posts yet.</div>}
          {ev.updates.map((u) => (
            <article key={u.id} className="post-card">
              <div className="post-head">
                <PersonAvatar id={u.author} />
                <div className="post-head-copy"><span className="post-head-names"><strong>{person(world, u.author).name}</strong> <span className="muted">· Host</span></span><small>{u.time}</small></div>
              </div>
              <p className="post-text">{u.text}</p>
            </article>
          ))}
        </div>
      )}
      {inviting && <InviteSheet ev={ev} onClose={() => setInviting(false)} />}
    </div>
  );
}
