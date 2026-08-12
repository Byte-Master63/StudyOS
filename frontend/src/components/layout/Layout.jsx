import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import {
  getAssessments,
  updateAssessment as apiUpdateAssessment,
} from "../../api/assessments";
import { getModules, createModule as apiCreateModule, deleteModule as apiDeleteModule } from "../../api/modules";
import { createAssessment as apiCreateAssessment, deleteAssessment as apiDeleteAssessment } from "../../api/assessments";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function Layout() {
  const { logout, user, loginStamp } = useAuth();

  const [tasks, setTasks] = useLocalStorage("studyos_tasks", []);
  const [assessments, setAssessments] = useState([]);
  const [studySessions, setStudySessions] = useLocalStorage("studyos_studySessions", []);
  const [modules, setModules] = useState([]);
  const [calendarEvents, setCalendarEvents] = useLocalStorage("studyos_calendarEvents", []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [assessmentsData, modulesData] = await Promise.all([
          getAssessments(),
          getModules(),
        ]);
        if (!cancelled) {
          setAssessments(assessmentsData);
          setModules(modulesData);
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
  }, []);

  async function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }
  async function addTask(title) {
    const task = { id: crypto.randomUUID(), title, done: false };
    setTasks((prev) => [...prev, task]);
  }
  async function removeTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  async function updateMark(id, mark) {
    const updated = await apiUpdateAssessment(id, { mark });
    setAssessments((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }

  async function updateDueDate(id, dueDate) {
    const updated = await apiUpdateAssessment(id, { dueDate });
    setAssessments((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }
  async function updateWeight(id, weight) {
    const updated = await apiUpdateAssessment(id, { weight });
    setAssessments((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }

  async function toggleCancelled(id) {
    const assessment = assessments.find((a) => a.id === id);
    if (!assessment) return;
    const newStatus = assessment.status === "cancelled" ? "active" : "cancelled";
    const updated = await apiUpdateAssessment(id, { status: newStatus });
    setAssessments((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }

  async function addStudySession(minutes) {
    const newSession = { id: crypto.randomUUID(), minutes, date: new Date().toISOString() };
    setStudySessions((prev) => [...prev, newSession]);
  }

  async function addModule(data) {
    const item = await apiCreateModule(data);
    setModules((prev) => [...prev, item]);
  }
  async function removeModule(id) {
    await apiDeleteModule(id);
    setModules((prev) => prev.filter((item) => item.id !== id));
  }
  async function addAssessment(data) {
    const item = await apiCreateAssessment(data);
    setAssessments((prev) => [...prev, item]);
  }
  async function removeAssessment(id) {
    await apiDeleteAssessment(id);
    setAssessments((prev) => prev.filter((item) => item.id !== id));
  }
  async function addCalendarEvent(data) {
    const item = { ...data, id: crypto.randomUUID() };
    setCalendarEvents((prev) => [...prev, item]);
  }
  async function updateCalendarEvent(id, data) {
    setCalendarEvents((prev) => prev.map((event) => event.id === id ? { ...event, ...data } : event));
  }
  async function removeCalendarEvent(id) {
    setCalendarEvents((prev) => prev.filter((event) => event.id !== id));
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
      <main className="flex-1 px-4 py-5 md:px-8 md:py-8 min-w-0">
        <header className="md:hidden mb-5 rounded-2xl bg-indigo-950 text-white p-3 shadow-lg">
          <div className="flex items-center justify-between px-1"><span className="font-display text-lg">StudyOS <b className="text-mustard">✦</b></span><span className="text-xs text-white/65">Hi, {user?.fullName?.split(" ")[0] || user?.username}</span></div>
          <nav className="flex gap-1 overflow-x-auto mt-3 pb-1">{[["/", "Home"], ["/assignments", "Work"], ["/modules", "Marks"], ["/focus", "Focus"], ["/assistant", "Assistant"], ["/settings", "Me"]].map(([path, label]) => <NavLink key={path} to={path} end={path === "/"} className={({isActive}) => `shrink-0 rounded-full px-3 py-1.5 text-xs font-mono ${isActive ? "bg-white text-indigo-950" : "bg-white/10 text-white/80"}`}>{label}</NavLink>)}</nav>
        </header>
        <Outlet
          context={{
            tasks,
            user,
            loginStamp,
            assessments,
            modules,
            calendarEvents,
            studySessions,
            toggleTask,
            addTask,
            removeTask,
            updateMark,
            updateDueDate,
            updateWeight,
            toggleCancelled,
            addStudySession,
            addModule,
            removeModule,
            addAssessment,
            removeAssessment,
            addCalendarEvent,
            updateCalendarEvent,
            removeCalendarEvent,
          }}
        />
      </main>
    </div>
  );
}
