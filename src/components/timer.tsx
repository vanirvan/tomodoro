import { Pause, Play, RotateCcw, Square } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Session } from "@/lib/types";

import { useLocalStorage, useReadLocalStorage } from "@/hooks";

export const Timer = () => {
  // Read settings from localStorage
  const focusDuration = useReadLocalStorage<number>("focusDuration") || 25;
  const breakDuration = useReadLocalStorage<number>("breakDuration") || 5;
  const focusColor = useReadLocalStorage<string>("focusColor") || "#8B5CF6";
  const breakColor = useReadLocalStorage<string>("breakColor") || "#F97316";
  const focusSound = useReadLocalStorage<string>("focusSound") || "bell";
  const breakSound = useReadLocalStorage<string>("breakSound") || "chime";

  // State management with localStorage
  const [currentMode, setCurrentMode] = useLocalStorage<"focus" | "break">(
    "mode",
    "focus",
  );
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessions, setSessions] = useLocalStorage<Session[]>(
    "tomodoro-sessions",
    [],
  );

  // Derived values
  const duration = currentMode === "focus" ? focusDuration : breakDuration;
  const color = currentMode === "focus" ? focusColor : breakColor;
  const title = sessionTitle;
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Update timer when duration or mode changes
  useEffect(() => {
    setTimeLeft(duration * 60);
    setIsRunning(false);
    setSessionStartTime(null);
  }, [duration, currentMode]);

  // Session completion handler
  const handleSessionComplete = (sessionDuration: number) => {
    const newSession: Session = {
      mode: currentMode,
      duration: sessionDuration,
      startTime: new Date(),
    };
    setSessions([...sessions, newSession]);
  };

  // Timer completion handler
  const handleComplete = () => {
    // Play sound notification (implementation needed)
    const sound = currentMode === "focus" ? focusSound : breakSound;
    console.log(`Playing ${sound} sound`);

    // Auto-switch modes after completion
    if (currentMode === "focus") {
      setCurrentMode("break");
    } else {
      setCurrentMode("focus");
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isRunning && timeLeft > 0) {
      if (sessionStartTime === null) {
        setSessionStartTime(duration * 60);
      }

      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleComplete();
            if (currentMode === "focus" && sessionStartTime !== null) {
              handleSessionComplete(sessionStartTime);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [
    isRunning,
    timeLeft,
    currentMode,
    duration,
    sessionStartTime,
    sessions,
    sessionTitle,
    focusSound,
    breakSound,
    setSessions,
    setCurrentMode,
  ]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  const toggleTimer = () => {
    if (!isRunning && sessionStartTime === null) {
      setSessionStartTime(duration * 60);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(duration * 60);
    setIsRunning(false);
    setSessionStartTime(null);
  };

  const stopAndSave = () => {
    if (currentMode === "focus" && sessionStartTime !== null) {
      const elapsedTime = sessionStartTime - timeLeft;
      handleSessionComplete(elapsedTime);
    }
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setSessionStartTime(null);
  };

  const canToggleMode = !isRunning && sessionStartTime === null;

  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center gap-8">
      {/* Mode Toggle */}
      <div className="flex gap-2 rounded-full bg-white/10 p-1">
        <Button
          variant={currentMode === "focus" ? "default" : "ghost"}
          onClick={() => setCurrentMode("focus")}
          disabled={!canToggleMode}
          className="rounded-full px-6"
          style={currentMode === "focus" ? { backgroundColor: color } : {}}
        >
          Focus
        </Button>
        <Button
          variant={currentMode === "break" ? "default" : "ghost"}
          onClick={() => setCurrentMode("break")}
          disabled={!canToggleMode}
          className="rounded-full px-6"
          style={currentMode === "break" ? { backgroundColor: color } : {}}
        >
          Break
        </Button>
      </div>

      {/* Circular Timer */}
      <div className="relative">
        <svg className="-rotate-90 transform" width="280" height="280">
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r="130"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx="140"
            cy="140"
            r="130"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 130}`}
            strokeDashoffset={`${2 * Math.PI * 130 * (1 - progress / 100)}`}
            style={{ transition: "stroke-dashoffset 1s linear" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Timer Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-7xl font-bold tracking-tight">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
          <div className="text-muted-foreground mt-2 text-lg font-medium capitalize">
            {currentMode} Time
          </div>
        </div>
      </div>

      {/* Title Input */}
      {currentMode === "focus" && (
        <Input
          type="text"
          placeholder="What are you working on?"
          value={title}
          onChange={(e) => setSessionTitle(e.target.value)}
          className="text-muted-foreground w-full max-w-96 border-white/70 bg-white/50 text-center backdrop-blur-md placeholder:text-black/60"
        />
      )}

      {/* Controls */}
      <div className="grid grid-cols-3 items-center justify-items-center gap-4">
        <Button
          size="lg"
          variant="outline"
          onClick={resetTimer}
          className="h-14 w-14 rounded-full"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>

        <Button
          size="lg"
          onClick={toggleTimer}
          className="shadow-strong h-20 w-20 rounded-full transition-all hover:scale-105"
          style={{ backgroundColor: color }}
        >
          {isRunning ? (
            <Pause className="h-8 w-8 text-white" />
          ) : (
            <Play className="h-8 w-8 text-white" />
          )}
        </Button>

        {currentMode === "focus" &&
          (isRunning || sessionStartTime !== null) && (
            <Button
              size="lg"
              variant="outline"
              onClick={stopAndSave}
              className="h-14 w-14 rounded-full"
            >
              <Square className="h-5 w-5 fill-current" />
            </Button>
          )}
      </div>
    </div>
  );
};
