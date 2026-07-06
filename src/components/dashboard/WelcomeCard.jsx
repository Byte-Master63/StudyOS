import Card from "../ui/Card";

export default function WelcomeCard() {
  const studentName = "Student"; // placeholder until auth/user context exists

  return (
    <Card title="Welcome">
      <p>Welcome back, {studentName}. Let's make today productive.</p>
    </Card>
  );
}
