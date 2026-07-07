import Card from "../ui/Card";

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
          <li key={a.id}>
            <strong>{a.module}</strong> — {a.type} #{a.number}{" "}
            <input
              type="date"
              value={a.dueDate}
              onChange={(e) => onUpdateDueDate(a.id, e.target.value)}
            />
            <input
              type="number"
              placeholder="mark"
              value={a.mark ?? ""}
              onChange={(e) =>
                onUpdateMark(
                  a.id,
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            />
            <button onClick={() => onToggleCancelled(a.id)}>
              {a.status === "cancelled" ? "Restore" : "Cancel"}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
