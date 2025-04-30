/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { formatTime } from "@/utils/formateTimer";

import { PhoneOff } from "lucide-react";
import React, { useEffect, useState } from "react";

interface VoiceCallProps {
  onEndCall: () => void;
  isOpen: boolean;
}

export const VoiceCall: React.FC<VoiceCallProps> = ({ onEndCall, isOpen }) => {
  const [timer, setTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(isOpen);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerActive) {
      setTimer(0);
      interval = setInterval(() => {
        setTimer((prevTime) => {
          const newTime = prevTime + 1;

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  // Handle call end and clear timer
  const handleEndCall = () => {
    console.log("click");
    setTimerActive(false);
    setTimer(0);
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
