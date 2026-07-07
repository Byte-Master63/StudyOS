import Card from "../ui/Card";
import { generateMonthGrid } from "../../utils/calendarUtils";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarCard({ assessments }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const grid = generateMonthGrid(year, month);

  const dueDaysThisMonth = new Set(
    assessments
      .filter((a) => a.status !== "cancelled")
      .filter((a) => {
        const d = new Date(a.dueDate);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .map((a) => new Date(a.dueDate).getDate())
  );

  return (
    <Card title={`Calendar — ${monthNames[month]} ${year}`}>
      <table>
        <thead>
          <tr>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => (
                <td key={j}>
                  {day && dueDaysThisMonth.has(day) ? <strong>{day}*</strong> : day ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p><small>* = assessment due</small></p>
    </Card>
  );
}
