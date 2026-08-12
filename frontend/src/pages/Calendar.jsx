import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "../components/ui/Card";
import {
  generateMonthGrid,
  getDueDaysInMonth,
  getAssessmentsForMonth,
} from "../utils/calendarUtils";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Calendar() {
  const { assessments } = useOutletContext();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const grid = generateMonthGrid(year, month);
  const dueDays = getDueDaysInMonth(assessments, year, month);
  const monthAssessments = getAssessmentsForMonth(assessments, year, month).sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  );
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  function goToPreviousMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-display text-ink mb-6">Calendar</h1>

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={goToPreviousMonth}
          className="font-mono text-sm px-3 py-1 border border-ink/20 rounded hover:bg-ink hover:text-paper transition-colors"
        >
          ← Prev
        </button>
        <span className="font-display text-lg text-ink min-w-[180px] text-center">
          {monthNames[month]} {year}
        </span>
        <button
          onClick={goToNextMonth}
          className="font-mono text-sm px-3 py-1 border border-ink/20 rounded hover:bg-ink hover:text-paper transition-colors"
        >
          Next →
        </button>
      </div>

      <Card accentColor="border-ink">
        <table className="w-full text-center font-mono text-sm border-collapse">
          <thead>
            <tr className="text-slate">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <th key={d} className="pb-3 font-normal">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((week, i) => (
              <tr key={i}>
                {week.map((day, j) => (
                  <td key={j} className="py-1.5">
                    {day ? (
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          isCurrentMonth && day === today.getDate()
                            ? "bg-ink text-paper"
                            : dueDays.has(day)
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
      </Card>

      <div className="mt-6">
        <Card title={`Due in ${monthNames[month]} ${year}`} accentColor="border-stamp">
          {monthAssessments.length === 0 ? (
            <p className="text-slate text-sm">Nothing due this month.</p>
          ) : (
            <ul className="space-y-2">
              {monthAssessments.map((a) => (
                <li key={a.id} className="flex items-center gap-3 text-sm">
                  <span className="stamp-badge">{a.module}</span>
                  <span className="text-ink/80">
                    {a.type} #{a.number} — due {a.dueDate}
                  </span>
                  {a.mark !== null && (
                    <span className="font-mono text-xs text-moss ml-auto">
                      {a.mark}%
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </section>
  );
}
