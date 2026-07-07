import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { tasks as defaultTasks } from "../../data/tasks";
import { assessments as defaultAssessments } from "../../data/assignments";
import { studySessions as defaultStudySessions } from "../../data/studyHours";

export default function Layout() {
  const [tasks, setTasks] = useLocalStorage("studyos_tasks", defaultTasks);
  const [assessments, setAssessments] = useLocalStorage(
    "studyos_assessments",
    defaultAssessments
  );
  const [studySessions, setStudySessions] = useLocalStorage(
    "studyos_studySessions",
    defaultStudySessions
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

  function addStudySession(minutes) {
    setStudySessions((prev) => [
      ...prev,
      {
        id: prev.length > 0 ? Math.max(...prev.map((s) => s.id)) + 1 : 1,
        date: new Date().toISOString().slice(0, 10),
        minutes,
      },
    ]);
  }

    return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <main className="flex-1 px-8 py-8">
        <Outlet
          context={{
            tasks,
            assessments,
            studySessions,
            toggleTask,
            updateMark,
            updateDueDate,
            toggleCancelled,
            addStudySession,
          }}
        />
      </main>
    </div>
  );
}
