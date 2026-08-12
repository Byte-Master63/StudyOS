import Card from "../ui/Card";

export default function TasksCard({ tasks, onToggleTask }) {
  return (
    <Card title="Tasks" accentColor="border-slate">
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id}>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => onToggleTask(task.id)}
                className="w-4 h-4 accent-moss"
              />
              <span
                className={
                  task.done
                    ? "line-through text-slate"
                    : "text-ink group-hover:text-ink/70"
                }
              >
                {task.title}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </Card>
  );
}
