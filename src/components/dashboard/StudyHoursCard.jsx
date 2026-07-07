import Card from "../ui/Card";

export default function StudyHoursCard({ studySessions }) {
  const totalMinutes = studySessions.reduce((sum, s) => sum + s.minutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <Card title="Study Hours" accentColor="border-moss">
      <p className="font-mono text-2xl text-ink">
        {hours}h {minutes}m
      </p>
      <p className="text-xs text-slate mt-1">logged so far</p>
    </Card>
  );
}
