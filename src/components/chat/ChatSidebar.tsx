import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Undo2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth.service";
import { ChatContact } from "@/types/chat.types";
import { useAppointments } from "@/hooks/useAppointments";
import { getMatchedContacts } from "@/utils/getMatchedContacts";
import { getFilteredAppointments } from "@/utils/appointmentFilter";

interface ChatSidebarProps {
  setSelectedUser: React.Dispatch<React.SetStateAction<ChatContact | null>>;
  selectedUser: ChatContact | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  setSelectedUser,
  selectedUser,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { appointments, refetch } = useAppointments();

  const currentActiveUser = React.useMemo(
    () => AuthService.getStoredUser(),
    [],
  );

  const filteredAppointments = React.useMemo(() => {
    if (!currentActiveUser?.userName || !currentActiveUser?.role) return [];

    return getFilteredAppointments(
      appointments,
      currentActiveUser.userName,
      currentActiveUser.role,
      "Chat",
    );
  }, [appointments, currentActiveUser]);

  // Filter and match contacts based on user role
  const filteredContacts = React.useMemo(() => {
    if (!currentActiveUser?.userName) return [];

    let confirmedAppointments;

    if (currentActiveUser.role === "mentee") {
      confirmedAppointments = appointments.filter(
        (appointment) => appointment.status === "confirmed",
      );
    } else {
      confirmedAppointments = filteredAppointments.filter(
        (appointment) =>
          appointment.status === "confirmed" &&
          appointment.appointmentType !== "Booking Call",
      );
    }

    confirmedAppointments = confirmedAppointments.map((appointment) => ({
      id: appointment._id,
      username:
        currentActiveUser.role === "mentor"
          ? appointment.menteeUserName
          : appointment.mentorUserName,
      avatar: "/images/avatar/male-avatar.png",
      lastMessage: "",
      mentorUserName: appointment.mentorUserName,
      duration: appointment.durationMinutes ?? 10,
      selectedSlot: appointment.selectedSlot,
    }));

    const uniqueContacts = Array.from(
      new Set(confirmedAppointments.map((a) => a.username)),
    )
      .map((username) =>
        confirmedAppointments.find((a) => a.username === username),
      )
      .filter((contact): contact is ChatContact => contact !== undefined);

    return currentActiveUser.role === "mentee"
      ? uniqueContacts.filter(
          (contact) =>
            contact?.username ===
            appointments.find(
              (app) => app.menteeUserName === currentActiveUser.userName,
            )?.mentorUserName,
        )
      : uniqueContacts;
  }, [appointments, currentActiveUser]);

  const matchedContacts = React.useMemo(() => {
    return getMatchedContacts(
      filteredContacts,
      currentActiveUser?.role === "mentor" ? currentActiveUser.userName : null,
    );
  }, [filteredContacts, currentActiveUser]);

  // Set up an interval to refresh every 60 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [refetch]);

  const handleUserSelect = React.useCallback(
    (contact: ChatContact) => {
      if (!currentActiveUser) {
        router.push("/login");
        return;
      }

      const appointment = appointments.find(
        (app) =>
          app.menteeUserName === contact.username ||
          app.mentorUserName === contact.username,
      );

      setSelectedUser({
        ...contact,
        duration: appointment?.durationMinutes ?? 10,
        selectedSlot: appointment?.selectedSlot,
      });

      const params = new URLSearchParams(searchParams);
      const isMentor = currentActiveUser.role === "mentor";

      params.set(
        "mentee",
        isMentor ? contact.username : currentActiveUser.userName,
      );
      params.set(
        "mentor",
        isMentor ? currentActiveUser.userName : contact.username,
      );
      router.push(`/chat?${params.toString()}`);
    },
    [setSelectedUser, searchParams, currentActiveUser, router, appointments],
  );

  const getEmptyStateMessage = () => {
    if (currentActiveUser?.role === "mentor") {
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

  return (
    <>
      <div className="p-2 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <Undo2 size={20} />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-muted-foreground">Chats</h1>
      </div>

      <ScrollArea className="flex-1 border-t p-2">
        <div className="space-y-1.5">
          {matchedContacts?.length > 0
            ? matchedContacts.map((contact) => (
                <div
                  key={contact.id}
                  role="button"
                  aria-pressed={selectedUser?.username === contact.username}
                  className={cn(
                    "flex items-center gap-3 p-2 cursor-pointer hover:bg-muted/50 transition-colors bg-soft-paste-light-hover rounded-xl",
                    contact.isActive && "bg-accent",
                    selectedUser?.username === contact.username &&
                      "bg-blue-100",
                  )}
                  onClick={() => handleUserSelect(contact)}
                >
                  <Avatar className="w-8 h-8 rounded-full">
                    <AvatarImage src={contact.Avatar} alt={contact.username} />
                    <AvatarFallback className="capitalize text-white bg-soft-paste-hover/80 text-sm font-bold">
                      {contact.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate text-soft-paste-darker">
                        {contact.username}
                      </span>
                      {contact.mentorName && (
                        <span className="text-sm text-muted-foreground ml-2">
                          (Mentor: {contact.mentorName})
                        </span>
                      )}
                      {contact.isActive && (
                        <span className="text-xs text-green-500 ml-auto">
                          Active
                        </span>
                      )}
                    </div>
                    {/* {contact?.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {contact.lastMessage}
                      </p>
                    )} */}
                  </div>
                </div>
              ))
            : getEmptyStateMessage()}
        </div>
      </ScrollArea>
    </>
  );
};

export default React.memo(ChatSidebar);
