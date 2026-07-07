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
      <h1>Analytics</h1>

      <Card title="Overall">
        <p>Task completion: {completedTasks} / {totalTasks} ({taskCompletionRate}%)</p>
        <p>
          Assessments completed: {completedAssessments} / {totalAssessments}
        </p>
        <p>
          Overall average mark:{" "}
          {overallAverage !== null ? `${overallAverage}%` : "No marks yet"}
        </p>
      </Card>

      <Card title="By Module">
        <ul>
          {moduleStats.map((m) => (
            <li key={m.module}>
              {m.module}: {m.completed}/{m.total} done,{" "}
              {m.averageMark !== null ? `avg ${m.averageMark}%` : "no marks yet"}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
