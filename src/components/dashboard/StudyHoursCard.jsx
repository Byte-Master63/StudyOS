import Card from "../ui/Card";
import { studySessions } from "../../data/studyHours";

export default function StudyHoursCard() {
  const totalMinutes = studySessions.reduce((sum, s) => sum + s.minutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <Card title="Study Hours">
      <p>
        {hours}h {minutes}m logged this week
      </p>
      <p>
        <small>
          Placeholder data — will be replaced by the Focus Timer feature.
        </small>
      </p>
    </Card>
  );
}
