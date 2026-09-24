import { CheckCircle2, Circle, Download } from 'lucide-react'

export default function TaskPanel({ tasks, activeTaskId, onSelectTask, eventLog }) {
  const downloadLog = () => {
    const blob = new Blob([JSON.stringify(eventLog, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a')
    anchor.href = url; anchor.download = `sandbox-events-${Date.now()}.json`; anchor.click(); URL.revokeObjectURL(url)
  }
  return (
    <section className="screen padded">
      <div className="section-title"><div><h2>Study tasks</h2><span>Select the task shown to the participant.</span></div><button className="secondary-button" onClick={downloadLog}><Download size={16} />Log</button></div>
      <div className="task-list">
        {tasks.map((task) => (
          <button key={task.id} className={activeTaskId === task.id ? 'task-card selected' : 'task-card'} onClick={() => onSelectTask(task.id)}>
            {activeTaskId === task.id ? <CheckCircle2 /> : <Circle />}<span><em>{task.intentFamily}</em><strong>{task.instruction}</strong><small>{task.difficulty} · {task.breakdownTargets.join(', ')}</small></span>
          </button>
        ))}
      </div>
      <div className="log-summary"><strong>{eventLog.length}</strong><span>interaction events recorded in this session</span></div>
    </section>
  )
}
