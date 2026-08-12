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
    if (a.status !== "cancelled") {
      entry.total += 1;
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

export function getModuleMarkSummary(module, assessments) {
  const active = assessments.filter((assessment) => assessment.module === module.code && assessment.status !== "cancelled");
  const completed = active.filter((assessment) => assessment.mark !== null);
  const totalWeight = active.reduce((sum, assessment) => sum + Number(assessment.weight || 0), 0);
  const earnedContribution = completed.reduce(
    (sum, assessment) => sum + (Number(assessment.mark) * Number(assessment.weight || 0)) / 100,
    0,
  );
  const allComplete = active.length > 0 && completed.length === active.length;
  const courseMark = allComplete && totalWeight > 0 ? earnedContribution / totalWeight * 100 : null;
  const courseworkWeight = Number(module.courseworkWeight ?? 50);
  const examWeight = 100 - courseworkWeight;
  const examEntranceMark = Number(module.examEntranceMark ?? 40);
  const grantedExam = courseMark !== null && courseMark >= examEntranceMark;
  const requiredExamMark = grantedExam && examWeight > 0
    ? Math.max(0, (50 - courseMark * courseworkWeight / 100) / (examWeight / 100))
    : null;

  return {
    active,
    completed,
    totalWeight,
    earnedContribution,
    allComplete,
    courseMark,
    courseworkWeight,
    examWeight,
    examEntranceMark,
    grantedExam,
    requiredExamMark,
    canReachPass: requiredExamMark !== null && requiredExamMark <= 100,
  };
}
