import { useOutletContext } from "react-router-dom";
import Card from "../components/ui/Card";
import { getModuleStats } from "../utils/moduleUtils";

export default function Analytics() {
  const { tasks, assessments } = useOutletContext();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.done).length;
  const taskCompletionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const moduleStats = getModuleStats(assessments);
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

  return (
    <section>
      <h1 className="text-2xl font-display text-ink mb-6">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
      </div>

      <Card title="By Module" accentColor="border-ink">
        <ul className="space-y-2">
          {moduleStats.map((m) => (
            <li key={m.module} className="flex items-center gap-3 text-sm">
              <span className="stamp-badge">{m.module}</span>
              <span className="text-ink/80">
                {m.completed}/{m.total} done
              </span>
              <span className="font-mono text-xs text-moss ml-auto">
                {m.averageMark !== null ? `${m.averageMark}%` : "no marks yet"}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
