import { createContext, useContext, useEffect, useRef } from "react";
import { Globe, Users, Lock, X } from "lucide-react";
import Avatar from "../components/Avatar.jsx";
import { person } from "./store.js";

export const SocialContext = createContext(null);
export const useSocial = () => useContext(SocialContext);

// Copy text in a way that also works on plain-http LAN dev servers.
export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function PersonAvatar({ id, size }) {
  const { world } = useSocial();
  const p = person(world, id);
  return <Avatar src={p.avatar} name={p.name} size={size} className={p.isPage ? "avatar-page" : ""} />;
}

export function GroupIcon({ group, size = 40 }) {
  return (
    <span className="group-icon" style={{ background: group.color, width: size, height: size, fontSize: size * 0.42 }}>
      {group.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
    </span>
  );
}

export function AudienceIcon({ post }) {
  if (post.group) return <Lock size={11} aria-label="Private group" />;
  if (post.audience === "public") return <Globe size={11} aria-label="Public" />;
  return <Users size={11} aria-label="Friends" />;
}

// Text with clickable #hashtags, @mentions and URLs.
export function RichText({ text, onUrl }) {
  const { world, nav } = useSocial();
  if (!text) return null;
  const parts = text.split(/(https?:\/\/[^\s]+|#[A-Za-z]\w*|@[A-Z][a-z]+)/g);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part))
      return (
        <a key={i} className="inline-link" href={part} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUrl ? onUrl(part) : nav.openUrl(part); }}>
          {part}
        </a>
      );
    if (/^#\w/.test(part))
      return (
        <button key={i} className="hashtag" onClick={(e) => { e.stopPropagation(); nav.push({ name: "search", q: part }); }}>
          {part}
        </button>
      );
    if (/^@[A-Z]/.test(part)) {
      const first = part.slice(1);
      const p = Object.values(world.people).find((x) => x.firstName === first);
      if (p)
        return (
          <button key={i} className="mention" onClick={(e) => { e.stopPropagation(); nav.push({ name: "profile", personId: p.id }); }}>
            {p.id === "me" ? `@${p.firstName}` : part}
          </button>
        );
    }
    return <span key={i}>{part}</span>;
  });
}

export function Sheet({ title, onClose, children, className = "" }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className={`sheet ${className}`} role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grip" />
        {title && (
          <div className="sheet-head">
            <strong>{title}</strong>
            <button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function SheetItem({ icon: Icon, label, sub, onClick, danger }) {
  return (
    <button className={danger ? "sheet-item danger" : "sheet-item"} onClick={onClick}>
      {Icon && <span className="sheet-item-icon"><Icon size={20} /></span>}
      <span><strong>{label}</strong>{sub && <small>{sub}</small>}</span>
    </button>
  );
}

// Long-press (touch or mouse) with a normal click fallback.
export function useLongPress(onLong, onClick, ms = 450) {
  const timer = useRef(null);
  const fired = useRef(false);
  const start = useRef(null);
  const clear = () => { clearTimeout(timer.current); timer.current = null; };
  return {
    onPointerDown: (e) => {
      fired.current = false;
      start.current = { x: e.clientX, y: e.clientY };
      clear();
      timer.current = setTimeout(() => { fired.current = true; onLong(e); }, ms);
    },
    onPointerMove: (e) => {
      if (start.current && Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) > 10) clear();
    },
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
    onContextMenu: (e) => { e.preventDefault(); if (!fired.current) { fired.current = true; clear(); onLong(e); } },
    // Capture phase so a long-press never also "clicks" a child (e.g. a shared post card).
    onClickCapture: (e) => { if (fired.current) { e.preventDefault(); e.stopPropagation(); fired.current = false; } },
    onClick: (e) => onClick?.(e),
  };
}

// Scroll an element with data-anchor=targetId into view. Retries a few times so
// images that load late don't push it away. `flash` briefly highlights it.
export function useFlashScroll(targetId, deps = [], { flash = true, block = "center" } = {}) {
  useEffect(() => {
    if (!targetId) return;
    let userMoved = false;
    const scroller = document.querySelector(".social-scroll");
    const stop = () => { userMoved = true; };
    scroller?.addEventListener("wheel", stop, { passive: true });
    scroller?.addEventListener("touchstart", stop, { passive: true });
    const timers = [60, 350, 900, 1600].map((ms, i) => setTimeout(() => {
      if (userMoved) return;
      const el = document.querySelector(`[data-anchor="${targetId}"]`);
      if (!el) return;
      el.scrollIntoView({ block });
      if (i === 0 && flash) {
        el.classList.add("flash");
        setTimeout(() => el.classList.remove("flash"), 2200);
      }
    }, ms));
    return () => {
      timers.forEach(clearTimeout);
      scroller?.removeEventListener("wheel", stop);
      scroller?.removeEventListener("touchstart", stop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId, ...deps]);
}
