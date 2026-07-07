import Card from "../ui/Card";

export default function StudyHoursCard({ studySessions }) {
  const totalMinutes = studySessions.doesNotExist.reduce((sum, s) => sum + s.minutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <Card title="Study Hours">
      <p>{hours}h {minutes}m logged</p>
    </Card>
  );
}
