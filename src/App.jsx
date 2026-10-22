import { useCallback, useMemo, useRef, useState } from "react";
import SocialApp from "./social/SocialApp.jsx";
import LegacyApp from "./components/LegacyApp.jsx";
import TaskPanel from "./components/TaskPanel.jsx";
import InstallPrompt from "./components/InstallPrompt.jsx";
import generatedTasks from "./data/generatedTasks.json";

const initialTaskId = () => {
  try {
    return new URLSearchParams(window.location.search).get("task");
  } catch {
    return null;
  }
};

export default function App() {
  const tasks = generatedTasks.tasks ?? [];
  const [activeTaskId, setActiveTaskId] = useState(() => {
    const id = initialTaskId();
    return tasks.some((t) => t.id === id) ? id : null;
  });
  const [session, setSession] = useState(0);
  const [showTasks, setShowTasks] = useState(false);
  const [eventLog, setEventLog] = useState([]);
  const taskRef = useRef(activeTaskId);
  taskRef.current = activeTaskId;
  const activeTask = useMemo(() => tasks.find((t) => t.id === activeTaskId) ?? null, [activeTaskId, tasks]);

  const logEvent = useCallback((type, properties = {}) => {
    setEventLog((current) => [
      ...current,
      { id: crypto.randomUUID?.() ?? String(Date.now() + Math.random()), timestamp: new Date().toISOString(), taskId: taskRef.current, type, ...properties },
    ]);
  }, []);

  const startTask = (id) => {
    taskRef.current = id;
    setActiveTaskId(id);
    setSession((n) => n + 1);
    setShowTasks(false);
    logEvent("task_started", { selectedTaskId: id });
    try {
      const url = new URL(window.location.href);
      if (id) url.searchParams.set("task", id); else url.searchParams.delete("task");
      window.history.replaceState(null, "", url);
    } catch { /* ignore */ }
  };

  const openTasks = () => setShowTasks(true);
  const Shell = activeTask?.platform === "messaging" ? LegacyApp : SocialApp;

  return (
    <div className="app-shell">
      <Shell key={`${activeTaskId}-${session}`} task={activeTask} logEvent={logEvent} openTasks={openTasks} />
      {showTasks && (
        <TaskPanel tasks={tasks} activeTaskId={activeTaskId} onSelectTask={startTask} eventLog={eventLog} onClose={() => setShowTasks(false)} />
      )}
      <InstallPrompt />
    </div>
  );
}
