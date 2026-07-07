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

  const displayMinutes = Math.floor(secondsElapsed / 60).toString().padStart(2, "0");
  const displaySeconds = (secondsElapsed % 60).toString().padStart(2, "0");

  return (
    <section>
      <h1 className="text-2xl font-display text-ink mb-6">Focus Timer</h1>
      <Card accentColor="border-moss">
        <p className="font-mono text-6xl text-ink text-center py-6 tracking-tight">
          {displayMinutes}:{displaySeconds}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={handleStartPause}
            className="font-mono text-sm px-5 py-2 rounded bg-moss text-paper hover:opacity-90 transition-opacity"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={handleStopAndLog}
            className="font-mono text-sm px-5 py-2 rounded bg-stamp text-paper hover:opacity-90 transition-opacity"
          >
            Stop & Log
          </button>
          <button
            onClick={handleReset}
            className="font-mono text-sm px-5 py-2 rounded border border-ink/20 text-ink hover:bg-ink/5 transition-colors"
          >
            Reset
          </button>
        </div>
      </Card>
    </section>
  );
}
