import Card from "../ui/Card";
import AssessmentRow from "../assignments/AssessmentRow";

export default function AssignmentsCard({
  assessments,
  onUpdateMark,
  onUpdateDueDate,
  onToggleCancelled,
}) {
  const today = new Date();

  const upcoming = assessments
    .filter((a) => a.status !== "cancelled" && a.mark === null)
    .filter((a) => new Date(a.dueDate) >= today)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <Card title="Upcoming Assignments">
      <ul>
        {upcoming.map((a) => (
          <AssessmentRow
            key={a.id}
            assessment={a}
            onUpdateMark={onUpdateMark}
            onUpdateDueDate={onUpdateDueDate}
            onToggleCancelled={onToggleCancelled}
          />
        ))}
      </ul>
    </Card>
  );
}
