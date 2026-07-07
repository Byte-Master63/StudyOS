import Card from "../ui/Card";

export default function ProgressCard({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.done).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Card title="Progress">
      <p>
        {completed} of {total} tasks completed ({percentage}%)
      </p>
    </Card>
  );
}
