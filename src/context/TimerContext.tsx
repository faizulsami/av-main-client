"use client";
// TimerContext.tsx
import { useAuth } from "@/hooks/useAuth";
import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useState,
} from "react";

interface TimerContextType {
  elapsedTime: number;
  isTimerRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error("useTimer must be used within TimerProvider");
  return context;
};

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const isMentor = user?.role === "mentor";

  const timerStorageKey = `${user?.id}-message-time`;

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const storedTime = sessionStorage.getItem(timerStorageKey);
    setElapsedTime(storedTime ? parseInt(storedTime, 10) : 0);
  }, [timerStorageKey]);

  useEffect(() => {
    sessionStorage.setItem(timerStorageKey, elapsedTime.toString());
  }, [elapsedTime, timerStorageKey]);

  const startTimer = useCallback(() => {
    if (!isMentor) return;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    setIsTimerRunning(true);
    lastTickTimeRef.current = Date.now();

    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const delta = Math.floor((now - lastTickTimeRef.current) / 1000);
      if (delta > 0) {
        setElapsedTime((prev) => prev + delta);
        lastTickTimeRef.current = now;
      }
    }, 1000);
  }, [isMentor]);

  const pauseTimer = useCallback(() => {
    if (!isMentor) return;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = null;
    setIsTimerRunning(false);
  }, [isMentor]);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "visible") {
      startTimer();
    } else {
      pauseTimer();
    }
  }, [startTimer, pauseTimer]);

  useEffect(() => {
    if (isMentor) startTimer();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", startTimer);
    window.addEventListener("blur", pauseTimer);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", startTimer);
      window.removeEventListener("blur", pauseTimer);
    };
  }, [startTimer, pauseTimer, handleVisibilityChange, isMentor]);

  return (
    <TimerContext.Provider
      value={{ elapsedTime, isTimerRunning, startTimer, pauseTimer }}
    >
      {children}
    </TimerContext.Provider>
  );
};
