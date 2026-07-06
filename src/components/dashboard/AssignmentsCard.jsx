import Card from "../ui/Card";
import { assessments } from "../../data/assignments";

export default function AssignmentsCard() {
  const today = new Date();

  const upcoming = assessments
    .filter((a) => a.mark === null && new Date(a.dueDate) >= today)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5); // show next 5 only

  return (
    <Card title="Upcoming Assignments">
      <ul>
        {upcoming.map((a) => (
          <li key={a.id}>
            <strong>{a.module}</strong> — {a.type} #{a.number} due {a.dueDate}
          </li>
        ))}
      </ul>
    </Card>
  );
}
