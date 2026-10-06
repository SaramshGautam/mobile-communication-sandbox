import { useMemo, useState } from "react";
import { Home, MessageCircle, ClipboardList, UserRound } from "lucide-react";
import Header from "./components/Header.jsx";
import FeedView from "./components/FeedView.jsx";
import MessagesView from "./components/MessagesView.jsx";
import TaskPanel from "./components/TaskPanel.jsx";
import InstallPrompt from "./components/InstallPrompt.jsx";
import Avatar from "./components/Avatar.jsx";
import data from "./data/sandboxData.json";
import generatedTasks from "./data/generatedTasks.json";

const tabs = [
  { id: "feed", label: "Feed", icon: Home },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "tasks", label: "Tasks", icon: ClipboardList },
  { id: "profile", label: "Profile", icon: UserRound },
];

export default function App() {
  const tasks = generatedTasks.tasks?.length
    ? generatedTasks.tasks
    : data.tasks;
  const [activeTab, setActiveTab] = useState("feed");
  const [activeTaskId, setActiveTaskId] = useState(data.tasks[0]?.id ?? null);
  const [eventLog, setEventLog] = useState([]);
  const activeTask = useMemo(
    () => data.tasks.find((task) => task.id === activeTaskId),
    [activeTaskId, tasks]
  );

  const logEvent = (type, properties = {}) => {
    setEventLog((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        taskId: activeTaskId,
        type,
        ...properties,
      },
    ]);
  };

  const navigate = (tab) => {
    setActiveTab(tab);
    logEvent("navigation", { destination: tab });
  };

  return (
    <div className="app-shell">
      <Header title="Connect" task={activeTask} />
      <main className="app-content">
        {activeTab === "feed" && <FeedView data={data} logEvent={logEvent} />}
        {activeTab === "messages" && (
          <MessagesView data={data} logEvent={logEvent} />
        )}
        {activeTab === "tasks" && (
          <TaskPanel
            tasks={data.tasks}
            activeTaskId={activeTaskId}
            onSelectTask={(id) => {
              setActiveTaskId(id);
              logEvent("task_started", { selectedTaskId: id });
            }}
            eventLog={eventLog}
          />
        )}
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
          <button
            key={id}
            className={activeTab === id ? "nav-item active" : "nav-item"}
            onClick={() => navigate(id)}
          >
            <Icon size={22} strokeWidth={2} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <InstallPrompt />
    </div>
  );
}
