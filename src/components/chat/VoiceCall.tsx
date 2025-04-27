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

  useEffect(() => {
    if (isOpen) {
      const savedTimer = localStorage.getItem("callTimer");

      // Set the timer from localStorage or default to 300 seconds (5 minutes) if not available
      setTimer(savedTimer ? parseInt(savedTimer, 10) : 300); // Default to 5 minutes if no saved timer
    }
  }, [isOpen]);

  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Handle call end and clear timer
  const handleEndCall = () => {
    // setTimerActive(false);

    onEndCall();
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
