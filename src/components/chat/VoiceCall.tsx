/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";

import { PhoneOff } from "lucide-react";
import React, { useEffect, useState } from "react";

interface VoiceCallProps {
  onEndCall: () => void;
  isOpen: boolean;
}

export const VoiceCall: React.FC<VoiceCallProps> = ({ onEndCall, isOpen }) => {
  const [timer, setTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Load previous call duration from localStorage when dialog opens
  useEffect(() => {
    if (isOpen) {
      const savedTimer = localStorage.getItem("callTimer");
      if (savedTimer) {
        setTimer(parseInt(savedTimer, 10)); // Start from saved timer
      } else {
        setTimer(0); // Start from 0 if no saved timer
      }
      setTimerActive(true); // Start the timer immediately when call opens
    } else {
      setTimerActive(false); // Stop the timer when call closes
    }
  }, [isOpen]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerActive) {
      interval = setInterval(() => {
        setTimer((prevTime) => {
          const newTime = prevTime + 1;
          localStorage.setItem("callTimer", newTime.toString()); // Save updated time to localStorage
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Handle call end and clear timer
  const handleEndCall = () => {
    setTimerActive(false);
    localStorage.removeItem("callTimer"); // Optional: Clear timer when call ends
    setTimer(0); // Reset timer to 0
    onEndCall(); // Call parent's onEndCall
  };

  return (
    <div className="fixed bottom-4 right-4 bg-background p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium">Connected</span>
          {formatTime(timer)}
        </div>
        <Button
          variant="destructive"
          size="icon"
          onClick={handleEndCall}
          className="rounded-full"
        >
          <PhoneOff className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
