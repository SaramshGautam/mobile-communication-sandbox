import { useMemo, useState } from "react";
import {
  ChevronLeft, Search, Lock, Image as ImageIcon, MessageCircle, MoreHorizontal, Link2, Share2, UserCheck,
  Bookmark, Users, FileText, MapPin, Navigation, Settings, ClipboardList, Bell, Star, Check, Plus,
} from "lucide-react";
import { useSocial, PersonAvatar, GroupIcon, Sheet, SheetItem, copyText, useFlashScroll } from "../ui.jsx";
import PostCard from "./Post.jsx";
import { person, canSee, countComments, profileUrl, findDM, uid } from "../store.js";
import { ME } from "../world.js";

export function PageHeader({ title, sub, right, onBack }) {
  const { nav } = useSocial();
  return (
    <div className="page-head">
      <button className="icon-button" onClick={onBack ?? nav.back} aria-label="Back"><ChevronLeft size={24} /></button>
      <span className="page-title"><strong>{title}</strong>{sub && <small>{sub}</small>}</span>
      <span className="page-right">{right}</span>
    </div>
  );
}

function ComposerPrompt({ groupId, placeholder }) {
  const { openComposer, log } = useSocial();
  return (
    <div className="composer-prompt">
      <PersonAvatar id={ME} />
      <button onClick={() => { openComposer(groupId); log("composer_opened", { groupId: groupId ?? null }); }}>{placeholder}</button>
      <button className="icon-button" aria-label="Add photo" onClick={() => openComposer(groupId)}><ImageIcon size={22} color="#45bd62" /></button>
    </div>
  );
}

// ---------------- Home ----------------
export function HomeFeed({ route }) {
  const { world, nav } = useSocial();
  const feed = world.postOrder.map((id) => world.posts[id]).filter((p) => p.inFeed != null && canSee(world, p))
    .sort((a, b) => a.inFeed - b.inFeed);
  const people = ["anna", "adam", "susan", "sam", "lee", "pat", "maya", "nora", "elena", "rosa"];
  useFlashScroll(route.focusPostId, [], { flash: !route.quiet, block: "start" });
  return (
    <div className="feed">
      <ComposerPrompt placeholder={`What’s on your mind, ${person(world, ME).firstName}?`} />
      <div className="stories" aria-label="People">
        {people.map((id) => (
          <button key={id} className="story" onClick={() => nav.push({ name: "profile", personId: id })}>
            <PersonAvatar id={id} size="story" /><span>{person(world, id).firstName}</span>
          </button>
        ))}
      </div>
      {feed.map((p) => <PostCard key={p.id} post={p} />)}
      <p className="end-note">You’re all caught up.</p>
    </div>
  );
}

// ---------------- Groups ----------------
export function GroupsList() {
  const { world, nav } = useSocial();
  const mine = Object.values(world.groups).filter((g) => g.members.includes(ME));
  return (
    <div className="page-pad">
      <h2 className="page-h2">Your groups</h2>
      <div className="list-card">
        {mine.map((g) => (
          <button key={g.id} className="list-row" onClick={() => nav.push({ name: "group", groupId: g.id })}>
            <GroupIcon group={g} size={44} />
            <span><strong>{g.name}</strong><small><Lock size={11} /> {g.privacy} · {g.members.length} members</small></span>
          </button>
        ))}
      </div>
    </div>
  );
}

const GROUP_TABS = ["Discussion", "Featured", "Files", "Members", "About"];

