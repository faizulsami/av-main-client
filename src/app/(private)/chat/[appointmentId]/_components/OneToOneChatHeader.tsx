import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, Menu, Undo2, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { useChatContactsStore } from "@/store/chat-contacts.store";

import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth.service";
import { useChatStore } from "@/store/useChatStore";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatContact } from "@/types/chat.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CallButton } from "@/components/call/call-button";
import { get_socket } from "@/utils/get-socket";
import { useAppointments } from "@/hooks/useAppointments";
import { useToast } from "@/hooks/use-toast";
import { Socket } from "socket.io-client";
import { AppointmentService } from "@/services/appointment.service";
import CancelDialog from "@/components/chat/chat-user-profile/CancelDialog";
import CompleteDialog from "@/components/chat/chat-user-profile/CompleteDialog";
import Link from "next/link";

interface ChatHeaderProps {
  selectedUser: ChatContact;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onPhoneClick: () => void;
}

export const OneToOneChatHeader: React.FC<ChatHeaderProps> = ({
  selectedUser,
  isSidebarOpen,
  setIsSidebarOpen,
  onPhoneClick,
}) => {
  const router = useRouter();
  const { filteredContacts } = useChatContactsStore();
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const { refetch } = useAppointments();
  const { toast } = useToast();
  const [showCompleteDialog, setShowCompleteDialog] = React.useState(false);
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);

  const currentActiveuser = React.useMemo(() => {
    try {
      return AuthService.getStoredUser();
    } catch {
      return null;
    }
  }, []);

  React.useEffect(() => {
    // Socket initialization
    setSocket(get_socket());
  }, []);

  const handleComplete = async () => {
    try {
      if (!socket) return;

      socket.emit("appointment-completed", {
        menteeUserName: selectedUser.menteeUserName,
      });
      toast({
        title: "Success",
        description: "Appointment marked as completed",
      });

      await refetch();
      router.push("/dashboard/booked-calls");

      setShowCompleteDialog(true);
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

      setShowCancelDialog(true);
    } catch (error) {
      console.error("Failed to cancel appointment", error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  const timerStorageKey = `${selectedUser.id}-message-time`;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [elapsedTime, setElapsedTime] = React.useState(() => {
    // Get the stored elapsed time or start from 0
    const storedTime = sessionStorage.getItem(timerStorageKey);
    return storedTime ? parseInt(storedTime, 10) : 0;
  });

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

  const [isTimerRunning, setIsTimerRunning] = React.useState(false);
  const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastTickTimeRef = React.useRef<number>(Date.now());

  // Store elapsed time in sessionStorage whenever it changes
  React.useEffect(() => {
    sessionStorage.setItem(timerStorageKey, elapsedTime.toString());
  }, [elapsedTime, timerStorageKey]);

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

  return (
    <header className="flex items-center gap-3 p-4 border-b">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <Link href="/" className="md:hidden block">
          <Button variant="ghost" size="icon">
            <Undo2 size={20} />
          </Button>
        </Link>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-80  p-0 flex flex-col">
          <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-10">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Messages</h2>
              {currentActiveuser?.role === "mentor" ? (
                <p className="text-xs text-muted-foreground">Your mentees</p>
              ) : (
                <p className="text-xs text-muted-foreground">Your mentor</p>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  role="button"
                  aria-pressed={
                    selectedUser?.menteeUserName === contact.menteeUserName
                  }
                  className={cn(
                    "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-muted/40",
                    contact.isActive && "bg-accent/50",
                    selectedUser?.menteeUserName === contact.menteeUserName &&
                      "bg-primary/10",
                  )}
                  onClick={() => {
                    setIsSidebarOpen(false);
                  }}
                >
                  <Avatar className="w-10 h-10 border rounded-full">
                    <AvatarImage
                      src="/images/avatar.png"
                      alt={contact.username}
                    />
                    <AvatarFallback>
                      {contact.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium truncate">
                        {contact.username}
                      </span>
                      {contact.isActive && (
                        <span className="text-xs text-green-500 font-medium">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      {contact.lastMessage && (
                        <p className="text-sm text-muted-foreground truncate">
                          {contact.lastMessage}
                        </p>
                      )}
                      {contact.timestamp && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {contact.timestamp}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4">{"No contacts found"}</div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* <Avatar className="h-10 w-10">
        <AvatarImage src="/images/avatar.svg" alt={selectedUser.username} />
        <AvatarFallback>{selectedUser.username.charAt(0)}</AvatarFallback>
      </Avatar> */}
      <div className="flex-1 min-w-0 space-y-1">
        <Badge variant="secondary" className="font-semibold truncate">
          @ {selectedUser?.menteeUserName}
        </Badge>
        <p className="text-xs text-muted-foreground truncate">
          {formatTime(elapsedTime)} - {isTimerRunning ? "Running" : "Paused"}
        </p>
      </div>

      {
        <button
          className="block lg:hidden"
          onClick={() => setShowCompleteDialog(true)}
        >
          <Check />
        </button>
      }
      {
        <button
          className="block lg:hidden"
          onClick={() => setShowCompleteDialog(true)}
        >
          <X />
        </button>
      }

      <CallButton menteeId={selectedUser.id} onPhoneClick={onPhoneClick} />

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
    </header>
  );
};
