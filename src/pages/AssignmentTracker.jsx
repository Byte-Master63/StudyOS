// src/pages/AssignmentTracker.jsx
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "../components/ui/Card";
import AssessmentRow from "../components/assignments/AssessmentRow";

export default function AssignmentTracker() {
  const { assessments, updateMark, updateDueDate, toggleCancelled } =
    useOutletContext();
  const [filter, setFilter] = useState("all");

  function matchesFilter(a) {
    if (filter === "all") return true;
    if (filter === "cancelled") return a.status === "cancelled";
    if (filter === "completed") return a.mark !== null && a.status !== "cancelled";
    if (filter === "upcoming") return a.mark === null && a.status !== "cancelled";
    return true;
  }

  const filtered = assessments.filter(matchesFilter);
  const grouped = filtered.reduce((acc, a) => {
    if (!acc[a.module]) acc[a.module] = [];
    acc[a.module].push(a);
    return acc;
  }, {});
  const modules = Object.keys(grouped).sort();

  const filters = ["all", "upcoming", "completed", "cancelled"];

  return (
    <section>
      <h1 className="text-2xl font-display text-ink mb-6">Assignment Tracker</h1>

      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
              filter === f
                ? "bg-ink text-paper border-ink"
                : "border-ink/20 text-ink/70 hover:border-ink/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {modules.length === 0 ? (
        <p className="text-slate text-sm">No assessments match this filter.</p>
      ) : (
        modules.map((module) => (
          <Card key={module} title={module} accentColor="border-ink">
            <ul>
              {grouped[module]
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .map((a) => (
                  <AssessmentRow
                    key={a.id}
                    assessment={a}
                    onUpdateMark={updateMark}
                    onUpdateDueDate={updateDueDate}
                    onToggleCancelled={toggleCancelled}
                  />
                ))}
            </ul>
          </Card>
        ))
      )}
    </section>
  );
}
