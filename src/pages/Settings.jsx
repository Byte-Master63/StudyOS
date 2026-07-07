import Card from "../components/ui/Card";

export default function Settings() {
  function handleResetAllData() {
    const confirmed = window.confirm(
      "This will erase all tasks, assessment edits, and study sessions stored in this browser. Continue?"
    );
    if (confirmed) {
      localStorage.removeItem("studyos_tasks");
      localStorage.removeItem("studyos_assessments");
      localStorage.removeItem("studyos_studySessions");
      window.location.reload();
    }
  }

  return (
    <section>
      <h1>Settings</h1>
      <Card title="Data">
        <p>
          StudyOS currently stores your data locally in this browser only —
          it does not sync between devices yet.
        </p>
        <button onClick={handleResetAllData}>Reset All Data</button>
      </Card>
    </section>
  );
}
