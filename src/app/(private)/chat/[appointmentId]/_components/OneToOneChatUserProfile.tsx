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
// eslint-disable-next-line react/prop-types
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
  React.useEffect(() => {
    setSocket(get_socket());
  }, []);
  const handleComplete = async () => {
    try {
      if (!socket) return;
      await AppointmentService.updateAppointment(selectedUser._id, {
        status: "completed",
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
      await AppointmentService.updateAppointment(selectedUser._id, {
        status: "cancelled",
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
            Cancel
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
