export function getModuleStats(assessments) {
  const modules = {};

  assessments.forEach((a) => {
    if (!modules[a.module]) {
      modules[a.module] = {
        module: a.module,
        total: 0,
        completed: 0,
        marks: [],
        upcoming: [],
      };
    }

    const entry = modules[a.module];
    entry.total += 1;

    if (a.status !== "cancelled") {
      if (a.mark !== null) {
        entry.completed += 1;
        entry.marks.push(a.mark);
      } else {
        entry.upcoming.push(a.dueDate);
      }
    }
  });

  return Object.values(modules).map((entry) => ({
    module: entry.module,
    total: entry.total,
    completed: entry.completed,
    averageMark:
      entry.marks.length > 0
        ? Math.round(
            entry.marks.reduce((sum, m) => sum + m, 0) / entry.marks.length
          )
        : null,
    nextDue:
      entry.upcoming.length > 0
        ? entry.upcoming.sort((a, b) => new Date(a) - new Date(b))[0]
        : null,
  }));
}
