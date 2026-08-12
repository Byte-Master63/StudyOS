import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "../components/ui/Card";

export default function Focus() {
  const { addStudySession } = useOutletContext();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [focusLength, setFocusLength] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const previousRunning = useRef(false);

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

  useEffect(() => {
    if (previousRunning.current && !isRunning && secondsElapsed > 0) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        const context = new AudioContextClass();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.frequency.setValueAtTime(523.25, context.currentTime);
        gain.gain.setValueAtTime(0.0001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);
        oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.36);
      }
    }
    previousRunning.current = isRunning;
  }, [isRunning, secondsElapsed]);

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
  const totalSeconds = focusLength * 60;
  const progress = Math.min(100, (secondsElapsed / totalSeconds) * 100);

  return (
    <section>
      <h1 className="text-2xl font-display text-ink mb-2">Focus Timer</h1>
      <p className="text-slate text-sm mb-4">Build a bright, uninterrupted study sprint.</p>
      <Card title="Focus sprint" preview="Your session is logged when you stop it." accentColor="border-moss">
        <div className="timer-orb" style={{ "--timer-progress": `${progress * 3.6}deg` }}>
          <div className="timer-core"><span className="text-xs font-mono uppercase tracking-[.18em] text-violet-500">focus</span><p className="font-display text-5xl text-ink tracking-tight">{displayMinutes}:{displaySeconds}</p><span className="text-xs text-slate">of {focusLength} min</span></div>
        </div>
        <div className="flex justify-center gap-2 mb-5">{[25, 45, 60].map((length) => <button key={length} onClick={() => { setFocusLength(length); setSecondsElapsed(0); }} className={`px-3 py-1 rounded-full text-xs font-mono ${focusLength === length ? "bg-violet-600 text-white" : "bg-violet-100 text-violet-700"}`}>{length} min</button>)}</div>
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
