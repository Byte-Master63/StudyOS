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
      <h1>Calendar</h1>

      <div>
        <button onClick={goToPreviousMonth}>Previous</button>
        <span> {monthNames[month]} {year} </span>
        <button onClick={goToNextMonth}>Next</button>
      </div>

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
                  {day && dueDays.has(day) ? <strong>{day}*</strong> : day ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Card title={`Due in ${monthNames[month]} ${year}`}>
        {monthAssessments.length === 0 ? (
          <p>Nothing due this month.</p>
        ) : (
          <ul>
            {monthAssessments.map((a) => (
              <li key={a.id}>
                <strong>{a.module}</strong> — {a.type} #{a.number} due {a.dueDate}
                {a.mark !== null && ` (mark: ${a.mark})`}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
