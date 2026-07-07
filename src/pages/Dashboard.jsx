import { useOutletContext } from "react-router-dom";

import WelcomeCard from "../components/dashboard/WelcomeCard";
import TasksCard from "../components/dashboard/TasksCard";
import AssignmentsCard from "../components/dashboard/AssignmentsCard";
import ProgressCard from "../components/dashboard/ProgressCard";
import QuoteCard from "../components/dashboard/QuoteCard";
import CalendarCard from "../components/dashboard/CalendarCard";
import StudyHoursCard from "../components/dashboard/StudyHoursCard";

export default function Dashboard() {
  const {
    tasks,
    assessments,
    studySessions,
    toggleTask,
    updateMark,
    updateDueDate,
    toggleCancelled,
  } = useOutletContext();

  return (
    <section>
      <div className="mb-6">
        <WelcomeCard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <StudyHoursCard studySessions={studySessions} />
      </div>
    </section>
  );
}
