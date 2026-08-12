// src/data/assignments.js
// Source: UNISA myAdmin assessments export (student 13572794)
// Each entry: formative assessment per module, with due date and mark if already processed.

export const assessments = [
  // COS1501
  { id: "COS1501-1", module: "COS1501", number: 1, type: "quiz", dueDate: "2026-06-01", mark: 93 },
  { id: "COS1501-2", module: "COS1501", number: 2, type: "quiz", dueDate: "2026-06-08", mark: 52 },
  { id: "COS1501-3", module: "COS1501", number: 3, type: "assignment", dueDate: "2026-07-31", mark: null },
  { id: "COS1501-4", module: "COS1501", number: 4, type: "quiz", dueDate: "2026-09-11", mark: null },

  // COS1511
  { id: "COS1511-1", module: "COS1511", number: 1, type: "quiz", dueDate: "2026-05-15", mark: 100 },
  { id: "COS1511-2", module: "COS1511", number: 2, type: "assignment", dueDate: "2026-06-24", mark: null },
  { id: "COS1511-3", module: "COS1511", number: 3, type: "assignment", dueDate: "2026-08-14", mark: null },
  { id: "COS1511-4", module: "COS1511", number: 4, type: "quiz", dueDate: "2026-09-09", mark: null },

  // COS1512
  { id: "COS1512-1", module: "COS1512", number: 1, type: "quiz", dueDate: "2026-05-29", mark: 90 },
  { id: "COS1512-2", module: "COS1512", number: 2, type: "review", dueDate: "2026-08-19", mark: null },
  { id: "COS1512-3", module: "COS1512", number: 3, type: "review", dueDate: "2026-09-07", mark: null },
  { id: "COS1512-4", module: "COS1512", number: 4, type: "quiz", dueDate: "2026-09-10", mark: null },

  // COS1521
  { id: "COS1521-1", module: "COS1521", number: 1, type: "quiz", dueDate: "2026-05-27", mark: 100 },
  { id: "COS1521-2", module: "COS1521", number: 2, type: "quiz", dueDate: "2026-06-18", mark: 84 },
  { id: "COS1521-3", module: "COS1521", number: 3, type: "quiz", dueDate: "2026-07-22", mark: null },
  { id: "COS1521-4", module: "COS1521", number: 4, type: "forum", dueDate: "2026-08-13", mark: null },
  { id: "COS1521-5", module: "COS1521", number: 5, type: "quiz", dueDate: "2026-09-02", mark: null },

  // INF1505
  { id: "INF1505-1", module: "INF1505", number: 1, type: "quiz", dueDate: "2026-05-05", mark: 92 },
  { id: "INF1505-2", module: "INF1505", number: 2, type: "quiz", dueDate: "2026-06-17", mark: 92 },
  { id: "INF1505-3", module: "INF1505", number: 3, type: "quiz", dueDate: "2026-08-11", mark: null },
  { id: "INF1505-4", module: "INF1505", number: 4, type: "quiz", dueDate: "2026-09-14", mark: null },

  // INF1511
  { id: "INF1511-1", module: "INF1511", number: 1, type: "quiz", dueDate: "2026-05-25", mark: 100 },
  { id: "INF1511-2", module: "INF1511", number: 2, type: "quiz", dueDate: "2026-09-14", mark: null },
  { id: "INF1511-3", module: "INF1511", number: 3, type: "quiz", dueDate: "2026-09-14", mark: null },
  { id: "INF1511-4", module: "INF1511", number: 4, type: "quiz", dueDate: "2026-09-14", mark: null },
  { id: "INF1511-5", module: "INF1511", number: 5, type: "quiz", dueDate: "2026-09-14", mark: null },
  { id: "INF1511-6", module: "INF1511", number: 6, type: "quiz", dueDate: "2026-09-14", mark: null },
  { id: "INF1511-7", module: "INF1511", number: 7, type: "quiz", dueDate: "2026-09-14", mark: null },
  { id: "INF1511-8", module: "INF1511", number: 8, type: "quiz", dueDate: "2026-09-14", mark: null },

  // INF1520
  { id: "INF1520-1", module: "INF1520", number: 1, type: "quiz", dueDate: "2026-05-29", mark: 86 },
  { id: "INF1520-2", module: "INF1520", number: 2, type: "quiz", dueDate: "2026-06-30", mark: 91 },
  { id: "INF1520-3", module: "INF1520", number: 3, type: "quiz", dueDate: "2026-07-31", mark: null },
  { id: "INF1520-4", module: "INF1520", number: 4, type: "assignment", dueDate: "2026-08-31", mark: null },

  // MAT1503
  { id: "MAT1503-1", module: "MAT1503", number: 1, type: "quiz", dueDate: "2026-05-29", mark: null },
  { id: "MAT1503-2", module: "MAT1503", number: 2, type: "assignment", dueDate: "2026-06-30", mark: null },
  { id: "MAT1503-3", module: "MAT1503", number: 3, type: "assignment", dueDate: "2026-07-31", mark: null },
  { id: "MAT1503-4", module: "MAT1503", number: 4, type: "assignment", dueDate: "2026-08-31", mark: null },
  { id: "MAT1503-5", module: "MAT1503", number: 5, type: "quiz", dueDate: "2026-09-11", mark: null },
];

// Summative exams — all currently "to be announced" per myAdmin
export const exams = [
  { module: "COS1501", weight: 60, status: "to be announced" },
  { module: "COS1511", weight: 60, status: "to be announced" },
  { module: "COS1512", weight: 60, status: "to be announced" },
  { module: "COS1521", weight: 60, status: "to be announced" },
  { module: "INF1505", weight: 60, status: "to be announced" },
  { module: "INF1511", weight: 60, status: "to be announced" },
  { module: "INF1520", weight: 60, status: "to be announced" },
  { module: "MAT1503", weight: 60, status: "to be announced" },
];
