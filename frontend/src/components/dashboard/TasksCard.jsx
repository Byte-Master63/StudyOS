import { useState } from "react";
import Card from "../ui/Card";

export default function TasksCard({ tasks, onToggleTask, onAddTask, onRemoveTask }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  async function add(event) {
    event.preventDefault();
    if (!title.trim()) return;
    try { await onAddTask(title.trim()); setTitle(""); } catch (err) { setError(err.message); }
  }
  return <Card title="My task list" accentColor="border-violet-500">
    <form onSubmit={add} className="flex gap-2 mb-4">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs doing?" className="input flex-1" />
      <button className="rounded-lg bg-violet-600 text-white px-3 font-mono text-sm hover:bg-violet-700">Add</button>
    </form>
    {error && <p className="text-stamp text-xs mb-2">{error}</p>}
    {tasks.length ? <ul className="space-y-2">{tasks.map((task) => <li key={task.id} className="flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2 group"><input type="checkbox" checked={task.done} onChange={() => onToggleTask(task.id)} className="w-4 h-4 accent-violet-600" /><span className={`flex-1 ${task.done ? "line-through text-slate" : "text-ink"}`}>{task.title}</span><button onClick={() => onRemoveTask(task.id)} aria-label={`Remove ${task.title}`} className="text-slate hover:text-stamp opacity-0 group-hover:opacity-100 transition-opacity">×</button></li>)}</ul> : <p className="text-slate text-sm">Start small—add your first win for today.</p>}
  </Card>;
}
