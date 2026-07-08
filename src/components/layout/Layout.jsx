import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { getTasks, updateTask as apiUpdateTask } from "../../api/tasks";
import {
  getAssessments,
  updateAssessment as apiUpdateAssessment,
} from "../../api/assessments";
import {
  getStudySessions,
  createStudySession,
} from "../../api/studySessions";

export default function Layout() {
  const { token, logout, user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [tasksData, assessmentsData, sessionsData] = await Promise.all([
          getTasks(token),
          getAssessments(token),
          getStudySessions(token),
        ]);
        if (!cancelled) {
          setTasks(tasksData);
          setAssessments(assessmentsData);
          setStudySessions(sessionsData);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updated = await apiUpdateTask(token, id, { done: !task.done });
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function updateMark(id, mark) {
    const updated = await apiUpdateAssessment(token, id, { mark });
    setAssessments((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }

  async function updateDueDate(id, dueDate) {
    const updated = await apiUpdateAssessment(token, id, { dueDate });
    setAssessments((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }

  async function toggleCancelled(id) {
    const assessment = assessments.find((a) => a.id === id);
    if (!assessment) return;
    const newStatus = assessment.status === "cancelled" ? "active" : "cancelled";
    const updated = await apiUpdateAssessment(token, id, { status: newStatus });
    setAssessments((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }

  async function addStudySession(minutes) {
    const newSession = await createStudySession(token, minutes);
    setStudySessions((prev) => [...prev, newSession]);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <p className="font-mono text-ink">Loading StudyOS...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <p className="font-mono text-stamp">Failed to load data: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar user={user} onLogout={logout} />
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
