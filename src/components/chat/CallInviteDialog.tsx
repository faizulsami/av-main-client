import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatTime } from "@/utils/formateTimer";
import { Phone } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CallInviteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  caller: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setShowCallScreen: any;
  onAccept: () => void;
  onReject: () => void;
}

const CallInviteDialog: React.FC<CallInviteDialogProps> = ({
  isOpen,
  onOpenChange,
  caller,
  onAccept,
  setShowCallScreen,
  onReject,
}) => {
  const [timer, setTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Load previous call duration from localStorage when dialog opens

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerActive) {
      interval = setInterval(() => {
        setTimer((prevTime) => {
          const newTime = prevTime + 1;
          localStorage.setItem("callTimer", newTime.toString());
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  const handleAccept = () => {
    // Reset timer when accepting a new call
    setTimer(0);
    localStorage.setItem("callTimer", "0");

    // setShowCallScreen(true);
    setTimerActive(true);
    onAccept();
  };

  const handleReject = () => {
    // Stop timer when rejecting a call
    setTimerActive(false);

    onReject();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Incoming audio Call</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {caller} is calling you
            <div>{formatTime(timer)}</div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button variant="destructive" onClick={handleReject}>
            Decline
          </Button>
          <Button onClick={handleAccept}>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallInviteDialog;
