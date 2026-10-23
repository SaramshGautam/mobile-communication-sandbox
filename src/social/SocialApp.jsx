import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Home, Users, MessageCircle, Bell, Menu, Search } from "lucide-react";
import { SocialContext } from "./ui.jsx";
import "./social.css";
import { createWorld, reducer, resolveUrl } from "./store.js";
import { START_STATES, DEFAULT_START } from "./scenarios.js";
import {
  HomeFeed, GroupsList, GroupPage, PostDetail, ProfilePage, SearchPage, NotificationsPage, MenuPage, SavedPage, PdfViewer, MapViewer,
} from "./components/Pages.jsx";
import { FriendsPage, EventsPage, EventPage } from "./components/Extras.jsx";
import { StoryViewer, StoryCreator } from "./components/Stories.jsx";
import { ChatsList, ChatView, ChatInfo } from "./components/Chats.jsx";
import { ShareSheet, PhotoViewer, PostComposer } from "./components/Sheets.jsx";

const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "groups", label: "Groups", icon: Users },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "menu", label: "Menu", icon: Menu },
];

const ROUTES = {
  group: GroupPage, post: PostDetail, profile: ProfilePage, search: SearchPage, saved: SavedPage,
  pdf: PdfViewer, map: MapViewer, chats: ChatsList, chat: ChatView, chatInfo: ChatInfo,
  friends: FriendsPage, events: EventsPage, event: EventPage,
};
const ROOTS = { home: HomeFeed, groups: GroupsList, messages: ChatsList, notifications: NotificationsPage, menu: MenuPage };

export default function SocialApp({ scenario, logEvent, openTasks }) {
  const start = START_STATES[scenario?.id] ?? DEFAULT_START;
  const [world, dispatch] = useReducer(reducer, null, () => createWorld(start.setup));
  const [tab, setTab] = useState(start.tab);
  const [stack, setStack] = useState(() => start.stack.map((r) => ({ ...r, quiet: true })));
  const [sheet, setSheet] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [composer, setComposer] = useState(null); // { groupId?, editPostId? }
  const [story, setStory] = useState(null); // { storyId }
  const [storyCreator, setStoryCreator] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const scrollRef = useRef(null);
  const scrollMemo = useRef([]);
  const toastTimer = useRef(null);

  const route = stack[stack.length - 1] ?? { name: tab };
  const routeKey = `${tab}:${stack.length}:${JSON.stringify(route)}`;
  const log = useCallback((type, props = {}) => logEvent(type, { app: "social", screen: route.name, ...props }), [logEvent, route.name]);

  const toast = useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setToastMsg(msg);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2200);
  }, []);

  const nav = useMemo(() => ({
    push: (r) => {
      scrollMemo.current[stack.length] = scrollRef.current?.scrollTop ?? 0;
      setStack((s) => [...s, r]);
      logEvent("navigate", { app: "social", to: r.name, ...r });
    },
    replace: (r) => setStack((s) => [...s.slice(0, -1), r]),
    back: () => {
      setStack((s) => s.slice(0, -1));
      logEvent("navigate_back", { app: "social", from: route.name });
    },
    tab: (t) => {
      setTab(t); setStack([]); scrollMemo.current = [];
      logEvent("tab", { app: "social", to: t });
    },
    openUrl: (url) => {
      const r = resolveUrl(world, url);
      if (!r || r.type === "external") { toast("This link can’t be opened in the study app"); return; }
      const next = r.type === "pdf" ? { name: "pdf", docId: r.docId } : r.type === "map" ? { name: "map", placeId: r.placeId }
        : r.type === "post" ? { name: "post", postId: r.postId } : { name: "profile", personId: r.personId };
      scrollMemo.current[stack.length] = scrollRef.current?.scrollTop ?? 0;
      setStack((s) => [...s, next]);
      logEvent("navigate", { app: "social", to: next.name, url });
    },
  }), [stack.length, world, route.name, logEvent, toast]);

  const depth = stack.length;
  const prevDepth = useRef(depth);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (depth < prevDepth.current) el.scrollTop = scrollMemo.current[depth] ?? 0;
    else if (route.name !== "chat") el.scrollTop = 0;
    prevDepth.current = depth;
  }, [routeKey]); // eslint-disable-line

  useEffect(() => { logEvent("start_state", { app: "social", tab: start.tab, stack: start.stack }); }, []); // eslint-disable-line

  const ctx = {
    world, dispatch, nav, log, toast, now: () => Date.now(),
    openSheet: (req) => setSheet(req),
    openViewer: (photos, index, context) => { setViewer({ photos, index, context }); logEvent("photo_viewer_opened", { app: "social", objectId: photos[index]?.id, ...context }); },
    openComposer: (opts) => setComposer(opts ?? {}),
    openStory: (storyId) => { setStory({ storyId }); logEvent("story_opened", { app: "social", storyId }); },
    openStoryCreator: () => { setStoryCreator(true); logEvent("story_creator_opened", { app: "social" }); },
    openTasks,
  };

  const Page = stack.length ? ROUTES[route.name] : ROOTS[tab];
  const isRoot = stack.length === 0;
  const hideNav = route.name === "chat";
  const unread = world.notifications.filter((n) => n.unread).length;

  return (
    <SocialContext.Provider value={ctx}>
      <div className="social-app">
        {isRoot && (
          <header className="social-top">
            <span className="logo">social media prototype</span>
            <div className="social-top-actions">
              <button className="round-btn" aria-label="Search" onClick={() => nav.push({ name: "search" })}><Search size={20} /></button>
              <button className="round-btn" aria-label="Messages" onClick={() => nav.tab("messages")}><MessageCircle size={20} /></button>
            </div>
          </header>
        )}
        <main className={`social-scroll ${hideNav ? "no-nav" : ""}`} ref={scrollRef}>
          <Page key={routeKey} route={route} />
        </main>
        {!hideNav && (
          <nav className="social-nav" aria-label="Primary">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} className={tab === id ? "nav-item active" : "nav-item"} aria-current={tab === id} onClick={() => nav.tab(id)}>
                <span className="nav-icon"><Icon size={23} />{id === "notifications" && unread > 0 && <i className="badge">{unread}</i>}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
        )}
        {composer && <PostComposer {...composer} onClose={() => setComposer(null)} />}
        {viewer && <PhotoViewer {...viewer} onClose={() => setViewer(null)} />}
        {sheet && <ShareSheet key={JSON.stringify(sheet)} req={sheet} onClose={() => setSheet(null)} />}
        {story && <StoryViewer storyId={story.storyId} onClose={() => setStory(null)} />}
        {storyCreator && <StoryCreator onClose={() => setStoryCreator(false)} />}
        {toastMsg && <div className="toast" role="status">{toastMsg}</div>}
      </div>
    </SocialContext.Provider>
  );
}
