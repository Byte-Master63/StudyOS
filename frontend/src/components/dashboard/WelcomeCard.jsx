import { Link, useOutletContext } from "react-router-dom";
import Card from "../ui/Card";

export default function WelcomeCard() {
  const { user, tasks, assessments, studySessions } = useOutletContext();
  const completed = tasks.filter((task) => task.done).length;
  const upcoming = assessments.filter((assessment) => assessment.status !== "cancelled" && assessment.mark === null).length;
  const minutes = studySessions.reduce((total, session) => total + session.minutes, 0);
  const firstName = user?.fullName?.split(" ")[0] || user?.username || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <Card accentColor="border-fuchsia-500">
      <div className="welcome-hero">
        <div><p className="font-mono text-xs uppercase tracking-[.18em] text-violet-700">Your student space</p><h1 className="font-display text-3xl md:text-4xl text-ink mt-1">{greeting}, {firstName} <span className="text-fuchsia-500">✦</span></h1><p className="text-ink/70 mt-2 max-w-lg">Keep it light: choose one task, make a little progress, and let the streak take care of itself.</p><div className="flex flex-wrap gap-2 mt-4"><Link to="/assignments" className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-mono text-white hover:bg-violet-700">Plan coursework</Link><Link to="/focus" className="rounded-xl bg-white px-4 py-2 text-xs font-mono text-violet-700 ring-1 ring-violet-200 hover:bg-violet-50">Start focus sprint</Link></div></div>
        <div className="grid grid-cols-3 gap-2 mt-5 md:mt-0 md:w-72"><div className="hero-stat"><b>{completed}/{tasks.length}</b><span>tasks done</span></div><div className="hero-stat"><b>{upcoming}</b><span>to grade</span></div><div className="hero-stat"><b>{Math.floor(minutes / 60)}h</b><span>studied</span></div></div>
      </div>
    </Card>
  );
}
