// src/pages/Dashboard.jsx
import { useLocalStorage } from "../hooks/useLocalStorage";
import { tasks as defaultTasks } from "../data/tasks";
import { assessments as defaultAssessments } from "../data/assignments";

import WelcomeCard from "../components/dashboard/WelcomeCard";
import TasksCard from "../components/dashboard/TasksCard";
import AssignmentsCard from "../components/dashboard/AssignmentsCard";
import ProgressCard from "../components/dashboard/ProgressCard";
import QuoteCard from "../components/dashboard/QuoteCard";
import CalendarCard from "../components/dashboard/CalendarCard";
import StudyHoursCard from "../components/dashboard/StudyHoursCard";

export default function Dashboard() {
  const [tasks, setTasks] = useLocalStorage("studyos_tasks", defaultTasks);
  const [assessments, setAssessments] = useLocalStorage(
    "studyos_assessments",
    defaultAssessments
  );

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function updateMark(id, mark) {
    setAssessments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, mark } : a))
    );
  }

  function updateDueDate(id, dueDate) {
    setAssessments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, dueDate } : a))
    );
  }

  function toggleCancelled(id) {
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "cancelled" ? "active" : "cancelled" }
          : a
      )
    );
  }

  return (
    <section>
      <WelcomeCard />
      <TasksCard tasks={tasks} onToggleTask={toggleTask} />
      <AssignmentsCard
        assessments={assessments}
        onUpdateMark={updateMark}
        onUpdateDueDate={updateDueDate}
        onToggleCancelled={toggleCancelled}
      />
      <ProgressCard tasks={tasks} />
      <QuoteCard />
      <CalendarCard assessments={assessments} />
      <StudyHoursCard />
    </section>
  );
}
