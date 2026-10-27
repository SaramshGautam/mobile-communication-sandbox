import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SocialApp from "./social/SocialApp.jsx";
import MessengerApp from "./messenger/MessengerApp.jsx";
import TaskPanel from "./components/TaskPanel.jsx";
import TaskStrip from "./components/TaskStrip.jsx";
import InstallPrompt from "./components/InstallPrompt.jsx";
import SessionGate from "./components/SessionGate.jsx";
import { logRemote, startSession, endSession, savedSession, resumeSession, getStatus, onStatus, remoteEnabled } from "./lib/remoteLog.js";
import data from "./data/scenarios.json";

// URL: ?s=T01-S&step=2  (or ?app=messenger for free exploration)
const fromUrl = () => {
  try {
    const q = new URLSearchParams(window.location.search);
    return { s: q.get("s"), step: Number(q.get("step")) || 1, app: q.get("app") };
  } catch {
    return {};
  }
};

export default function App() {
  const scenarios = data.scenarios ?? [];
  const init = fromUrl();
  const [scenarioId, setScenarioId] = useState(() => (scenarios.some((s) => s.id === init.s) ? init.s : null));
  const [stepIndex, setStepIndex] = useState(() => Math.min(3, Math.max(0, (init.step ?? 1) - 1)));
  const [freeApp, setFreeApp] = useState(init.app === "messenger" ? "messenger" : "social");
  const [session, setSession] = useState(0);
  const [showTasks, setShowTasks] = useState(false);
  const [eventLog, setEventLog] = useState([]);
  const [fire, setFire] = useState(null); // researcher-fired trigger { id, n }

  const scenario = useMemo(() => scenarios.find((s) => s.id === scenarioId) ?? null, [scenarioId, scenarios]);
  const step = scenario?.steps[stepIndex] ?? null;
  const ctxRef = useRef({});
  ctxRef.current = { scenarioId, step: step?.n ?? null, intent: step?.intent ?? null };

  // Who is using the app: one study session per participant (see lib/remoteLog.js).
  const [studySession, setStudySession] = useState(() => { const s = savedSession(); return s ? resumeSession(s) : null; });
  const [remoteStatus, setRemoteStatus] = useState(getStatus());
  useEffect(() => onStatus(setRemoteStatus), []);
  const sessionRef = useRef(studySession);
  sessionRef.current = studySession;

  const logEvent = useCallback((type, properties = {}) => {
    const c = ctxRef.current;
    const s = sessionRef.current;
    const event = {
      id: crypto.randomUUID?.() ?? String(Date.now() + Math.random()),
      timestamp: new Date().toISOString(),
      participantId: s?.participantId ?? null, sessionId: s?.id ?? null,
      scenarioId: c.scenarioId, step: c.step, intent: c.intent,
      type, ...properties,
    };
    setEventLog((current) => [...current, event]);
    logRemote(event);
  }, []);

  const beginSession = async (info) => {
    const s = await startSession(info);
    sessionRef.current = s;
    setStudySession(s);
    setEventLog([]);
    logEvent("session_started", { researcher: info.researcher || null, practice: !!info.practice, remoteLogging: remoteEnabled && !info.practice });
  };
  const finishSession = async () => {
    logEvent("session_ended");
    await endSession("researcher_ended");
    sessionRef.current = null;
    setStudySession(null);
    setShowTasks(false);
  };

  const syncUrl = (id, idx, app) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("task");
      if (id) { url.searchParams.set("s", id); url.searchParams.set("step", String(idx + 1)); url.searchParams.delete("app"); }
      else { url.searchParams.delete("s"); url.searchParams.delete("step"); url.searchParams.set("app", app); }
      window.history.replaceState(null, "", url);
    } catch { /* ignore */ }
  };

  // TASK START: fresh world for the scenario, starting at step 1.
  const startScenario = (id, idx = 0) => {
    ctxRef.current = { scenarioId: id, step: idx + 1, intent: scenarios.find((s) => s.id === id)?.steps[idx]?.intent };
    setScenarioId(id);
    setStepIndex(idx);
    setSession((n) => n + 1);
    setShowTasks(false);
    logEvent("scenario_started", { selectedScenarioId: id, startStep: idx + 1 });
    syncUrl(id, idx, freeApp);
  };

  // CONTINUE: keep the participant's screen and changes; only the instruction changes.
  const goToStep = (idx) => {
    if (!scenario || idx < 0 || idx > scenario.steps.length - 1 || idx === stepIndex) return;
    const from = stepIndex + 1;
    ctxRef.current = { scenarioId, step: idx + 1, intent: scenario.steps[idx].intent };
    setStepIndex(idx);
    logEvent("step_changed", { fromStep: from, toStep: idx + 1 });
    syncUrl(scenarioId, idx, freeApp);
  };

  const freeExplore = (app) => {
    ctxRef.current = { scenarioId: null, step: null, intent: null };
    setScenarioId(null);
    setFreeApp(app);
    setSession((n) => n + 1);
    setShowTasks(false);
    logEvent("free_explore_started", { app });
    syncUrl(null, 0, app);
  };

  // Exposed for automated checks and for recovering a log if the download fails.
  useEffect(() => { window.__sandboxLog = eventLog; }, [eventLog]);

  const appName = scenario?.app ?? freeApp;
  const Shell = appName === "messenger" ? MessengerApp : SocialApp;

  return (
    <div className="app-shell">
      {scenario && (
        <TaskStrip scenario={scenario} stepIndex={stepIndex} onStep={goToStep} onOpenTasks={() => setShowTasks(true)} />
      )}
      <div className="app-body">
        <Shell
          key={`${scenarioId ?? appName}-${session}`}
          scenario={scenario}
          step={step?.n ?? 0}
          logEvent={logEvent}
          openTasks={() => setShowTasks(true)}
          fire={fire}
        />
        {showTasks && (
          <TaskPanel
            scenarios={scenarios}
            scenario={scenario}
            stepIndex={stepIndex}
            appName={appName}
            onStart={startScenario}
            onStep={goToStep}
            onFree={freeExplore}
            onFire={(id) => { setFire((f) => ({ id, n: (f?.n ?? 0) + 1 })); setShowTasks(false); logEvent("trigger_fired_by_researcher", { triggerId: id }); }}
            eventLog={eventLog}
            studySession={studySession}
            remoteStatus={remoteStatus}
            onEndSession={finishSession}
            onClose={() => setShowTasks(false)}
          />
        )}
        {!studySession && <SessionGate onStart={beginSession} />}
      </div>
      <InstallPrompt />
    </div>
  );
}
