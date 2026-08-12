import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "../components/ui/Card";
import { getModuleMarkSummary } from "../utils/moduleUtils";
import { findSharedModule } from "../api/sharedModules";

export default function Modules() {
  const { assessments, modules, addModule, removeModule, user } = useOutletContext();
  const [form, setForm] = useState({ code: "", name: "", period: "semester", academicYear: new Date().getFullYear(), courseworkWeight: 50, examEntranceMark: 40 });
  const [sharedModule, setSharedModule] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const code = form.code.trim();
    const timer = window.setTimeout(async () => {
      if (!code || !user?.institution?.trim()) {
        if (active) {
          setSharedModule(null);
          setLookupError("");
        }
        return;
      }

      try {
        const match = await findSharedModule(user.institution, code);
        if (!active) return;
        setSharedModule(match);
        setLookupError("");
        if (match) {
          setForm((current) => ({
            ...current,
            name: match.name,
            period: match.period,
            courseworkWeight: match.courseworkWeight,
            examEntranceMark: match.examEntranceMark,
          }));
        }
      } catch {
        if (active) {
          setSharedModule(null);
          setLookupError("Could not check shared module configurations. You can still add this module manually.");
        }
      }
    }, 250);

    return () => { active = false; window.clearTimeout(timer); };
  }, [form.code, user?.institution]);

  async function submit(event) {
    event.preventDefault(); setError("");
    try {
      const exactSharedMatch = sharedModule && sharedModule.code.toLowerCase() === form.code.trim().toLowerCase();
      await addModule({ ...form, sharedModuleId: exactSharedMatch ? sharedModule.id : undefined });
      setForm({ ...form, code: "", name: "" });
      setSharedModule(null);
    }
    catch (err) { setError(err.message); }
  }
  return <section>
    <h1 className="text-2xl font-display text-ink mb-6">Modules</h1>
    <Card title="Add a module" preview="Set the academic rules that power your pass projection." accentColor="border-moss" collapsible>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <label className="text-sm">Code<input required value={form.code} onChange={(e) => setForm({...form, code:e.target.value})} placeholder="CSC101" className="w-full mt-1 input" /></label>
        <label className="text-sm">Module name<input required value={form.name} onChange={(e) => setForm({...form, name:e.target.value})} className="w-full mt-1 input" /></label>
        <label className="text-sm">Schedule<select value={form.period} onChange={(e) => setForm({...form, period:e.target.value})} className="w-full mt-1 input"><option value="semester">Semester</option><option value="year">Full year</option></select></label>
        <label className="text-sm">Academic year<input type="number" min="2000" max="2100" value={form.academicYear} onChange={(e) => setForm({...form, academicYear:e.target.value})} className="w-full mt-1 input" /></label>
        <label className="text-sm">Coursework share (%)<input type="number" min="0" max="99" value={form.courseworkWeight} onChange={(e) => setForm({...form, courseworkWeight:e.target.value})} className="w-full mt-1 input" /></label>
        <label className="text-sm">Exam entrance (%)<input type="number" min="0" max="100" value={form.examEntranceMark} onChange={(e) => setForm({...form, examEntranceMark:e.target.value})} className="w-full mt-1 input" /></label>
        <button className="md:col-span-5 justify-self-start font-mono text-sm px-4 py-2 bg-moss text-paper rounded">Save module</button>
      </form>
      {sharedModule && <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Shared configuration found for {sharedModule.code}. Saving will apply its module rules and add {sharedModule.assessments.length} assessment {sharedModule.assessments.length === 1 ? "weight" : "weights"} to your personal tracker.</p>}
      {lookupError && <p className="text-slate text-sm mt-2">{lookupError}</p>}
      {error && <p className="text-stamp text-sm mt-2">{error}</p>}
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {modules.map((module) => {
        const summary = getModuleMarkSummary(module, assessments);
        return <Card key={module.id} title={`${module.code} · ${module.name}`} preview={`${summary.completed.length}/${summary.active.length} graded · tap to view mark projection`} accentColor="border-ink" collapsible>
          <div className="flex gap-3"><div><span className="stamp-badge">{module.code}</span><p className="text-sm text-slate capitalize mt-2">{module.period} · {module.academicYear}</p></div><button onClick={() => removeModule(module.id)} className="ml-auto text-xs text-stamp self-start">Remove</button></div>
          <div className="grid grid-cols-2 gap-3 mt-4"><p className="metric-tile"><span>Course mark</span><strong>{summary.courseMark === null ? "Pending" : `${summary.courseMark.toFixed(1)}%`}</strong></p><p className="metric-tile"><span>Final-mark share</span><strong>{summary.courseworkWeight}%</strong></p></div>
          <p className="mt-3 text-xs text-slate">Assessments currently add <b className="text-violet-700">{summary.earnedContribution.toFixed(1)} points</b> to the {module.period} mark. Weights entered: {summary.totalWeight.toFixed(1)}%.</p>
          {summary.allComplete && <p className={`mt-3 rounded-xl px-3 py-2 text-xs font-medium ${summary.grantedExam ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>{summary.grantedExam ? summary.canReachPass ? `Exam entry granted. You need ${summary.requiredExamMark.toFixed(1)}% in the exam for a 50% final mark.` : "Exam entry granted, but a 50% final mark is no longer possible." : `Exam entry not granted: your course mark needs ${summary.examEntranceMark}%.`}</p>}
        </Card>;
      })}
    </div>
    {!modules.length && <p className="text-slate text-sm mt-4">Add modules to organise assessments, marks, and reports.</p>}
  </section>;
}
