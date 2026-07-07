export function generateMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grid = [];
  let week = new Array(startWeekday).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      grid.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    grid.push(week);
  }

  return grid;
}

export function getAssessmentsForMonth(assessments, year, month) {
  return assessments.filter((a) => {
    if (a.status === "cancelled") return false;
    const d = new Date(a.dueDate);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

export function getDueDaysInMonth(assessments, year, month) {
  return new Set(
    getAssessmentsForMonth(assessments, year, month).map((a) =>
      new Date(a.dueDate).getDate()
    )
  );
}
