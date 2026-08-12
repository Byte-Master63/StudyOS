import { useState } from "react";

export default function AssessmentRow({
  assessment,
  onUpdateMark,
  onUpdateDueDate,
  onUpdateWeight,
  onToggleCancelled,
  onDelete,
  alertText,
}) {
  const [markInput, setMarkInput] = useState(assessment.mark ?? "");
  const [weightInput, setWeightInput] = useState(assessment.weight ?? "");
  const daysUntilDue = Math.ceil((new Date(`${assessment.dueDate}T00:00:00`) - new Date(new Date().toDateString())) / 86400000);
  const needsAttention = assessment.status !== "cancelled" && assessment.mark === null && daysUntilDue >= 0 && daysUntilDue <= 5;

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

  function commitWeight() {
    const value = weightInput === "" ? 0 : Math.min(100, Math.max(0, Number(weightInput)) || 0);
    setWeightInput(value);
    onUpdateWeight?.(assessment.id, value);
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
      {needsAttention && <span className="deadline-alert">⚡ {daysUntilDue === 0 ? "Due today" : `${daysUntilDue} day${daysUntilDue === 1 ? "" : "s"} left`}</span>}
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
      <label className="text-[10px] font-mono text-slate uppercase">weight
        <input type="number" min="0" max="100" step="0.5" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} onBlur={commitWeight} className="block font-mono text-xs border border-slate/30 rounded px-2 py-1 w-16 bg-paper text-ink" />
      </label>
      {assessment.mark !== null && Number(assessment.weight) > 0 && <span className="text-xs font-mono text-violet-700">+{((assessment.mark * assessment.weight) / 100).toFixed(1)} pts</span>}
      <button
        onClick={() => onToggleCancelled(assessment.id)}
        className="text-xs font-mono text-stamp hover:underline"
      >
        {assessment.status === "cancelled" ? "Restore" : "Cancel"}
      </button>
      {onDelete && <button onClick={() => onDelete(assessment.id)} className="text-xs font-mono text-slate hover:text-stamp">Delete</button>}
      {alertText && !needsAttention && <span className="text-xs font-mono text-stamp">{alertText}</span>}
    </li>
  );
}
