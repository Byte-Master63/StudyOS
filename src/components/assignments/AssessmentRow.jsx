import { useState, useEffect } from "react";

export default function AssessmentRow({
  assessment,
  onUpdateMark,
  onUpdateDueDate,
  onToggleCancelled,
}) {
  const [markInput, setMarkInput] = useState(assessment.mark ?? "");

  useEffect(() => {
    setMarkInput(assessment.mark ?? "");
  }, [assessment.mark]);

  function commitMark() {
    if (markInput === "") {
      onUpdateMark(assessment.id, null);
      return;
    }
    let value = Number(markInput);
    if (Number.isNaN(value)) {
      value = null;
    } else {
      value = Math.min(100, Math.max(0, value)); // clamp between 0 and 100
    }
    setMarkInput(value ?? "");
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
        min="0"
        max="100"
        placeholder="mark"
        value={markInput}
        onChange={(e) => setMarkInput(e.target.value)}
        onBlur={commitMark}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.target.blur();
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
