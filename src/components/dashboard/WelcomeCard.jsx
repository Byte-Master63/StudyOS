import Card from "../ui/Card";

export default function WelcomeCard() {
  const studentName = "Student";

  return (
    <Card title="Welcome" accentColor="border-ink">
      <p className="text-ink/80">
        Welcome back, <span className="font-medium text-ink">{studentName}</span>.
        Let's make today productive.
      </p>
    </Card>
  );
}
