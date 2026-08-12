import { useOutletContext } from "react-router-dom";
import Card from "../components/ui/Card";
import { getModuleStats, getModuleMarkSummary } from "../utils/moduleUtils";

export default function Analytics() {
  const { tasks, assessments, modules } = useOutletContext();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.done).length;
  const taskCompletionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const calculatedStats = getModuleStats(assessments);
  const moduleStats = modules.map((module) => calculatedStats.find((item) => item.module === module.code) || {
    module: module.code, total: 0, completed: 0, averageMark: null,
  });
  const allMarks = moduleStats
    .filter((m) => m.averageMark !== null)
    .map((m) => m.averageMark);
  const overallAverage =
    allMarks.length > 0
      ? Math.round(allMarks.reduce((sum, m) => sum + m, 0) / allMarks.length)
      : null;

  const totalAssessments = assessments.filter((a) => a.status !== "cancelled").length;
  const completedAssessments = assessments.filter(
    (a) => a.status !== "cancelled" && a.mark !== null
  ).length;
  const dueSoon = assessments.filter((assessment) => {
    const days = Math.ceil((new Date(`${assessment.dueDate}T00:00:00`) - new Date(new Date().toDateString())) / 86400000);
    return assessment.status !== "cancelled" && assessment.mark === null && days >= 0 && days <= 5;
  });
  const strongestModule = [...moduleStats].filter((module) => module.averageMark !== null).sort((a, b) => b.averageMark - a.averageMark)[0];

  return (
    <section>
      <p className="font-mono text-xs uppercase tracking-[.18em] text-violet-600">Student performance</p>
      <h1 className="text-3xl font-display text-ink mt-1">Your progress, made clear.</h1>
      <p className="text-slate text-sm mt-2 mb-6">A practical snapshot of your workload, coursework performance, and what needs attention next.</p>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <Card accentColor="border-moss">
          <p className="text-xs font-mono text-slate uppercase mb-1">Task Completion</p>
          <p className="text-3xl font-display text-ink">{taskCompletionRate}%</p>
          <p className="text-xs text-slate mt-1">{completedTasks} of {totalTasks} tasks</p>
        </Card>
        <Card accentColor="border-stamp">
          <p className="text-xs font-mono text-slate uppercase mb-1">Assessments Done</p>
          <p className="text-3xl font-display text-ink">
            {completedAssessments}/{totalAssessments}
          </p>
        </Card>
        <Card accentColor="border-mustard">
          <p className="text-xs font-mono text-slate uppercase mb-1">Overall Average</p>
          <p className="text-3xl font-display text-ink">
            {overallAverage !== null ? `${overallAverage}%` : "—"}
          </p>
        </Card>
        <Card accentColor={dueSoon.length ? "border-stamp" : "border-cyan-500"}>
          <p className="text-xs font-mono text-slate uppercase mb-1">Deadline radar</p>
          <p className="text-3xl font-display text-ink">{dueSoon.length}</p>
          <p className="text-xs text-slate mt-1">due in the next 5 days</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card title="Your next move" preview="A quick read of the most useful action for today." accentColor="border-violet-500"><p className="text-ink">{dueSoon.length ? <><b className="text-rose-700">{dueSoon[0].module} {dueSoon[0].type} #{dueSoon[0].number}</b> is due soon. Give it a focused study block today.</> : completedTasks < totalTasks ? "Choose one unfinished task and turn it into a quick win." : "Your task list is clear — use the time to review your next module."}</p></Card>
        <Card title="Performance highlight" preview="Your strongest recorded module so far." accentColor="border-moss"><p className="text-ink">{strongestModule ? <><span className="stamp-badge">{strongestModule.module}</span> is leading with a <b className="text-moss">{strongestModule.averageMark}%</b> average.</> : "Add marks to completed assessments to unlock module performance insights."}</p></Card>
      </div>

      <Card title="By Module" accentColor="border-ink">
        <ul className="space-y-4">
          {moduleStats.map((m) => (
            <li key={m.module} className="text-sm rounded-2xl bg-violet-50/70 p-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="stamp-badge">{m.module}</span>
                <span className="text-ink/80">{m.completed}/{m.total} done</span>
                <span className="font-mono text-xs text-moss ml-auto">{m.averageMark !== null ? `${m.averageMark}%` : "no marks yet"}</span>
              </div>
              <div className="h-2 rounded bg-ink/10 overflow-hidden" aria-label={`${m.module} average mark`}>
                <div className="h-full bg-moss transition-all" style={{ width: `${m.averageMark ?? 0}%` }} />
              </div>
              {(() => {
                const module = modules.find((item) => item.code === m.module);
                const summary = module && getModuleMarkSummary(module, assessments);
                if (!summary) return null;
                return <div className="mt-3 text-xs"><span className="font-mono text-violet-700">{summary.earnedContribution.toFixed(1)} pts earned</span> · {!summary.allComplete ? `${summary.active.length - summary.completed.length} assessment(s) still need marks` : summary.grantedExam ? summary.canReachPass ? `Exam entry granted — need ${summary.requiredExamMark.toFixed(1)}% in the exam for a 50% final mark.` : "Exam entry granted, but a 50% final mark is no longer mathematically possible." : `Exam entry not granted — course mark needs ${summary.examEntranceMark}%.`}</div>;
              })()}
            </li>
          ))}
        </ul>
        {moduleStats.length === 0 && <p className="text-slate text-sm">Create a module and record marks to see your report.</p>}
      </Card>
    </section>
  );
}
