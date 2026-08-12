import Card from "../ui/Card";

export default function ProgressCard({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.done).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Card title="Progress" accentColor="border-moss">
      <p className="text-sm text-ink/80 mb-2">
        {completed} of {total} tasks completed
      </p>
      <div className="w-full h-2 bg-slate/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-moss transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-right text-xs font-mono text-moss mt-1">{percentage}%</p>
    </Card>
  );
}
