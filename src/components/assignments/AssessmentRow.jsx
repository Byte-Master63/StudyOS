import { useState, useEffect } from "react";

export default function AssessmentRow({
  assessment,
  onUpdateMark,
  onUpdateDueDate,
  onToggleCancelled,
}) {
  const [markInput, setMarkInput] = useState(assessment.mark ?? "");

  // Keep local input in sync if the underlying data changes elsewhere (e.g. Reset All Data)
  useEffect(() => {
    setMarkInput(assessment.mark ?? "");
  }, [assessment.mark]);

  function commitMark() {
    const value = markInput === "" ? null : Number(markInput);
    onUpdateMark(assessment.id, value);
  }

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
        value={markInput}
        onChange={(e) => setMarkInput(e.target.value)}
        onBlur={commitMark}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.target.blur(); // triggers commitMark via onBlur
          }
        }}
      />
      <button onClick={() => onToggleCancelled(assessment.id)}>
        {assessment.status === "cancelled" ? "Restore" : "Cancel"}
      </button>
      {assessment.status === "cancelled" && <em> (cancelled)</em>}
    </li>
  );
}
