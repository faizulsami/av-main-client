/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, Menu, Undo2, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CallButton } from "../call/call-button";
import { useChatContactsStore } from "@/store/chat-contacts.store";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth.service";
import { useChatStore } from "@/store/useChatStore";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatContact } from "@/types/chat.types";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { AppointmentService } from "@/services/appointment.service";
import { Socket } from "socket.io-client";
import { get_socket } from "@/utils/get-socket";
import { useAppointments } from "@/hooks/useAppointments";
import { useToast } from "@/hooks/use-toast";
import CompleteDialog from "./chat-user-profile/CompleteDialog";
import CancelDialog from "./chat-user-profile/CancelDialog";

interface currentMentorUser {
  username: string;
  role: string;
}
interface ChatHeaderProps {
  selectedUser: any;
  setSelectedUser: React.Dispatch<React.SetStateAction<any | null>>;
  isProfileOpen: boolean;
  setIsProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contactName?: string;
  lastActiveTime?: string;
  currentUser: currentMentorUser;
  onPhoneClick: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedUser,
  setSelectedUser,
  isSidebarOpen,
  setIsSidebarOpen,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lastActiveTime,
  currentUser,
  onPhoneClick,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession, setChatSelectedUser } = useChatStore();
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

  const getEmptyStateMessage = () => {
    if (currentActiveuser?.role === "mentor") {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            No Active Mentees
          </p>
          <p className="text-xs text-muted-foreground">
            Wait for mentees to book appointments with you
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          No Active Appointments
        </p>
        <p className="text-xs text-muted-foreground">
          Book an appointment with a mentor to start chatting
        </p>
      </div>
    );
  };

  const handleContactSelect = (contact: ChatContact) => {
    const currentActiveuser = AuthService.getStoredUser();
    if (!currentActiveuser) {
      router.push("/login");
      return;
    }

    setSelectedUser(contact);
    const params = new URLSearchParams(searchParams);
    const isMentor = currentActiveuser.role === "mentor";

    params.set(
      "mentee",
      isMentor ? contact.username : currentActiveuser.userName,
    );

    params.set(
      "mentor",
      isMentor ? currentActiveuser.userName : contact.username,
    );
    router.push(`/chat?${params.toString()}`);

    setSession(
      isMentor ? currentActiveuser.userName : contact.username,
      isMentor ? contact.username : currentActiveuser.userName,
    );
    setChatSelectedUser(contact);
  };

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
      await AppointmentService.updateAppointment(selectedUser.id, {
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

  // Reset elapsedTime when timerStorageKey changes
  React.useEffect(() => {
    const storedTime = sessionStorage.getItem(timerStorageKey);
    setElapsedTime(storedTime ? parseInt(storedTime, 10) : 0);
  }, [timerStorageKey]);

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

        <SheetContent side="left" className="w-80 p-0 flex flex-col">
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
                  aria-pressed={selectedUser?.username === contact.username}
                  className={cn(
                    "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-muted/40",
                    contact.isActive && "bg-accent/50",
                    selectedUser?.username === contact.username &&
                      "bg-primary/10",
                  )}
                  onClick={() => {
                    handleContactSelect(contact);
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
              <div className="p-4">{getEmptyStateMessage()}</div>
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
          @ {selectedUser.username}
        </Badge>
        <p className="text-xs text-muted-foreground truncate">
          {formatTime(elapsedTime)} - {isTimerRunning ? "Running" : "Paused"}
        </p>
      </div>

      {currentUser.role === "mentor" && (
        <button
          className="block lg:hidden"
          onClick={() => setShowCompleteDialog(true)}
        >
          <Check />
        </button>
      )}
      {currentUser.role === "mentor" && (
        <button
          className="block lg:hidden"
          onClick={() => setShowCancelDialog(true)}
        >
          <X />
        </button>
      )}

      {selectedUser.type != "Chat" && currentUser.role === "mentor" && (
        <CallButton menteeId={selectedUser.id} onPhoneClick={onPhoneClick} />
      )}
      {/* {currentUser.role === "mentor" && (
        <CallButton onPhoneClick={onPhoneClick} />
      )} */}

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
