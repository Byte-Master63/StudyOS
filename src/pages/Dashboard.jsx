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
    toggleTask,
    updateMark,
    updateDueDate,
    toggleCancelled,
  } = useOutletContext();

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
