// src/components/dashboard/TasksCard.jsx
import Card from "../ui/Card";
import { tasks } from "../../data/tasks";

export default function TasksCard() {
  return (
    <Card title="Tasks">
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.done ? "✅" : "⬜"} {task.title}
          </li>
        ))}
      </ul>
    </Card>
  );
}
