// src/pages/AssignmentTracker.jsx
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "../components/ui/Card";
import AssessmentRow from "../components/assignments/AssessmentRow";

export default function AssignmentTracker() {
  const { assessments, modules, updateMark, updateDueDate, updateWeight, toggleCancelled, addAssessment, removeAssessment } =
    useOutletContext();
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ moduleId: "", number: 1, type: "Assignment", dueDate: "", weight: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault(); setError("");
    try { await addAssessment(form); setForm({ ...form, number: Number(form.number) + 1, dueDate: "", weight: "" }); }
    catch (err) { setError(err.message); }
  }

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
  const moduleCodes = Object.keys(grouped).sort();

  const filters = ["all", "upcoming", "completed", "cancelled"];

  return (
    <section>
      <h1 className="text-2xl font-display text-ink mb-6">Assignment Tracker</h1>

      <Card title="Schedule an assessment" preview="Add its share of your semester or year mark." accentColor="border-moss" collapsible>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select required value={form.moduleId} onChange={(e) => setForm({...form, moduleId:e.target.value})} className="input">
            <option value="">Select module</option>{modules.map((m) => <option key={m.id} value={m.id}>{m.code} · {m.name}</option>)}
          </select>
          <select value={form.type} onChange={(e) => setForm({...form, type:e.target.value})} className="input"><option>Assignment</option><option>Project</option><option>Test</option><option>Examination</option></select>
          <input type="number" min="1" required value={form.number} onChange={(e) => setForm({...form, number:e.target.value})} className="input" aria-label="Assessment number" />
          <input type="date" required value={form.dueDate} onChange={(e) => setForm({...form, dueDate:e.target.value})} className="input" />
          <label className="text-xs text-slate">Coursework weight (%)<input type="number" min="0" max="100" step="0.5" required value={form.weight} onChange={(e) => setForm({...form, weight:e.target.value})} className="w-full mt-1 input" /></label>
          <button className="font-mono text-sm px-4 py-2 bg-moss text-paper rounded md:col-span-4 justify-self-start">Save assessment</button>
        </form>
        {modules.length === 0 && <p className="text-slate text-sm mt-2">Create a module first, then schedule its assignments, projects, tests, or exams.</p>}
        {error && <p className="text-stamp text-sm mt-2">{error}</p>}
      </Card>

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

      {moduleCodes.length === 0 ? (
        <p className="text-slate text-sm">No assessments match this filter.</p>
      ) : (
        moduleCodes.map((module) => (
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
                    onUpdateWeight={updateWeight}
                    onToggleCancelled={toggleCancelled}
                    onDelete={removeAssessment}
                  />
                ))}
            </ul>
          </Card>
        ))
      )}
    </section>
  );
}
