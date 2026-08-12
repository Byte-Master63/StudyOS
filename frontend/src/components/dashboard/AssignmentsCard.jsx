import Card from "../ui/Card";
import AssessmentRow from "../assignments/AssessmentRow";

export default function AssignmentsCard({
  assessments,
  onUpdateMark,
  onUpdateDueDate,
  onUpdateWeight,
  onToggleCancelled,
}) {
  const today = new Date();
  const upcoming = assessments
    .filter((a) => a.status !== "cancelled" && a.mark === null)
    .filter((a) => new Date(a.dueDate) >= today)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  function alertLabel(dueDate) {
    const days = Math.ceil((new Date(`${dueDate}T00:00:00`) - new Date(today.toDateString())) / 86400000);
    return days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : `${days} days left`;
  }

  return (
    <Card title="Upcoming Assignments" accentColor="border-stamp">
      {upcoming.length === 0 ? (
        <p className="text-slate text-sm">Nothing due soon.</p>
      ) : (
        <ul>
          {upcoming.map((a) => (
            <AssessmentRow key={a.id} assessment={a} onUpdateMark={onUpdateMark} onUpdateDueDate={onUpdateDueDate} onUpdateWeight={onUpdateWeight} onToggleCancelled={onToggleCancelled} alertText={alertLabel(a.dueDate)} />
          ))}
        </ul>
      )}
    </Card>
  );
}
