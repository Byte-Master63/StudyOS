import Card from "../ui/Card";

export default function TasksCard({ tasks, onToggleTask }) {
  return (
    <Card title="Tasks">
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => onToggleTask(task.id)}
              />
              {task.title}
            </label>
          </li>
        ))}
      </ul>
    </Card>
  );
}
