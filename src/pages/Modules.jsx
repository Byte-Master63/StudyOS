import { useOutletContext } from "react-router-dom";
import Card from "../components/ui/Card";
import { getModuleStats } from "../utils/moduleUtils";

export default function Modules() {
  const { assessments } = useOutletContext();
  const stats = getModuleStats(assessments).sort((a, b) =>
    a.module.localeCompare(b.module)
  );

  return (
    <section>
      <h1>Modules</h1>
      {stats.map((m) => (
        <Card key={m.module} title={m.module}>
          <p>
            {m.completed} of {m.total} assessments completed
          </p>
          <p>
            Average mark:{" "}
            {m.averageMark !== null ? `${m.averageMark}%` : "No marks yet"}
          </p>
          <p>Next due: {m.nextDue ?? "Nothing upcoming"}</p>
        </Card>
      ))}
    </section>
  );
}
