"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";

import { AppointmentService } from "@/services/appointment.service";
import { useToast } from "@/hooks/use-toast";
import { useAppointments } from "@/hooks/useAppointments";
import { ChatContact } from "@/types/chat.types";

import { get_socket } from "@/utils/get-socket";
import OneToOneChatMessages from "./OneToOneChatMessages";
import { Button } from "@/components/ui/button";
import CompleteDialog from "@/components/chat/chat-user-profile/CompleteDialog";
import CancelDialog from "@/components/chat/chat-user-profile/CancelDialog";
import OneToOneUserInfo from "./OneToOneUserInfo";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";

interface UserProfileProps {
  selectedUser: ChatContact;
  onStatusUpdate?: () => void;
}

const OneToOneChatUserProfile: React.FC<UserProfileProps> = ({
  selectedUser,
  onStatusUpdate,
}) => {
  const [showCompleteDialog, setShowCompleteDialog] = React.useState(false);
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const { refetch } = useAppointments();
  const { toast } = useToast();
  const router = useRouter();
  const [socket, setSocket] = React.useState<Socket | null>(null);

  // Timer states
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);
  const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastTickTimeRef = React.useRef<number>(Date.now());

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

    // Socket initialization
    setSocket(get_socket());

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

  const handleComplete = async () => {
    try {
      if (!socket) return;
      await AppointmentService.updateAppointment(selectedUser._id, {
        status: "completed",
        duration: elapsedTime, // Save the call duration
      });

      socket.emit("appointment-completed", {
        menteeUserName: selectedUser.menteeUserName,
      });
      toast({
        title: "Success",
        description: "Appointment marked as completed",
      });

      await refetch();
      router.push("/dashboard/booked-calls");
      onStatusUpdate?.();
      setShowCompleteDialog(false);
    } catch (error) {
      console.error("Failed to complete appointment", error);
      toast({
        title: "Error",
        description: "Failed to complete appointment",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async () => {
    try {
      if (!socket) return;
      await AppointmentService.updateAppointment(selectedUser._id, {
        status: "cancelled",
      });
      socket.emit("appointment-completed", {
        menteeUserName: selectedUser.menteeUserName,
      });
      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
      });
      await refetch();
      onStatusUpdate?.();
      setShowCancelDialog(false);
    } catch (error) {
      console.error("Failed to cancel appointment", error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="h-full rounded-none border-0">
        <OneToOneUserInfo selectedUser={selectedUser} />
        <div className="mt-3 mb-2">
          <p className="font-medium text-center">Call Duration</p>
          <p className="text-xl font-bold text-center">
            {formatTime(elapsedTime)}
          </p>
          <p className="text-xs text-gray-500 text-center">
            {isTimerRunning ? "Running" : "Paused"}
          </p>
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <Button
            size="sm"
            variant="default"
            className="bg-green-500 hover:bg-green-600"
            onClick={() => setShowCompleteDialog(true)}
          >
            Complete
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowCancelDialog(true)}
          >
            Reject
          </Button>
        </div>
      </Card>

      <CompleteDialog
        isOpen={showCompleteDialog}
        onClose={() => setShowCompleteDialog(false)}
        onComplete={handleComplete}
      />

      <CancelDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default OneToOneChatUserProfile;
