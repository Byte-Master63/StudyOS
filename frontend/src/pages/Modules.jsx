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
      <h1 className="text-2xl font-display text-ink mb-6">Modules</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((m) => (
          <Card key={m.module} accentColor="border-ink">
            <span className="stamp-badge mb-3 inline-block">{m.module}</span>
            <p className="text-sm text-ink/80 mb-1">
              {m.completed} of {m.total} assessments completed
            </p>
            <p className="text-sm text-ink/80 mb-1">
              Average mark:{" "}
              <span className="font-mono text-moss">
                {m.averageMark !== null ? `${m.averageMark}%` : "—"}
              </span>
            </p>
            <p className="text-sm text-slate">
              Next due: {m.nextDue ?? "Nothing upcoming"}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
