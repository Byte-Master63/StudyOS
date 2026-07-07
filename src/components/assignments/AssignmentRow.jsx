export default function AssessmentRow({
  assessment,
  onUpdateMark,
  onUpdateDueDate,
  onToggleCancelled,
}) {
  return (
    <li>
      <strong>{assessment.module}</strong> — {assessment.type} #{assessment.number}{" "}
      <input
        type="date"
        value={assessment.dueDate}
        onChange={(e) => onUpdateDueDate(assessment.id, e.target.value)}
      />
      <input
        type="number"
        placeholder="mark"
        value={assessment.mark ?? ""}
        onChange={(e) =>
          onUpdateMark(
            assessment.id,
            e.target.value === "" ? null : Number(e.target.value)
          )
        }
      />
      <button onClick={() => onToggleCancelled(assessment.id)}>
        {assessment.status === "cancelled" ? "Restore" : "Cancel"}
      </button>
      {assessment.status === "cancelled" && <em> (cancelled)</em>}
    </li>
  );
}