export function GroupPage({ route }) {
  const { world, nav, log } = useSocial();
  const g = world.groups[route.groupId];
  const [tab, setTab] = useState(route.tab ?? "Discussion");
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState("");
  const member = g.members.includes(ME);
  const groupPosts = world.postOrder.map((id) => world.posts[id]).filter((p) => p.group === g.id);
  const featured = (g.featured ?? []).map((id) => world.posts[id]);
  const files = groupPosts.flatMap((p) => [
    ...(p.files ?? []).map((docId) => ({ docId, post: p })),
    ...(p.links ?? []).filter((l) => l.kind === "pdf").map((l) => ({ docId: l.docId, post: p })),
  ]);
  const results = q.trim()
    ? groupPosts.filter((p) => [p.text, ...(p.comments ?? []).flatMap((c) => [c.text, ...(c.replies ?? []).map((r) => r.text)])].join(" ").toLowerCase().includes(q.toLowerCase()))
    : [];
  useFlashScroll(route.focusPostId, [tab], { flash: !route.quiet, block: "start" });

  if (!member)
    return (
      <div>
        <PageHeader title={g.name} />
        <div className="empty"><Lock /> This is a private group. Only members can see posts.</div>
      </div>
    );

  return (
    <div className="group-page">
      <PageHeader title={g.name} right={<button className="icon-button" aria-label="Search this group" onClick={() => { setSearching((v) => !v); log("group_search_opened", { groupId: g.id }); }}><Search size={21} /></button>} />
      {searching && (
        <div className="inline-search">
          <label className="search-field"><Search size={16} /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${g.name}`} aria-label={`Search ${g.name}`} onKeyDown={(e) => e.key === "Enter" && log("group_search", { groupId: g.id, q })} /></label>
          {q.trim() && <p className="search-count">{results.length} result{results.length === 1 ? "" : "s"}</p>}
          {results.map((p) => <PostCard key={p.id} post={p} anchor={`search-${p.id}`} />)}
        </div>
      )}
      {!searching && (
        <>
          <div className="group-cover" style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color}bb)` }}>
            <h2>{g.name}</h2>
            <small><Lock size={12} /> {g.privacy} · {g.members.length} members</small>
            <div className="member-stack">{g.members.slice(0, 5).map((id) => <PersonAvatar key={id} id={id} size="xs" />)}</div>
            <div className="group-buttons"><span className="joined"><UserCheck size={15} /> Joined</span><span className="joined ghost"><Plus size={15} /> Invite</span></div>
          </div>
          <div className="tabs" role="tablist">
            {GROUP_TABS.map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "tab active" : "tab"} onClick={() => { setTab(t); log("group_tab", { groupId: g.id, tab: t }); }}>{t}</button>
            ))}
          </div>
          {tab === "Discussion" && (
            <>
              <ComposerPrompt groupId={g.id} placeholder="Write something…" />
              {featured.length > 0 && (
                <button className="featured-teaser" onClick={() => setTab("Featured")}><Star size={16} /> Featured · {featured.length} post{featured.length > 1 ? "s" : ""} from admins</button>
              )}
              {groupPosts.map((p) => (
                <PostCard key={p.id} post={p} expandComments={route.expandComments && route.focusPostId === p.id} expandReplies={route.focusPostId === p.id ? route.expandReplies : undefined} />
              ))}
            </>
          )}
          {tab === "Featured" && (
            featured.length ? featured.map((p) => <PostCard key={p.id} post={p} anchor={`featured-${p.id}`} />) : <div className="empty">No featured posts yet.</div>
          )}
          {tab === "Files" && (
            <div className="list-card">
              {files.length === 0 && <div className="empty">No files yet.</div>}
              {files.map(({ docId, post }) => {
                const d = world.documents[docId];
                return (
                  <button key={docId + post.id} className="list-row" onClick={() => { log("file_opened", { objectId: docId, from: "group_files" }); nav.push({ name: "pdf", docId }); }}>
                    <span className="link-icon pdf"><FileText size={22} /></span>
                    <span><strong>{d.filename}</strong><small>Shared by {person(world, post.author).name} · {post.time}</small></span>
                  </button>
                );
              })}
            </div>
          )}
          {tab === "Members" && (
            <div className="list-card">
              {g.members.map((id) => (
                <button key={id} className="list-row" onClick={() => nav.push({ name: "profile", personId: id })}>
                  <PersonAvatar id={id} />
                  <span><strong>{person(world, id).name}{id === ME ? " (you)" : ""}</strong><small>{g.admins.includes(id) ? "Admin" : "Member"}</small></span>
                </button>
              ))}
            </div>
          )}
          {tab === "About" && (
            <div className="about-card">
              <h3>About this group</h3>
              <p>{g.description}</p>
              <p className="muted"><Lock size={13} /> {g.privacy} — only members can see who’s in the group and what they post.</p>
              <h3>Admins</h3>
              {g.admins.map((id) => (
                <button key={id} className="list-row" onClick={() => nav.push({ name: "profile", personId: id })}>
                  <PersonAvatar id={id} /><span><strong>{person(world, id).name}</strong><small>Admin</small></span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ---------------- Post detail ----------------
export function PostDetail({ route }) {
  const { world } = useSocial();
  const p = world.posts[route.postId];
  useFlashScroll(route.focusCommentId, [], { flash: !route.quiet });
  if (!p) return <div><PageHeader title="Post" /><div className="empty">This content isn’t available.</div></div>;
  const owner = person(world, p.author);
  return (
    <div>
      <PageHeader title={`${owner.firstName}’s post`} sub={p.group ? world.groups[p.group].name : undefined} />
      <PostCard post={p} detail highlightComment={route.focusCommentId} expandReplies={route.expandReplies} />
    </div>
  );
}

// ---------------- Profile ----------------
export function ProfilePage({ route }) {
  const { world, nav, log, openSheet, toast } = useSocial();
  const p = person(world, route.personId);
  const [menu, setMenu] = useState(false);
  const [following, setFollowing] = useState(false);
  const isMe = p.id === ME;
  const posts = world.postOrder.map((id) => world.posts[id]).filter((x) => x.author === p.id && !x.group && (isMe || x.audience));
  const message = () => {
    const dm = findDM(world, p.id);
    log("profile_message", { objectId: p.id });
    nav.push({ name: "chat", convId: dm?.id, personId: p.id });
  };
  return (
    <div className="profile-page">
      <PageHeader title={p.name} right={<button className="icon-button" aria-label="Search" onClick={() => nav.push({ name: "search" })}><Search size={21} /></button>} />
      <div className="profile-cover" />
      <div className="profile-id">
        <PersonAvatar id={p.id} size="xl" />
        <h2>{p.name}</h2>
        {p.bio && <p>{p.bio}</p>}
        {!isMe && (
          <div className="profile-buttons">
            {p.isPage ? (
              <button className={following ? "btn secondary" : "btn primary"} onClick={() => { setFollowing((v) => !v); log(following ? "unfollowed" : "followed", { objectId: p.id }); }}>
                {following ? <><Check size={16} /> Following</> : "Follow"}
              </button>
            ) : (
              <button className="btn secondary"><UserCheck size={16} /> Friends</button>
            )}
            <button className="btn primary" onClick={message}><MessageCircle size={16} /> Message</button>
            <button className="btn secondary icon-only" aria-label="More profile options" onClick={() => { setMenu(true); log("profile_menu_opened", { objectId: p.id }); }}><MoreHorizontal size={18} /></button>
          </div>
        )}
      </div>
      <h3 className="section-label">Posts</h3>
      {posts.length === 0 && <div className="empty">No posts to show.</div>}
      {posts.map((x) => <PostCard key={x.id} post={x} />)}
      {menu && (
        <Sheet onClose={() => setMenu(false)}>
          <SheetItem icon={Link2} label="Copy link to profile" onClick={async () => { await copyText(profileUrl(p.id)); log("profile_link_copied", { objectId: p.id, url: profileUrl(p.id) }); toast("Link copied"); setMenu(false); }} />
          <SheetItem icon={Share2} label="Share profile" sub="Send this profile in Messenger" onClick={() => { setMenu(false); openSheet({ type: "profile", personId: p.id }); log("profile_share_opened", { objectId: p.id }); }} />
        </Sheet>
      )}
    </div>
  );
}

// ---------------- Search ----------------
export function SearchPage({ route }) {
  const { world, nav, log } = useSocial();
  const [q, setQ] = useState(route.q ?? "");
  const term = q.trim().toLowerCase();
  const res = useMemo(() => {
    if (!term) return null;
    const t = term.replace(/^#/, "");
    return {
      people: Object.values(world.people).filter((p) => p.id !== ME && p.name.toLowerCase().includes(t)),
      groups: Object.values(world.groups).filter((g) => g.members.includes(ME) && g.name.toLowerCase().includes(t)),
      posts: world.postOrder.map((id) => world.posts[id]).filter((p) => canSee(world, p) && (p.text ?? "").toLowerCase().includes(term)),
    };
  }, [term, world]);
  return (
    <div>
      <div className="page-head search-head">
        <button className="icon-button" onClick={nav.back} aria-label="Back"><ChevronLeft size={24} /></button>
        <label className="search-field grow"><Search size={16} />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Connect" aria-label="Search Connect"
            onKeyDown={(e) => e.key === "Enter" && log("search", { q })} onBlur={() => q && log("search", { q })} />
        </label>
      </div>
      {!res && <div className="empty">Search for people, groups, posts and #topics.</div>}
      {res && (
        <div className="search-results">
          {res.people.length > 0 && <h3 className="section-label">People</h3>}
          {res.people.map((p) => (
            <button key={p.id} className="list-row card-row" onClick={() => { log("search_result_opened", { q, kind: "person", objectId: p.id }); nav.push({ name: "profile", personId: p.id }); }}>
              <PersonAvatar id={p.id} /><span><strong>{p.name}</strong><small>{p.isPage ? "Page" : p.relationship === "friend" || p.relationship === "neighbor" ? "Friend" : p.relationship}</small></span>
            </button>
          ))}
          {res.groups.length > 0 && <h3 className="section-label">Groups</h3>}
          {res.groups.map((g) => (
            <button key={g.id} className="list-row card-row" onClick={() => { log("search_result_opened", { q, kind: "group", objectId: g.id }); nav.push({ name: "group", groupId: g.id }); }}>
              <GroupIcon group={g} /><span><strong>{g.name}</strong><small><Lock size={11} /> {g.privacy}</small></span>
            </button>
          ))}
          {res.posts.length > 0 && <h3 className="section-label">Posts</h3>}
          {res.posts.map((p) => <PostCard key={p.id} post={p} anchor={`sr-${p.id}`} />)}
          {!res.people.length && !res.groups.length && !res.posts.length && <div className="empty">No results for “{q}”.</div>}
        </div>
      )}
    </div>
  );
}

// ---------------- Notifications ----------------
export function NotificationsPage() {
  const { world, nav, dispatch, log } = useSocial();
  return (
    <div className="page-pad">
      <h2 className="page-h2">Notifications</h2>
      <div className="list-card">
        {world.notifications.map((n) => (
          <button key={n.id} className={n.unread ? "notif unread" : "notif"} onClick={() => {
            dispatch({ type: "readNotification", id: n.id });
            log("notification_opened", { objectId: n.id, postId: n.postId, commentId: n.commentId });
            if (n.postId) nav.push({ name: "post", postId: n.postId, focusCommentId: n.commentId });
            else if (n.profileId) nav.push({ name: "profile", personId: n.profileId });
          }}>
            <PersonAvatar id={n.actor} />
            <span><span><strong>{person(world, n.actor).name}</strong> {n.text}</span><small>{n.time}</small></span>
            {n.unread && <i className="unread-dot" aria-label="Unread" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------- Menu & saved ----------------
export function MenuPage() {
  const { world, nav, openTasks } = useSocial();
  return (
    <div className="page-pad">
      <h2 className="page-h2">Menu</h2>
      <button className="list-row card-row" onClick={() => nav.push({ name: "profile", personId: ME })}>
        <PersonAvatar id={ME} /><span><strong>{person(world, ME).name}</strong><small>See your profile</small></span>
      </button>
      <div className="menu-grid">
        <button onClick={() => nav.push({ name: "saved" })}><Bookmark color="#8b4fc7" /><strong>Saved</strong></button>
        <button onClick={() => nav.tab("groups")}><Users color="#1b74e4" /><strong>Groups</strong></button>
        <button onClick={() => nav.tab("messages")}><MessageCircle color="#1b74e4" /><strong>Messages</strong></button>
        <button onClick={() => nav.tab("notifications")}><Bell color="#e8364f" /><strong>Notifications</strong></button>
      </div>
      <div className="list-card">
        <button className="list-row"><Settings size={22} /><span><strong>Settings &amp; privacy</strong></span></button>
        <button className="list-row" onClick={openTasks}><ClipboardList size={22} /><span><strong>Study tasks</strong><small>For researchers</small></span></button>
      </div>
    </div>
  );
}

export function SavedPage() {
  const { world, nav, log } = useSocial();
  return (
    <div>
      <PageHeader title="Saved" />
      <div className="page-pad">
        <h3 className="section-label">All saved items</h3>
        <div className="list-card">
          {world.saved.length === 0 && <div className="empty">Nothing saved yet.</div>}
          {world.saved.map((id) => {
            const p = world.posts[id];
            const thumb = p.photos?.[0];
            return (
              <button key={id} className="saved-row" onClick={() => { log("saved_item_opened", { objectId: id }); nav.push({ name: "post", postId: id }); }}>
                {thumb ? <img src={thumb.src} alt="" /> : <span className="saved-thumb"><Bookmark /></span>}
                <span><strong>{p.text.split(/[.—]/)[0]}</strong>
                  <small>Saved from {person(world, p.author).name}’s post{p.group ? ` in ${world.groups[p.group].name}` : ""}</small></span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------- Document & map viewers ----------------
export function PdfViewer({ route }) {
  const { world, openSheet, log, toast } = useSocial();
  const d = world.documents[route.docId];
  return (
    <div className="doc-viewer">
      <PageHeader title={d.filename} sub={d.url ? new URL(d.url).hostname : "Shared in group"} right={d.url && (
        <>
          <button className="icon-button" aria-label="Copy link" onClick={async () => { await copyText(d.url); log("link_copied", { kind: "pdf", objectId: d.id, url: d.url }); toast("Link copied"); }}><Link2 size={20} /></button>
          <button className="icon-button" aria-label="Share document" onClick={() => { openSheet({ type: "link", url: d.url, label: d.filename }); log("share_opened", { kind: "pdf", objectId: d.id }); }}><Share2 size={20} /></button>
        </>
      )} />
      <div className="doc-pages">
        {d.pages.map((lines, i) => (
          <div className="doc-page" key={i}>
            {lines.map((l, j) => (j === 0 ? <h3 key={j}>{l}</h3> : j === 1 ? <h4 key={j}>{l}</h4> : <p key={j}>{l || " "}</p>))}
            <span className="doc-pageno">Page {i + 1} of {d.pages.length}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MapViewer({ route }) {
  const { world, openSheet, log, toast } = useSocial();
  const p = world.places[route.placeId];
  return (
    <div className="map-viewer">
      <PageHeader title={p.name} sub="Maps" />
      <img className="map-img" src={p.image} alt={`Map showing ${p.name}, ${p.address}`} />
      <div className="map-card">
        <MapPin color="#e0413a" />
        <span><strong>{p.name}</strong><small>{p.address}</small><small className="url">{p.url}</small></span>
      </div>
      <div className="map-actions">
        <button className="btn primary"><Navigation size={16} /> Directions</button>
        <button className="btn secondary" onClick={async () => { await copyText(p.url); log("link_copied", { kind: "map", objectId: p.id, url: p.url }); toast("Link copied"); }}><Link2 size={16} /> Copy link</button>
        <button className="btn secondary" onClick={() => { openSheet({ type: "link", url: p.url, label: p.name }); log("share_opened", { kind: "map", objectId: p.id }); }}><Share2 size={16} /> Share</button>
      </div>
    </div>
  );
}

export { countComments, uid };
