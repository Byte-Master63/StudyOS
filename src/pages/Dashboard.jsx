import WelcomeCard from "../components/dashboard/WelcomeCard";
import TasksCard from "../components/dashboard/TasksCard";
import AssignmentsCard from "../components/dashboard/AssignmentsCard";
import ProgressCard from "../components/dashboard/ProgressCard";
import QuoteCard from "../components/dashboard/QuoteCard";
import CalendarCard from "../components/dashboard/CalendarCard";
import StudyHoursCard from "../components/dashboard/StudyHoursCard";

export default function Dashboard() {
  return (
    <section>
      <WelcomeCard />
      <TasksCard />
      <AssignmentsCard />
      <ProgressCard />
      <QuoteCard />
      <CalendarCard />
      <StudyHoursCard />
    </section>
  );
}
