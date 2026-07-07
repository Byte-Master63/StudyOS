import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "../components/ui/Card";

export default function Focus() {
  const { addStudySession } = useOutletContext();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  function handleStartPause() {
    setIsRunning((prev) => !prev);
  }

  function handleStopAndLog() {
    setIsRunning(false);
    const minutes = Math.round(secondsElapsed / 60);
    if (minutes > 0) {
      addStudySession(minutes);
    }
    setSecondsElapsed(0);
  }

  function handleReset() {
    setIsRunning(false);
    setSecondsElapsed(0);
  }

  const displayMinutes = Math.floor(secondsElapsed / 60)
    .toString()
    .padStart(2, "0");
  const displaySeconds = (secondsElapsed % 60).toString().padStart(2, "0");

  return (
    <section>
      <h1>Focus Timer</h1>
      <Card title="Current Session">
        <p style={{ fontSize: "2rem" }}>
          {displayMinutes}:{displaySeconds}
        </p>
        <button onClick={handleStartPause}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={handleStopAndLog}>Stop & Log</button>
        <button onClick={handleReset}>Reset</button>
      </Card>
    </section>
  );
}
