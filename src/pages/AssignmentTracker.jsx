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

  return (
    <section>
      <h1>Assignment Tracker</h1>

      <div>
        <label>
          Filter:{" "}
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      {modules.length === 0 ? (
        <p>No assessments match this filter.</p>
      ) : (
        modules.map((module) => (
          <Card key={module} title={module}>
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
