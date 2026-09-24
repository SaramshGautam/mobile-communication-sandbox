import { Search, Bell } from 'lucide-react'

export default function Header({ title, task }) {
  return (
    <header className="topbar">
      <div><span className="eyebrow">Research sandbox</span><h1>{title}</h1></div>
      <div className="topbar-actions">
        <button className="icon-button" aria-label="Search"><Search size={20} /></button>
        <button className="icon-button" aria-label="Notifications"><Bell size={20} /></button>
      </div>
      {task && <div className="task-ribbon"><strong>Current task:</strong> {task.instruction}</div>}
    </header>
  )
}
