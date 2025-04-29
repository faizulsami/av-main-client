import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, Clock } from "lucide-react";
import { ChatContact } from "@/types/chat.types";
import { Badge } from "@/components/ui/badge";

interface UserInfoProps {
  selectedUser: ChatContact;
}

const UserInfo: React.FC<UserInfoProps> = ({ selectedUser }) => {
  // Create a storage key based on the user ID
  const timerStorageKey = `${selectedUser.id}-message-time`;

  // Timer states
  const [elapsedTime, setElapsedTime] = React.useState(0);

  const [isTimerRunning, setIsTimerRunning] = React.useState(false);
  const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastTickTimeRef = React.useRef<number>(Date.now());

  // Reset elapsedTime when timerStorageKey changes
  React.useEffect(() => {
    const storedTime = sessionStorage.getItem(timerStorageKey);
    setElapsedTime(storedTime ? parseInt(storedTime, 10) : 0);
  }, [timerStorageKey, selectedUser]);

  // Store elapsed time in sessionStorage whenever it changes
  React.useEffect(() => {
    sessionStorage.setItem(timerStorageKey, elapsedTime.toString());
  }, [elapsedTime, timerStorageKey]);

  // Format time as HH:MM:SS
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  };

  // Start timer function
  const startTimer = React.useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    setIsTimerRunning(true);
    lastTickTimeRef.current = Date.now();

    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const deltaSeconds = Math.floor((now - lastTickTimeRef.current) / 1000);

      if (deltaSeconds > 0) {
        setElapsedTime((prev) => prev + deltaSeconds);
        lastTickTimeRef.current = now;
      }
    }, 1000);
  }, []);

  // Pause timer function
  const pauseTimer = React.useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsTimerRunning(false);
  }, []);

  // Handle visibility change
  const handleVisibilityChange = React.useCallback(() => {
    if (document.visibilityState === "visible") {
      startTimer();
    } else {
      pauseTimer();
    }
  }, [startTimer, pauseTimer]);

  // Initialize timer and event listeners
  React.useEffect(() => {
    // Start the timer immediately when component mounts
    startTimer();

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", startTimer);
    window.addEventListener("blur", pauseTimer);

    // Cleanup on unmount
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", startTimer);
      window.removeEventListener("blur", pauseTimer);
    };
  }, [startTimer, pauseTimer, handleVisibilityChange]);

  return (
    <div className="flex flex-col items-center p-6 text-center">
      <Avatar className="w-20 h-20 rounded-full mb-4">
        <AvatarImage src={selectedUser.Avatar} alt={selectedUser.username} />
        <AvatarFallback className="capitalize text-white bg-soft-paste-hover/50 font-bold">
          {selectedUser.username.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-semibold">{selectedUser.username}</h2>

      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground font-semibold">
        <Badge
          variant="secondary"
          className="font-semibold flex items-center gap-1"
        >
          <CalendarDays size={16} />
          {selectedUser.selectedSlot?.[0]?.time
            ? selectedUser.selectedSlot[0].time
            : "Time not available"}
        </Badge>
      </div>

      <div className="mt-3 mb-2">
        <p className="font-medium text-center">
          {selectedUser.type == "Chat" ? "Chat Duration" : "Call Duration"}
        </p>
        <p className="text-xl font-bold text-center">
          {formatTime(elapsedTime)}
        </p>
        <p className="text-xs text-gray-500 text-center">
          {isTimerRunning ? "Running" : "Paused"}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;
