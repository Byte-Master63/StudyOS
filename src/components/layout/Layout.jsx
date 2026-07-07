import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { tasks as defaultTasks } from "../../data/tasks";
import { assessments as defaultAssessments } from "../../data/assignments";

export default function Layout() {
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
    <div>
      <Sidebar />
      <main>
        <Outlet
          context={{
            tasks,
            assessments,
            toggleTask,
            updateMark,
            updateDueDate,
            toggleCancelled,
          }}
        />
      </main>
    </div>
  );
}
