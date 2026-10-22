import { useState } from "react";
import { CheckCircle2, Circle, Download, X, RotateCcw } from "lucide-react";

// Researcher-facing task picker. Selecting a task resets the sandbox to that
// task's starting screen. Tip: you can also open /?task=P02-S directly.
export default function TaskPanel({ tasks, activeTaskId, onSelectTask, eventLog, onClose }) {
  const [platform, setPlatform] = useState("social");
  const shown = tasks.filter((t) => t.platform === platform);
  const downloadLog = () => {
    const blob = new Blob([JSON.stringify(eventLog, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sandbox-events-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="task-overlay" role="dialog" aria-label="Study tasks">
      <div className="task-overlay-head">
        <div>
          <h2>Study tasks</h2>
          <span>Selecting a task resets the app to its starting screen.</span>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Close"><X size={22} /></button>
      </div>
      <div className="task-tools">
        <div className="segmented">
          <button className={platform === "social" ? "active" : ""} onClick={() => setPlatform("social")}>Social app (-S)</button>
          <button className={platform === "messaging" ? "active" : ""} onClick={() => setPlatform("messaging")}>Messaging app (-M)</button>
        </div>
        <button className="secondary-button" onClick={downloadLog}><Download size={16} />Log ({eventLog.length})</button>
        {activeTaskId && <button className="secondary-button" onClick={() => onSelectTask(activeTaskId)}><RotateCcw size={16} />Restart</button>}
        <button className="secondary-button" onClick={() => onSelectTask(null)}>Free explore</button>
      </div>
      <div className="task-list">
        {shown.map((task) => (
          <button key={task.id} className={activeTaskId === task.id ? "task-card selected" : "task-card"} onClick={() => onSelectTask(task.id)}>
            {activeTaskId === task.id ? <CheckCircle2 /> : <Circle />}
            <span>
              <em>{task.id} · {task.intentFamily}</em>
              <strong>{task.instruction}</strong>
              <small>{task.startState}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
