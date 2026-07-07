import Card from "../ui/Card";
import { generateMonthGrid, getDueDaysInMonth } from "../../utils/calendarUtils";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarCard({ assessments }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const grid = generateMonthGrid(year, month);
  const dueDaysThisMonth = getDueDaysInMonth(assessments, year, month);
  const todayDate = today.getDate();

  return (
    <Card title={`Calendar — ${monthNames[month]} ${year}`} accentColor="border-ink">
      <table className="w-full text-center text-xs font-mono border-collapse">
        <thead>
          <tr className="text-slate">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <th key={d} className="pb-2 font-normal">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => (
                <td key={j} className="py-1">
                  {day ? (
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        day === todayDate
                          ? "bg-ink text-paper"
                          : dueDaysThisMonth.has(day)
                          ? "bg-stamp/10 text-stamp font-semibold"
                          : "text-ink/70"
                      }`}
                    >
                      {day}
                    </span>
                  ) : (
                    ""
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-slate mt-2">
        <span className="text-stamp font-semibold">●</span> assessment due
      </p>
    </Card>
  );
}
