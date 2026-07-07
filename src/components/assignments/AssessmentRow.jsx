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
      value = Math.min(100, Math.max(0, value));
    }
    setMarkInput(value ?? "");
    onUpdateMark(assessment.id, value);
  }

  return (
    <li
      className={`flex flex-wrap items-center gap-3 py-2 border-b border-slate/10 last:border-0 ${
        assessment.status === "cancelled" ? "opacity-40" : ""
      }`}
    >
      <span className="stamp-badge">{assessment.module}</span>
      <span className="text-sm text-ink/80 flex-1 min-w-[120px]">
        {assessment.type} #{assessment.number}
      </span>
      <input
        type="date"
        value={assessment.dueDate}
        onChange={(e) => onUpdateDueDate(assessment.id, e.target.value)}
        className="font-mono text-xs border border-slate/30 rounded px-2 py-1 bg-paper text-ink"
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
          if (e.key === "Enter") e.target.blur();
        }}
        className="font-mono text-xs border border-slate/30 rounded px-2 py-1 w-16 bg-paper text-ink"
      />
      <button
        onClick={() => onToggleCancelled(assessment.id)}
        className="text-xs font-mono text-stamp hover:underline"
      >
        {assessment.status === "cancelled" ? "Restore" : "Cancel"}
      </button>
    </li>
  );
}
