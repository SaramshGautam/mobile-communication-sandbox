// The original two-tab sandbox (feed + WhatsApp-style messages), still used
// for messaging-app (-M) tasks until that app gets its own rebuild.
import { useState } from "react";
import { Home, MessageCircle, ClipboardList, UserRound } from "lucide-react";
import Header from "./Header.jsx";
import FeedView from "./FeedView.jsx";
import MessagesView from "./MessagesView.jsx";
import Avatar from "./Avatar.jsx";
import data from "../data/sandboxData.json";

const tabs = [
  { id: "feed", label: "Feed", icon: Home },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "tasks", label: "Tasks", icon: ClipboardList },
  { id: "profile", label: "Profile", icon: UserRound },
];

export default function LegacyApp({ task, logEvent, openTasks }) {
  const [activeTab, setActiveTab] = useState("messages");
  const navigate = (tab) => {
    if (tab === "tasks") return openTasks();
    setActiveTab(tab);
    logEvent("navigation", { destination: tab });
  };
  return (
    <div className="legacy-app">
      <Header title="Connect" task={task} />
      <main className="app-content">
        {activeTab === "feed" && <FeedView data={data} logEvent={logEvent} />}
        {activeTab === "messages" && <MessagesView data={data} logEvent={logEvent} />}
        {activeTab === "profile" && (
          <section className="screen padded">
            <div className="profile-card">
              <Avatar name="Pat Morgan" initials="PM" size="large" />
              <h2>Pat Morgan</h2>
              <p>Study sandbox profile</p>
            </div>
          </section>
        )}
      </main>
      <nav className="bottom-nav" aria-label="Primary navigation">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} className={activeTab === id ? "nav-item active" : "nav-item"} onClick={() => navigate(id)}>
            <Icon size={22} strokeWidth={2} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
