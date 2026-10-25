import { createContext, useContext } from "react";
import { Users } from "lucide-react";
import Avatar from "../components/Avatar.jsx";
import { contact } from "./store.js";

export { Sheet, SheetItem, useLongPress, copyText } from "../social/ui.jsx";

export const MContext = createContext(null);
export const useM = () => useContext(MContext);

export function PersonAvatar({ id, size }) {
  const { world } = useM();
  const c = contact(world, id);
  if (c.unsaved) return <span className={`avatar wa-unknown ${size ? `avatar-${size}` : ""}`} aria-label={c.name}><Users size={size === "xl" ? 40 : 20} /></span>;
  return <Avatar src={c.avatar} name={c.name} size={size} />;
}

export function ConvAvatar({ conv, size }) {
  if (conv.kind === "dm") return <PersonAvatar id={conv.with} size={size} />;
  const initials = conv.title.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return <span className={`avatar wa-group-avatar ${size ? `avatar-${size}` : ""}`} style={{ background: conv.color ?? "#2e7d6b" }} aria-hidden>{initials}</span>;
}

export function fmtDuration(sec = 0) {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
