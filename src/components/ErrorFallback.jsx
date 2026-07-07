import { useRouteError, useNavigate } from "react-router-dom";

export default function ErrorFallback() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error("StudyOS route error:", error);

  return (
    <div>
      <h1>Something went wrong</h1>
      <p>
        StudyOS ran into an unexpected error on this page. Your saved data
        (tasks, marks, study sessions) is untouched — only this page failed
        to load correctly.
      </p>
      <button onClick={() => navigate("/")}>Return to Dashboard</button>
      <button onClick={() => window.location.reload()}>Reload Page</button>
    </div>
  );
}
