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
      <h1 className="text-2xl font-display text-ink mb-6">Settings</h1>
      <Card title="Data" accentColor="border-stamp">
        <p className="text-sm text-ink/80 mb-4">
          StudyOS currently stores your data locally in this browser only —
          it does not sync between devices yet.
        </p>
        <button
          onClick={handleResetAllData}
          className="font-mono text-sm px-4 py-2 rounded bg-stamp text-paper hover:opacity-90 transition-opacity"
        >
          Reset All Data
        </button>
      </Card>
    </section>
  );
}
